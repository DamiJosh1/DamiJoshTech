import React, { useState } from 'react';
import { 
  Settings, Image as ImageIcon, Upload, Check, Copy, AlertCircle, 
  ExternalLink, Sparkles, Shield, RefreshCw, Folder, FileText, CheckCircle2 
} from 'lucide-react';
import Logo from '../../Logo';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminSettings() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setLogoPreview(dataUrl);
        // Save to localStorage for instant persistence across pages
        localStorage.setItem('sajoda_custom_logo', dataUrl);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFaviconPreview(dataUrl);
        localStorage.setItem('sajoda_custom_favicon', dataUrl);
        // Dynamically update tab favicon
        const links = document.querySelectorAll("link[rel*='icon']");
        links.forEach((l) => l.setAttribute('href', dataUrl));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Store Settings & Brand Assets</h1>
          <p className="text-sm text-zinc-500 font-medium">Manage your brand logo, favicon, and system configuration</p>
        </div>
        
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Brand changes applied successfully!</span>
          </div>
        )}
      </div>

      {/* Brand Assets Section */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">Brand Logo & Favicon Files</h2>
              <p className="text-xs text-zinc-500">Official assets displayed on your navbar, footer, and browser tabs</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Public Assets
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* File Guide Box */}
          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
              <Folder className="w-4 h-4 text-indigo-600" />
              <span>Exact File Locations on Your Server:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-zinc-200">
                <span className="text-zinc-700 truncate mr-2">/public/images/damilogo.jpg</span>
                <button
                  onClick={() => handleCopy('/public/images/damilogo.jpg')}
                  className="text-indigo-600 hover:text-indigo-700 font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedPath === '/public/images/damilogo.jpg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPath === '/public/images/damilogo.jpg' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-zinc-200">
                <span className="text-zinc-700 truncate mr-2">/public/images/favicondami.ico</span>
                <button
                  onClick={() => handleCopy('/public/images/favicondami.ico')}
                  className="text-indigo-600 hover:text-indigo-700 font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedPath === '/public/images/favicondami.ico' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPath === '/public/images/favicondami.ico' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              💡 <strong>How to change manually:</strong> You can replace <code className="font-bold text-zinc-800">damilogo.jpg</code> or add <code className="font-bold text-zinc-800">logo.png</code> into your <code className="font-bold text-zinc-800">/public/images/</code> or <code className="font-bold text-zinc-800">/public/</code> folder, and the website will automatically display it. You can also upload directly below.
            </p>
          </div>

          {/* Logo Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            
            {/* 1. Main Logo */}
            <div className="p-6 bg-zinc-50/70 rounded-2xl border border-zinc-200 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Main Store Logo</h3>
                  <span className="text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded font-mono">
                    damilogo.jpg
                  </span>
                </div>
                
                {/* Live Preview */}
                <div className="h-28 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center p-4 overflow-hidden mb-4 shadow-2xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Uploaded Logo" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <Logo className="h-10" variant="full" />
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  Used in the desktop header, mobile top navbar, checkout, and footer. Recommended size: <strong>300x80px or 400x120px</strong> (PNG with transparent background or high-res JPG).
                </p>
              </div>

              <div>
                <label className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload & Replace Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* 2. Favicon */}
            <div className="p-6 bg-zinc-50/70 rounded-2xl border border-zinc-200 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Browser Favicon & App Icon</h3>
                  <span className="text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded font-mono">
                    favicondami.ico
                  </span>
                </div>
                
                {/* Live Preview */}
                <div className="h-28 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center p-4 overflow-hidden mb-4 shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                      {faviconPreview ? (
                        <img src={faviconPreview} alt="Favicon" className="w-8 h-8 object-contain" />
                      ) : (
                        <Logo className="w-8 h-8" variant="icon" />
                      )}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-zinc-900">Browser Tab Preview</div>
                      <div className="text-zinc-400 font-mono text-[10px]">16x16 / 32x32 / 192x192</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">
                  Displayed on browser tabs, bookmarks, and mobile home screen shortcuts. Recommended format: <strong>.ico or square .png</strong> (512x512px).
                </p>
              </div>

              <div>
                <label className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload & Replace Favicon</span>
                  <input type="file" accept="image/*,.ico" onChange={handleFaviconUpload} className="hidden" />
                </label>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Human-Designed Minimalist Loading Indicator Preview */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-zinc-900 tracking-tight">Active Loading Design</h2>
            <p className="text-xs text-zinc-500">High-end, human-crafted minimalist loader with zero AI aesthetics</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
            Active Everywhere
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-8 rounded-2xl border border-zinc-200 bg-white flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-6">Light Theme Loader</span>
            <LoadingSpinner size="md" label="Loading products..." theme="light" />
          </div>

          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-6">Dark / Admin Loader</span>
            <LoadingSpinner size="md" label="Verifying clearance..." theme="dark" />
          </div>
        </div>
      </div>

    </div>
  );
}

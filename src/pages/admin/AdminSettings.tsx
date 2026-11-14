import React, { useState } from 'react';
import { 
  Settings, Image as ImageIcon, Upload, Check, Copy, AlertCircle, 
  ExternalLink, Sparkles, Shield, RefreshCw, Folder, FileText, CheckCircle2,
  DollarSign, MousePointerClick, TrendingUp, Megaphone, Plus, Trash2, Power, Eye
} from 'lucide-react';
import Logo from '../../Logo';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  getMonetizationConfig, 
  saveMonetizationConfig, 
  getAdStats, 
  MonetizationConfig, 
  AdStats 
} from '../../services/monetizationService';

export default function AdminSettings() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Monetization Config & Stats
  const [adConfig, setAdConfig] = useState<MonetizationConfig>(getMonetizationConfig());
  const [adStats, setAdStats] = useState<AdStats>(getAdStats());
  const [monetizationSaved, setMonetizationSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'monetization'>('branding');

  // New banner draft state
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImageUrl, setNewBannerImageUrl] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');
  const [newBannerSponsor, setNewBannerSponsor] = useState('');
  const [newBannerCpc, setNewBannerCpc] = useState('150');
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);

  React.useEffect(() => {
    const handleStatsUpdate = () => setAdStats(getAdStats());
    window.addEventListener('sajoda_ad_stats_updated', handleStatsUpdate);
    return () => window.removeEventListener('sajoda_ad_stats_updated', handleStatsUpdate);
  }, []);

  const handleSaveMonetization = () => {
    saveMonetizationConfig(adConfig);
    setMonetizationSaved(true);
    setTimeout(() => setMonetizationSaved(false), 3000);
  };

  const handleAddCustomBanner = () => {
    if (!newBannerTitle || !newBannerLink) return;
    const newBanner = {
      id: 'banner-' + Date.now(),
      title: newBannerTitle,
      subtitle: newBannerSubtitle || 'Partner offer for SAJODA shoppers',
      imageUrl: newBannerImageUrl || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200',
      linkUrl: newBannerLink,
      sponsorName: newBannerSponsor || 'Featured Sponsor',
      badgeText: 'Sponsored Partner',
      cpcRate: Number(newBannerCpc) || 100,
    };
    const updated = {
      ...adConfig,
      customBanners: [...adConfig.customBanners, newBanner]
    };
    setAdConfig(updated);
    saveMonetizationConfig(updated);
    // Reset form
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImageUrl('');
    setNewBannerLink('');
    setNewBannerSponsor('');
    setShowAddBannerModal(false);
    setMonetizationSaved(true);
    setTimeout(() => setMonetizationSaved(false), 3000);
  };

  const handleDeleteBanner = (id: string) => {
    const updated = {
      ...adConfig,
      customBanners: adConfig.customBanners.filter(b => b.id !== id)
    };
    setAdConfig(updated);
    saveMonetizationConfig(updated);
  };

  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset click and impression statistics?')) {
      localStorage.removeItem('sajoda_ad_stats');
      setAdStats(getAdStats());
    }
  };

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
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Store Settings & Monetization</h1>
          <p className="text-sm text-zinc-500 font-medium">Manage brand assets, Google AdSense, click earnings, and sponsored ad slots</p>
        </div>
        
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Brand changes applied!</span>
            </div>
          )}
          {monetizationSaved && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ad & Monetization settings updated!</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-100 rounded-2xl w-fit border border-zinc-200">
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'branding'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Brand Logo & Favicon</span>
        </button>

        <button
          onClick={() => setActiveTab('monetization')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'monetization'
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Monetization & Ads</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
            ₦{adStats.estimatedEarningsNgn.toLocaleString()}
          </span>
        </button>
      </div>

      {activeTab === 'branding' && (
        <>
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
    </>
  )}

      {/* MONETIZATION & AD EARNINGS TAB */}
      {activeTab === 'monetization' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Earnings Analytics Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                <span>Est. Ad Earnings</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">
                ₦{adStats.estimatedEarningsNgn.toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">
                Accumulated from paid clicks & partner referrals
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                <span>Total Ad Clicks</span>
                <MousePointerClick className="w-4 h-4 text-primary-blue" />
              </div>
              <div className="text-3xl font-black tracking-tight text-zinc-900">
                {adStats.totalClicks.toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">
                Direct clickouts to sponsor sites & WhatsApp
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                <span>Total Impressions</span>
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black tracking-tight text-zinc-900">
                {adStats.totalImpressions.toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">
                Banner views across Home & Catalog pages
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                  <span>Avg. Rate / Click</span>
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black tracking-tight text-zinc-900">
                  ₦{adStats.totalClicks > 0 ? Math.round(adStats.estimatedEarningsNgn / adStats.totalClicks) : 150}
                </div>
              </div>
              <button
                onClick={handleResetStats}
                className="text-[11px] font-bold text-zinc-400 hover:text-red-500 transition-colors text-left mt-2"
              >
                Reset Stats
              </button>
            </div>

          </div>

          {/* Master Ad Toggle & Save Bar */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${adConfig.enabled ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                <Power className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-zinc-900 text-base">Master Ad Monetization</h3>
                <p className="text-xs text-zinc-500">Enable or disable all ads and sponsored deals across the entire website</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={adConfig.enabled} 
                  onChange={(e) => {
                    const updated = { ...adConfig, enabled: e.target.checked };
                    setAdConfig(updated);
                    saveMonetizationConfig(updated);
                  }} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>

              <button
                onClick={handleSaveMonetization}
                className="px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Save Settings
              </button>
            </div>
          </div>

          {/* Channel 1: Google AdSense Setup */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Method 1
                </span>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight mt-1">Google AdSense Integration</h3>
                <p className="text-xs text-zinc-500">Earn automated Pay-Per-Click dollars directly from Google into your bank account</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${adConfig.googleAdSenseId ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-zinc-100 text-zinc-500'}`}>
                {adConfig.googleAdSenseId ? 'Configured' : 'Not Connected'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Google AdSense Publisher ID (Client ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ca-pub-1234567890123456"
                  value={adConfig.googleAdSenseId}
                  onChange={(e) => setAdConfig({ ...adConfig, googleAdSenseId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs font-mono outline-none focus:border-zinc-900"
                />
                <p className="text-[11px] text-zinc-400 mt-1.5">
                  Get this from your Google AdSense account under <strong>Account &gt; Settings &gt; Publisher ID</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Ad Unit Slot ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={adConfig.googleAdSenseSlotHome}
                  onChange={(e) => setAdConfig({ ...adConfig, googleAdSenseSlotHome: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs font-mono outline-none focus:border-zinc-900"
                />
                <p className="text-[11px] text-zinc-400 mt-1.5">
                  If left blank, Google Auto-Ads will automatically optimize ad placement.
                </p>
              </div>
            </div>
          </div>

          {/* Channel 2: Direct Sponsor Banners (Instant Cash & Pay-Per-Click) */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Method 2 (Highest Profit)
                </span>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight mt-1">Direct Partner Banners & Deals (CPC)</h3>
                <p className="text-xs text-zinc-500">Sell ad banners to local businesses, gadget repair shops, or affiliate partners (₦50–₦300 per click or ₦50,000/month)</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddBannerModal(true)}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sponsor Banner</span>
                </button>
              </div>
            </div>

            {/* Banner List */}
            <div className="space-y-4">
              {adConfig.customBanners.map((banner) => (
                <div key={banner.id} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={banner.imageUrl} alt={banner.title} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-zinc-200" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded uppercase">
                          {banner.sponsorName}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          ₦{banner.cpcRate} / click
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-zinc-900 mt-1">{banner.title}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-1">{banner.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={banner.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-colors"
                      title="Preview link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for adding a banner */}
            {showAddBannerModal && (
              <div className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 space-y-4 animate-fade-in">
                <h4 className="font-bold text-sm text-zinc-900">Add New Sponsor / Affiliate Banner</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Sponsor / Partner Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Starlink Nigeria, PowerVolt Inverters"
                      value={newBannerSponsor}
                      onChange={(e) => setNewBannerSponsor(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Earnings Rate per Click (₦ NGN)</label>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      value={newBannerCpc}
                      onChange={(e) => setNewBannerCpc(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Banner Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 24/7 Solar Power Backup for Electronics"
                      value={newBannerTitle}
                      onChange={(e) => setNewBannerTitle(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Target Link URL (WhatsApp or Partner Link)</label>
                    <input
                      type="text"
                      placeholder="https://wa.me/234... or affiliate link"
                      value={newBannerLink}
                      onChange={(e) => setNewBannerLink(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-zinc-700 block mb-1">Banner Subtitle / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Install high-speed satellite internet in 24 hours. Full kit in stock."
                      value={newBannerSubtitle}
                      onChange={(e) => setNewBannerSubtitle(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-zinc-700 block mb-1">Banner Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={newBannerImageUrl}
                      onChange={(e) => setNewBannerImageUrl(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAddBannerModal(false)}
                    className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCustomBanner}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    Save & Activate Banner
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Channel 3: Top Monetized Announcement Bar */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Method 3
                </span>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight mt-1">Top Announcement Sponsored Bar</h3>
                <p className="text-xs text-zinc-500">A high-visibility banner fixed at the very top of every page for maximum clicks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={adConfig.topBarAdEnabled} 
                  onChange={(e) => setAdConfig({ ...adConfig, topBarAdEnabled: e.target.checked })} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Sponsor Tag</label>
                <input
                  type="text"
                  value={adConfig.topBarAdSponsor}
                  onChange={(e) => setAdConfig({ ...adConfig, topBarAdSponsor: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 rounded-xl"
                  placeholder="e.g. SolarTech"
                />
              </div>
              <div className="md:col-span-2">
                <label className="font-bold text-zinc-700 block mb-1">Ad Message Text</label>
                <input
                  type="text"
                  value={adConfig.topBarAdText}
                  onChange={(e) => setAdConfig({ ...adConfig, topBarAdText: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 rounded-xl"
                  placeholder="e.g. High-speed Starlink Kits & Solar inverters in stock..."
                />
              </div>
              <div className="md:col-span-3">
                <label className="font-bold text-zinc-700 block mb-1">Destination Click URL</label>
                <input
                  type="text"
                  value={adConfig.topBarAdLink}
                  onChange={(e) => setAdConfig({ ...adConfig, topBarAdLink: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 rounded-xl font-mono text-[11px]"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Recent Paid Clicks Log */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight">Recent Ad Clicks Log</h3>
                <p className="text-xs text-zinc-500">Live feed of visitor clicks earning revenue on your store</p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">
                {adStats.clickLog.length} recorded clicks
              </span>
            </div>

            {adStats.clickLog.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400 font-medium">
                No clicks recorded yet. As visitors browse and click your banners or sponsor deals, each click will appear here with earnings.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 max-h-60 overflow-y-auto">
                {adStats.clickLog.map((log, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        ₦
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{log.sponsor}</p>
                        <p className="text-[10px] text-zinc-400">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-600">
                      +₦{log.earnings}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

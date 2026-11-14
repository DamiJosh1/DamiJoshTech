import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Check, CheckCircle2, Copy, ExternalLink, Image as ImageIcon,
  Link2, Loader2, RefreshCw, Sparkles, Upload, Video, Wand2, Webhook,
  AlertTriangle, Eye, ArrowRight, Radio, ShieldCheck, Trash2, Plus
} from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

interface TikTokSyncJob {
  id: string;
  tiktokPostId?: string;
  tiktokUrl?: string;
  rawCaption: string;
  finishedName: string;
  price: number;
  condition: 'new' | 'used';
  category: string;
  productId: string;
  thumbnail: string;
  status: 'published' | 'draft' | 'failed';
  sourceType: 'webhook' | 'rss_auto' | 'link_import' | 'quick_finish';
  processedAt: string;
}

interface TikTokSyncConfig {
  tiktokHandle: string;
  profileNickname: string;
  profileAvatar: string;
  profileVerified: boolean;
  rssFeedUrl: string;
  webhookSecret: string;
  autoSyncEnabled: boolean;
  autoPublish: boolean;
  keepExactPostedPrice: boolean;
  defaultRiderBuffer: number;
  defaultSourcingHub: string;
  lastCheckedAt: string | null;
  syncedVideoIds: string[];
  recentJobs: TikTokSyncJob[];
}

// Compress uploaded phone photos client-side for fast Firestore/API storage
async function compressImageToDataUrl(file: File, maxWidth = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(String(ev.target?.result || ''));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Could not read image file'));
      img.src = String(ev.target?.result || '');
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

export default function AdminAiTikTokSync() {
  const [config, setConfig] = useState<TikTokSyncConfig | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Account & Automation Settings Form
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [rssFeedUrl, setRssFeedUrl] = useState('');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [autoPublish, setAutoPublish] = useState(true);
  const [keepExactPostedPrice, setKeepExactPostedPrice] = useState(true);
  const [defaultRiderBuffer, setDefaultRiderBuffer] = useState(5000);
  const [savingConfig, setSavingConfig] = useState(false);
  const [syncingNow, setSyncingNow] = useState(false);

  // Active Worker Input Mode
  const [inputMode, setInputMode] = useState<'link' | 'quick'>('link');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [rawCaption, setRawCaption] = useState('');
  const [conditionHint, setConditionHint] = useState<'auto' | 'new' | 'used'>('auto');
  const [categoryHint, setCategoryHint] = useState<'auto' | 'Home Appliances' | 'Electronics' | 'Latest Gadgets'>('auto');
  const [priceOverride, setPriceOverride] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Processing & Preview State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/tiktok/config');
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
        setWebhookUrl(data.webhookUrl || `${window.location.origin}/api/tiktok/webhook`);
        setTiktokHandle(data.config.tiktokHandle || '');
        setRssFeedUrl(data.config.rssFeedUrl || '');
        setAutoSyncEnabled(data.config.autoSyncEnabled ?? true);
        setAutoPublish(data.config.autoPublish ?? true);
        setKeepExactPostedPrice(data.config.keepExactPostedPrice ?? true);
        setDefaultRiderBuffer(data.config.defaultRiderBuffer ?? 5000);
      }
    } catch (err) {
      console.error('Failed to load TikTok config:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveAccountConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setStatusNotice(null);
    try {
      const res = await fetch('/api/tiktok/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tiktokHandle,
          rssFeedUrl,
          autoSyncEnabled,
          autoPublish,
          keepExactPostedPrice,
          defaultRiderBuffer
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not save TikTok settings');
      }
      setConfig(data.config);
      if (data.webhookUrl) setWebhookUrl(data.webhookUrl);

      // Persist copy in Firestore settings for admin audit
      try {
        await setDoc(doc(db, 'settings', 'tiktok_sync'), {
          tiktokHandle: data.config.tiktokHandle,
          autoSyncEnabled: data.config.autoSyncEnabled,
          autoPublish: data.config.autoPublish,
          keepExactPostedPrice: data.config.keepExactPostedPrice,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch {
        // Non-blocking if user session isn't admin-token yet
      }

      setStatusNotice({
        type: 'success',
        text: data.config.tiktokHandle
          ? `Connected TikTok account ${data.config.tiktokHandle}${data.config.profileVerified ? ' (Verified Live Profile)' : ''} & saved auto-sync rules!`
          : 'Saved TikTok Auto-Sync preferences!'
      });
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncingNow(true);
    setStatusNotice(null);
    try {
      const res = await fetch('/api/tiktok/sync-now', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Sync failed');
      if (data.config) setConfig(data.config);
      setStatusNotice({ type: 'success', text: data.message });
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message });
    } finally {
      setSyncingNow(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = (Array.from(e.target.files || []) as File[]).slice(0, 4 - uploadedImages.length);
    if (files.length === 0) return;
    try {
      const compressed = await Promise.all(files.map((f: File) => compressImageToDataUrl(f)));
      setUploadedImages(prev => [...prev, ...compressed].slice(0, 4));
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message || 'Failed to read image' });
    }
    e.target.value = '';
  };

  const handleRunAiWorker = async (publishImmediately: boolean) => {
    setIsProcessing(true);
    setStatusNotice(null);
    setPreviewProduct(null);

    try {
      const endpoint = inputMode === 'link' ? '/api/tiktok/import-post' : '/api/tiktok/finish-words';
      const payload = inputMode === 'link'
        ? {
            tiktokUrl: tiktokUrl.trim(),
            rawCaptionOverride: rawCaption.trim() || undefined,
            images: uploadedImages,
            conditionHint,
            categoryHint,
            priceOverride: priceOverride ? Number(priceOverride) : undefined,
            publishImmediately
          }
        : {
            rawCaption: rawCaption.trim(),
            images: uploadedImages,
            conditionHint,
            categoryHint,
            priceOverride: priceOverride ? Number(priceOverride) : undefined,
            tiktokUrl: tiktokUrl.trim(),
            publishImmediately
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process with AI Worker');
      }

      if (data.published) {
        if (data.config) setConfig(data.config);
        setStatusNotice({
          type: 'success',
          text: `AI Worker finished the words and published "${data.product.name}" live to your website!`
        });
        setTiktokUrl('');
        setRawCaption('');
        setPriceOverride('');
        setUploadedImages([]);
      } else {
        setPreviewProduct(data.product);
      }
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishPreview = async () => {
    if (!previewProduct) return;
    setIsPublishing(true);
    setStatusNotice(null);
    try {
      const res = await fetch('/api/tiktok/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: previewProduct,
          sourceType: inputMode === 'link' ? 'link_import' : 'quick_finish',
          rawCaption: previewProduct.rawCaption || rawCaption
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to publish');
      if (data.config) setConfig(data.config);
      setStatusNotice({
        type: 'success',
        text: `Published "${data.product.name}" straight to your live store!`
      });
      setPreviewProduct(null);
      setTiktokUrl('');
      setRawCaption('');
      setPriceOverride('');
      setUploadedImages([]);
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message });
    } finally {
      setIsPublishing(false);
    }
  };

  if (loadingConfig) {
    return (
      <div className="py-16 flex items-center justify-center gap-2 text-zinc-500 text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
        Loading TikTok Auto-Sync Worker...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-slate-900 to-rose-950 text-white border border-rose-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-200 border border-rose-500/30 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> TikTok → Website Auto-Sync
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-500/30 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> AI Worker "Finish Words" Engine
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Post on TikTok, Let the AI Worker Finish the Words & Publish
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Connect your TikTok account below. Whenever you post a product on TikTok (or drop a casual note + photos here), the AI Worker automatically turns your short caption into a clean product title, extracts the Naira price & accessories, sets Brand New or Fairly Used status, and puts it live on your store.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {config?.tiktokHandle && (
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/15 rounded-2xl">
                {config.profileAvatar ? (
                  <img src={config.profileAvatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/30" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-500/30 flex items-center justify-center font-black">
                    {config.tiktokHandle.replace('@', '').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1">
                    {config.tiktokHandle}
                    {config.profileVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-zinc-300">
                    {config.autoSyncEnabled ? 'Auto-Sync Active' : 'Manual Sync'}
                  </div>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleSyncNow}
              disabled={syncingNow}
              className="px-5 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              {syncingNow ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Sync TikTok Now
            </button>
          </div>
        </div>
      </div>

      {statusNotice && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 ${
            statusNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          {statusNotice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <p className="text-sm font-bold flex-1">{statusNotice.text}</p>
          <Link to="/shop" target="_blank" className="text-xs font-black underline whitespace-nowrap">
            View Shop →
          </Link>
        </div>
      )}

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: AI Worker "Finish Words" & TikTok Post Importer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  AI Worker: Finish Words & Publish
                </h2>
                <p className="text-xs text-zinc-500">
                  Paste your TikTok post link or type quick casual words — the AI Worker handles all the clean writing.
                </p>
              </div>
              <div className="flex bg-zinc-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setInputMode('link')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inputMode === 'link' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  TikTok Link
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('quick')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inputMode === 'quick' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Quick Note + Photos
                </button>
              </div>
            </div>

            {inputMode === 'link' && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Your TikTok Post Link
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
                  <input
                    type="url"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@yourhandle/video/742..."
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-600 outline-none"
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  We automatically pull your real TikTok thumbnail & caption. Add extra caption notes or real phone photos below if you want.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                {inputMode === 'link' ? 'Casual Caption / Extra Details (Optional if TikTok caption is clear)' : 'Your Casual Product Words / Price Note'}
              </label>
              <textarea
                rows={3}
                value={rawCaption}
                onChange={(e) => setRawCaption(e.target.value)}
                placeholder={'Example: "This ac is together with the accessories, Hanger, wire and pipe is 250k Is Korean made and is 1.5hp fairly used working fine"'}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-600 outline-none resize-none"
              />
            </div>

            {/* Real Product Photos Upload (Max 4) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  Real Product Photos ({uploadedImages.length}/4)
                </label>
                <span className="text-[11px] text-zinc-400">Optional on link mode (uses TikTok cover)</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 4 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-zinc-300 hover:border-purple-500 hover:bg-purple-50/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-zinc-500 hover:text-purple-700">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Condition / Category / Price Overrides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Condition</label>
                <select
                  value={conditionHint}
                  onChange={(e: any) => setConditionHint(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 outline-none"
                >
                  <option value="auto">Auto-Detect from Words</option>
                  <option value="used">Fairly Used / Tokunbo</option>
                  <option value="new">Brand New (Sealed)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Category</label>
                <select
                  value={categoryHint}
                  onChange={(e: any) => setCategoryHint(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 outline-none"
                >
                  <option value="auto">Auto-Detect Category</option>
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Latest Gadgets">Latest Gadgets</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Price Override (₦)</label>
                <input
                  type="number"
                  value={priceOverride}
                  onChange={(e) => setPriceOverride(e.target.value)}
                  placeholder="Auto from words"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessing || (inputMode === 'link' ? !tiktokUrl.trim() : !rawCaption.trim())}
                onClick={() => handleRunAiWorker(false)}
                className="flex-1 py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                Preview AI Finished Words
              </button>
              <button
                type="button"
                disabled={isProcessing || (inputMode === 'link' ? !tiktokUrl.trim() : !rawCaption.trim())}
                onClick={() => handleRunAiWorker(true)}
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-95 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Finish Words & Publish Live
              </button>
            </div>
          </div>

          {/* Preview Result Before/After */}
          {previewProduct && (
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-500 shadow-xl space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                    AI Worker Finished Listing
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    previewProduct.condition === 'used' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {previewProduct.condition === 'used' ? 'Fairly Used • Working Fine' : 'Brand New'}
                  </span>
                </div>
                <span className="text-lg font-black text-zinc-900">
                  ₦{Number(previewProduct.price).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                  <img src={previewProduct.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Polished Title (Editable)</label>
                    <input
                      type="text"
                      value={previewProduct.name}
                      onChange={(e) => setPreviewProduct({ ...previewProduct, name: e.target.value })}
                      className="w-full font-black text-base text-zinc-900 border-b border-zinc-200 focus:border-purple-600 outline-none py-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Polished Description</label>
                    <textarea
                      rows={4}
                      value={previewProduct.description}
                      onChange={(e) => setPreviewProduct({ ...previewProduct, description: e.target.value })}
                      className="w-full text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              {previewProduct.features && previewProduct.features.length > 0 && (
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <div className="text-[11px] font-bold text-zinc-600 uppercase mb-2">Finished Key Highlights</div>
                  <ul className="space-y-1 text-xs text-zinc-700">
                    {previewProduct.features.map((f: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublishPreview}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Approve & Publish to Live Website (₦{Number(previewProduct.price).toLocaleString()})
              </button>
            </div>
          )}
        </div>

        {/* Right: TikTok Account Connection & Hands-Free Automation Setup (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSaveAccountConfig} className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-600" />
              1. Your TikTok Account Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                TikTok Account Handle
              </label>
              <input
                type="text"
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
                placeholder="@sajodaelectronics"
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-900 focus:border-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                TikTok RSS Feed URL (Optional Background Poller)
              </label>
              <input
                type="url"
                value={rssFeedUrl}
                onChange={(e) => setRssFeedUrl(e.target.value)}
                placeholder="https://rss.app/feeds/your-tiktok-feed.xml"
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:border-rose-500 outline-none"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Paste a free TikTok RSS feed (e.g. RSS.app) so the worker checks for new posts every 3 minutes automatically.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-zinc-100">
              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-zinc-900">Auto-Sync New TikTok Posts</div>
                  <div className="text-[11px] text-zinc-500">Automatically process incoming TikTok videos</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSyncEnabled}
                  onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                  className="w-4 h-4 accent-rose-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-zinc-900">Publish Live Immediately</div>
                  <div className="text-[11px] text-zinc-500">Uncheck to save as drafts for approval first</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-zinc-900">Keep Exact TikTok Price</div>
                  <div className="text-[11px] text-zinc-500">Use exact amount you wrote (e.g. 250k → ₦250,000)</div>
                </div>
                <input
                  type="checkbox"
                  checked={keepExactPostedPrice}
                  onChange={(e) => setKeepExactPostedPrice(e.target.checked)}
                  className="w-4 h-4 accent-purple-600"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={savingConfig}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {savingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save & Connect TikTok Account
            </button>
          </form>

          {/* Zero-Touch Webhook Setup Card */}
          <div className="bg-zinc-950 text-white rounded-3xl p-6 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Webhook className="w-4 h-4 text-emerald-400" />
                2. Instant Zero-Touch Webhook
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Make.com / Zapier Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Want every TikTok post from your phone to appear on your website within seconds automatically? Connect TikTok → HTTP Webhook in Make.com, Zapier, or IFTTT using this URL:
            </p>

            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Webhook Endpoint (POST JSON)</div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl">
                <code className="text-[11px] text-emerald-300 truncate flex-1">{webhookUrl}</code>
                <button
                  type="button"
                  onClick={() => copyText(webhookUrl, 'url')}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs cursor-pointer"
                >
                  {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {config?.webhookSecret && (
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-zinc-400">Secret Key (Optional Header or Body)</div>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl">
                  <code className="text-[11px] text-amber-300 truncate flex-1">{config.webhookSecret}</code>
                  <button
                    type="button"
                    onClick={() => copyText(config.webhookSecret, 'secret')}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs cursor-pointer"
                  >
                    {copiedKey === 'secret' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl text-[11px] text-zinc-300 font-mono overflow-x-auto">
              {`{ "videoUrl": "{{tiktok_url}}", "caption": "{{caption}}", "thumbnailUrl": "{{cover_url}}" }`}
            </div>
          </div>
        </div>
      </div>

      {/* Recent AI Worker TikTok Sync Jobs */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600" />
              AI Worker Finished TikTok Products ({config?.recentJobs?.length || 0})
            </h3>
            <p className="text-xs text-zinc-500">
              Every TikTok video/note the AI Worker polished and pushed to your website.
            </p>
          </div>
          {config?.lastCheckedAt && (
            <span className="text-[11px] text-zinc-400">
              Last checked: {new Date(config.lastCheckedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        {!config?.recentJobs || config.recentJobs.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-100 text-xs text-zinc-500 space-y-1">
            <p className="font-bold text-zinc-700">No TikTok posts synced yet.</p>
            <p>Paste a TikTok link or drop a quick casual note above to watch the AI Worker finish the words and publish it automatically!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {config.recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={job.thumbnail}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover bg-white border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                        {job.sourceType.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        job.condition === 'used' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {job.condition === 'used' ? 'Fairly Used' : 'Brand New'}
                      </span>
                      <span className="text-xs font-black text-zinc-900">₦{Number(job.price).toLocaleString()}</span>
                    </div>
                    <h4 className="text-xs font-black text-zinc-900 truncate">{job.finishedName}</h4>
                    <p className="text-[11px] text-zinc-500 truncate">
                      Raw TikTok note: "{job.rawCaption}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/product/${job.productId}`}
                    target="_blank"
                    className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-zinc-400 rounded-xl text-xs font-bold text-zinc-800 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Live
                  </Link>
                  <Link
                    to={`/admin/products/${job.productId}`}
                    className="px-3 py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

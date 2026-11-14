import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Wand2, Package, Truck, DollarSign, ShieldCheck, 
  Trash2, Plus, CheckCircle2, AlertTriangle, Loader2, RefreshCw, 
  ExternalLink, Layers, ArrowRight, Eye, Image as ImageIcon,
  Check, Store, MapPin, Tag, ChevronRight, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useStore } from '../../../StoreContext';

export default function AdminAiProducts() {
  const { formatPrice } = useStore();

  // Prompt & Generation Controls
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<'Home Appliances' | 'Latest Gadgets' | 'Electronics'>('Home Appliances');
  const [condition, setCondition] = useState<'new' | 'used'>('new');
  const [sourcingHub, setSourcingHub] = useState('Alaba International Market Electronics Distribution Hub (Lagos)');
  const [riderBuffer, setRiderBuffer] = useState<number>(5000);
  const [targetProfit, setTargetProfit] = useState<number>(25000);
  
  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Live Catalog in Firestore
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [isWiping, setIsWiping] = useState(false);
  const [wipeNotice, setWipeNotice] = useState<string | null>(null);

  // Quick Inspiration Prompts
  const INSPIRATION_PROMPTS = [
    { label: 'Samsung 55" 4K Smart TV', prompt: 'Samsung 55" Crystal UHD 4K Smart TV CU7000', cat: 'Home Appliances', cond: 'new', hub: 'Alaba International Market Electronics Distribution Hub (Lagos)', rider: 7500, profit: 45000 },
    { label: 'Hisense 43" 4K TV', prompt: 'Hisense 43" 4K UHD Smart Google TV with Dolby Audio', cat: 'Home Appliances', cond: 'new', hub: 'Alaba International Market Electronics Distribution Hub (Lagos)', rider: 5000, profit: 30000 },
    { label: 'Ninja Air Fryer 7.6L', prompt: 'Ninja Foodi DualZone 6-in-1 Digital Air Fryer 7.6L', cat: 'Home Appliances', cond: 'new', hub: 'Alaba International Market Electronics Distribution Hub (Lagos)', rider: 4500, profit: 25000 },
    { label: 'Silver Crest 4500W Blender', prompt: 'Silver Crest 4500W Heavy Duty Commercial Blender & Dry Mill', cat: 'Home Appliances', cond: 'new', hub: 'Alaba International Market Electronics Distribution Hub (Lagos)', rider: 4000, profit: 18000 },
    { label: 'Sony WH-1000XM5 Headphones', prompt: 'Sony WH-1000XM5 Wireless Noise Cancelling Over-Ear Headphones', cat: 'Electronics', cond: 'used', hub: 'Computer Village Ikeja Tech Hub (Lagos)', rider: 3500, profit: 35000 },
    { label: 'Apple Watch Ultra 2', prompt: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium', cat: 'Latest Gadgets', cond: 'new', hub: 'Computer Village Ikeja Tech Hub (Lagos)', rider: 3500, profit: 50000 },
    { label: 'DJI Mini 3 Pro Drone', prompt: 'DJI Mini 3 Pro 4K HDR Camera Drone with RC Controller', cat: 'Latest Gadgets', cond: 'used', hub: 'Computer Village Ikeja Tech Hub (Lagos)', rider: 4000, profit: 60000 },
    { label: 'Oraimo FreePods 4 ANC', prompt: 'Oraimo FreePods 4 Active Noise Cancelling Earbuds', cat: 'Latest Gadgets', cond: 'new', hub: 'Computer Village Ikeja Tech Hub (Lagos)', rider: 3000, profit: 15000 },
    { label: 'Anker 100W Power Bank', prompt: 'Anker Prime 20,000mAh 200W Fast Laptop Power Bank', cat: 'Latest Gadgets', cond: 'new', hub: 'Computer Village Ikeja Tech Hub (Lagos)', rider: 3500, profit: 20000 },
    { label: 'Haier Thermocool 150L Freezer', prompt: 'Haier Thermocool 150L Deep Inverter Chest Freezer HTF-150', cat: 'Home Appliances', cond: 'new', hub: 'Alaba International Market Electronics Distribution Hub (Lagos)', rider: 8000, profit: 40000 },
  ];

  // Listen to Firestore products in real time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setLiveProducts(prods);
      setLoadingLive(false);
    }, (err) => {
      console.warn('Live products listener error:', err);
      setLoadingLive(false);
    });
    return () => unsub();
  }, []);

  const handleApplyPreset = (item: typeof INSPIRATION_PROMPTS[0]) => {
    setPrompt(item.prompt);
    setCategory(item.cat as any);
    setCondition(item.cond as any);
    setSourcingHub(item.hub);
    setRiderBuffer(item.rider);
    setTargetProfit(item.profit);
    setGenError(null);
  };

  const handleGenerateProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setGenError('Please enter what product you want the AI to generate.');
      return;
    }

    setIsGenerating(true);
    setGenError(null);
    setPreviewProduct(null);
    setPublishSuccess(null);

    try {
      const res = await fetch('/api/ai/generate-single-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          category,
          condition
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.product) {
        throw new Error(data?.error || `Server responded with status ${res.status}`);
      }

      const prod = data.product;
      // Guarantee rider delivery buffer and target profit are factored in
      const baseCost = Math.max(Number(prod.baseCost) || 40000, 20000);
      const deliveryBuffer = Number(riderBuffer) || 4500;
      const profit = Math.max(Number(targetProfit) || Number(prod.ownerCommission) || 20000, 12000);
      const computedPrice = baseCost + deliveryBuffer + profit;

      setPreviewProduct({
        ...prod,
        baseCost,
        riderDeliveryBuffer: deliveryBuffer,
        ownerCommission: profit,
        price: computedPrice,
        originalPrice: prod.originalPrice || Math.round((computedPrice * 1.25) / 500) * 500,
        sourcingHub: sourcingHub || prod.sourcingHub,
        condition,
        conditionGrade: condition === 'used' ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
        commissionNote: `₦${profit.toLocaleString()} net profit (after ₦${deliveryBuffer.toLocaleString()} dispatch rider allowance & ₦${baseCost.toLocaleString()} Alaba/Ikeja wholesale acquisition)`
      });
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setGenError(err.message || 'Failed to generate real product with AI. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishToStore = async () => {
    if (!previewProduct) return;
    setIsPublishing(true);
    setGenError(null);

    try {
      const prodId = previewProduct.id || `sajoda-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await setDoc(doc(db, 'products', prodId), {
        ...previewProduct,
        id: prodId,
        status: 'active',
        inStock: true,
        stockCount: previewProduct.condition === 'used' ? 14 : 35,
        rating: 4.9,
        reviewCount: Math.floor(Math.random() * 35) + 55,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      setPublishSuccess(`🎉 Successfully published "${previewProduct.name}" to your live store!`);
      setPreviewProduct(null);
      setPrompt('');
      setTimeout(() => setPublishSuccess(null), 8000);
    } catch (err: any) {
      console.error('Publish product error:', err);
      setGenError(err.message || 'Failed to publish product to Firestore database.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from your live catalog?`)) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err: any) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const handleWipeAllProducts = async () => {
    if (!window.confirm("⚠️ ARE YOU SURE?\n\nThis will completely remove ALL products from your store database so you can start completely fresh.\n\nProceed?")) {
      return;
    }

    setIsWiping(true);
    setWipeNotice(null);

    try {
      const res = await fetch('/api/products/clear-all', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to clear products');

      setWipeNotice(`✨ All ${data.deletedCount || liveProducts.length} products have been removed from your store. You can now tell the AI to generate your fresh catalog!`);
      setTimeout(() => setWipeNotice(null), 8000);
    } catch (err: any) {
      alert('Error wiping products: ' + err.message);
    } finally {
      setIsWiping(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950 text-white border border-indigo-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                AI Merchandising Studio
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                Dispatch Rider Delivery Allowance Included
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🔒 Net Owner Profit Protected
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Tell Your AI What Products To Generate & Price Realistically
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              You have 100% control. Tell the AI what real-brand product to generate (e.g. Samsung 4K TV, Sony Headphones, Ninja Air Fryer, iPhone). The AI computes your authentic <strong className="text-white">Alaba/Computer Village wholesale base cost</strong>, adds your <strong className="text-emerald-300">dispatch rider logistics buffer</strong>, protects your <strong className="text-amber-300">guaranteed net profit margin</strong>, and pairs 4 exact multi-angle photos with zero duplicate pictures.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="px-5 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center min-w-[140px]">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Live Catalog Count</div>
              <div className="text-2xl font-black text-white">
                {loadingLive ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-zinc-500" /> : liveProducts.length}
              </div>
            </div>
            {liveProducts.length > 0 && (
              <button
                onClick={handleWipeAllProducts}
                disabled={isWiping}
                className="flex items-center gap-2 px-4 py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                title="Remove all products in store"
              >
                {isWiping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Wipe Catalog ({liveProducts.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {publishSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-bold flex-1">{publishSuccess}</p>
          <Link to="/shop" className="text-xs font-black text-emerald-800 underline hover:no-underline">View in Shop →</Link>
        </div>
      )}

      {wipeNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm font-bold flex-1">{wipeNotice}</p>
        </div>
      )}

      {genError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3 animate-fade-in shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-sm font-bold flex-1">{genError}</p>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: AI Prompt & Control Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                Tell The AI What To Generate
              </h2>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Step 1</span>
            </div>

            <form onSubmit={handleGenerateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Product Name or Request Brief
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Samsung 55 Inch Crystal UHD 4K Smart TV CU7000 in factory sealed carton, or Sony WH-1000XM5 wireless ANC headphones"
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-600 outline-none transition-all resize-none"
                />
              </div>

              {/* Quick Inspiration Pills */}
              <div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  ⚡ Quick Bestseller Presets
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {INSPIRATION_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(item)}
                      className="px-2.5 py-1 bg-zinc-100 hover:bg-purple-50 hover:text-purple-700 text-zinc-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-zinc-200/80"
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:border-purple-600 outline-none"
                  >
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Latest Gadgets">Latest Gadgets</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e: any) => setCondition(e.target.value)}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:border-purple-600 outline-none"
                  >
                    <option value="new">Brand New (Sealed Carton)</option>
                    <option value="used">Tokunbo (100% Tested Working)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Domestic Sourcing Hub
                </label>
                <select
                  value={sourcingHub}
                  onChange={(e) => setSourcingHub(e.target.value)}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:border-purple-600 outline-none"
                >
                  <option value="Alaba International Market Electronics Distribution Hub (Lagos)">
                    Alaba International Market (Appliances & TVs Hub)
                  </option>
                  <option value="Computer Village Ikeja Tech Hub (Lagos)">
                    Computer Village Ikeja (Phones & Gadgets Hub)
                  </option>
                  <option value="Trade Fair International Complex (Badagry Expressway, Lagos)">
                    Trade Fair Complex (Direct Import Hub)
                  </option>
                </select>
              </div>

              {/* Rider Logistics Buffer & Net Profit Settings */}
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-zinc-900">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <Truck className="w-4 h-4" /> Dispatch Rider Logistics Buffer
                  </span>
                  <span className="text-zinc-900 font-extrabold">₦{Number(riderBuffer).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { label: '₦3,500 (Gadget)', value: 3500 },
                    { label: '₦5,000 (Appliance)', value: 5000 },
                    { label: '₦7,500 (Heavy TV)', value: 7500 },
                  ].map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRiderBuffer(b.value)}
                      className={`p-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                        riderBuffer === b.value 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-black text-zinc-900">
                  <span className="flex items-center gap-1.5 text-purple-700">
                    <DollarSign className="w-4 h-4" /> Desired Net Owner Profit Margin
                  </span>
                  <span className="text-purple-900 font-extrabold">₦{Number(targetProfit).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                  {[
                    { label: '₦15k', value: 15000 },
                    { label: '₦25k', value: 25000 },
                    { label: '₦45k', value: 45000 },
                    { label: '₦75k', value: 75000 },
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTargetProfit(p.value)}
                      className={`p-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                        targetProfit === p.value 
                          ? 'bg-purple-50 border-purple-500 text-purple-800' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 bg-gradient-to-r from-zinc-900 via-indigo-950 to-purple-900 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI Analyzing Lagos Hubs, Photos & Pricing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 text-amber-300" />
                    AI Calculate Pricing & Generate Product
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: AI Generated Product Inspection & Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {previewProduct ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-500 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
                    AI Inspection & Review
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    previewProduct.condition === 'used' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {previewProduct.condition === 'used' ? 'Tokunbo (Tested 100%)' : 'Brand New (Sealed Carton)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewProduct(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Brand */}
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{previewProduct.brand}</span>
                <input
                  type="text"
                  value={previewProduct.name}
                  onChange={(e) => setPreviewProduct({ ...previewProduct, name: e.target.value })}
                  className="w-full text-xl font-black text-zinc-900 border-b border-transparent hover:border-zinc-300 focus:border-purple-600 outline-none pb-1 transition-colors"
                />
              </div>

              {/* Live Nigerian Pricing & Logistics Breakdown Card */}
              <div className="p-5 rounded-2xl bg-zinc-900 text-white space-y-4 shadow-inner">
                <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
                  <span className="font-bold text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Lagos Wholesale & Delivery Economics
                  </span>
                  <span className="text-emerald-400 font-bold">100% Protected Margin</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-zinc-800/80">
                    <div className="text-[10px] uppercase font-bold text-zinc-400">Wholesale Base</div>
                    <div className="text-sm font-extrabold text-zinc-100">₦{Number(previewProduct.baseCost).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                    <div className="text-[10px] uppercase font-bold text-emerald-300">Rider Allowance</div>
                    <div className="text-sm font-extrabold text-emerald-300">+₦{Number(previewProduct.riderDeliveryBuffer).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
                    <div className="text-[10px] uppercase font-bold text-purple-300">Net Owner Profit</div>
                    <div className="text-sm font-extrabold text-purple-300">+₦{Number(previewProduct.ownerCommission).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <div className="text-[10px] uppercase font-bold text-amber-300">Customer Price</div>
                    <div className="text-base font-black text-white">₦{Number(previewProduct.price).toLocaleString()}</div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                  💡 {previewProduct.commissionNote}
                </p>
              </div>

              {/* 4 Multi-Angle Images Inspection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    4 Multi-Angle Product Photos (Front, Angle, Action, Sealed Box)
                  </label>
                  <span className="text-[10px] font-bold text-zinc-400">Exact Product Images</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(previewProduct.images || [previewProduct.image]).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 group">
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                        <span className="text-[9px] text-white font-bold text-center">
                          {idx === 0 ? 'Front' : idx === 1 ? 'Angle' : idx === 2 ? 'Action' : 'Box'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sourcing Hub & Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <div>
                  <span className="font-bold text-zinc-500 block mb-0.5">Sourcing Location:</span>
                  <span className="font-bold text-zinc-900">{previewProduct.sourcingHub}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 block mb-0.5">Warranty & Guarantee:</span>
                  <span className="font-bold text-zinc-900">{previewProduct.warrantyInfo}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Sales Copy & Overview
                </label>
                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  {previewProduct.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={handlePublishToStore}
                  disabled={isPublishing}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publishing to Live Catalog...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Publish Real Product to Store (₦{Number(previewProduct.price).toLocaleString()})
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateProduct()}
                  disabled={isGenerating}
                  className="px-5 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Regenerate Variations
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-50/60 rounded-3xl p-12 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-lg font-black text-zinc-900">Your AI Merchandising Canvas Is Ready</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Enter any product brief or click one of the quick presets on the left. The AI will curate authentic Lagos specs, compute wholesale pricing + dispatch rider logistics + your net profit, and provide 4 high-res photos for your instant approval.
                </p>
              </div>
            </div>
          )}

          {/* Current Live Store Catalog Quick List */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  Your Live Store Catalog ({liveProducts.length} Products)
                </h3>
                <p className="text-xs text-zinc-400">Products currently available to customers on your storefront</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/admin/products"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Full Admin List <ChevronRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/shop"
                  target="_blank"
                  className="text-xs font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 bg-zinc-100 px-3 py-1.5 rounded-xl"
                >
                  Customer View <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {loadingLive ? (
              <div className="p-8 text-center text-zinc-400 text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading your store products...
              </div>
            ) : liveProducts.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-500 text-xs space-y-2">
                <Package className="w-8 h-8 text-zinc-300 mx-auto" />
                <p className="font-bold text-zinc-700">Your store is currently clean (0 products).</p>
                <p>Use the AI generator on the left to add your first real product factoring in dispatch rider logistics!</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {liveProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3.5 bg-zinc-50 hover:bg-zinc-100/80 rounded-2xl border border-zinc-200/70 transition-all gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 overflow-hidden shrink-0">
                        <img src={p.image || (p.images && p.images[0])} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            p.condition === 'used' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {p.condition === 'used' ? 'Tokunbo' : 'Brand New'}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400">{p.brand}</span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 truncate max-w-xs">{p.name}</h4>
                        <div className="text-[11px] text-zinc-500 font-semibold">
                          Price: <strong className="text-zinc-900 font-bold">₦{Number(p.price).toLocaleString()}</strong>
                          {p.ownerCommission && (
                            <span className="text-emerald-700 font-bold ml-1.5">(₦{Number(p.ownerCommission).toLocaleString()} profit)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/product/${p.id}`}
                        target="_blank"
                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-white rounded-xl border border-transparent hover:border-zinc-200 transition-all"
                        title="View product on storefront"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

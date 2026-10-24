import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Package, Search, Filter, Eye, Edit2, Trash2, Plus, Download, 
  RefreshCw, MoreVertical, Archive, Box, TrendingUp, AlertTriangle, Image as ImageIcon, FolderGit2,
  Sparkles, CheckCircle2, Loader2, Wand2, X, Zap, Share2, DollarSign, Layers,
  Users, CheckSquare, Square
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../StoreContext';
import { INITIAL_PRODUCTS } from '../../data/initialProducts';

export default function AdminProducts() {
  const { user, formatPrice } = useStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    outOfStock: 0,
    archived: 0
  });

  const [activeTab, setActiveTab] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  // AI Catalog Generator State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiCategory, setAiCategory] = useState<'All' | 'Home Appliances' | 'Latest Gadgets' | 'Electronics'>('All');
  const [aiCondition, setAiCondition] = useState<'both' | 'new' | 'used'>('both');
  const [aiCount, setAiCount] = useState<number>(5);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState('');
  const [aiSuccessResult, setAiSuccessResult] = useState<string | null>(null);
  const [isSeedingDefaults, setIsSeedingDefaults] = useState(false);

  // TikTok, Instagram & Seller Account Viral Scout State
  const [showScoutModal, setShowScoutModal] = useState(false);
  const [scoutMode, setScoutMode] = useState<'single' | 'account'>('single');
  const [scoutInput, setScoutInput] = useState('');
  const [scoutCondition, setScoutCondition] = useState<'new' | 'used'>('new');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutError, setScoutError] = useState<string | null>(null);
  const [scoutedProduct, setScoutedProduct] = useState<any | null>(null);
  const [isPublishingScout, setIsPublishingScout] = useState(false);
  const [scoutPublishSuccess, setScoutPublishSuccess] = useState(false);

  // Vendor Account Harvester State
  const [vendorAccountInput, setVendorAccountInput] = useState('');
  const [vendorCount, setVendorCount] = useState(3);
  const [vendorCondition, setVendorCondition] = useState<'new' | 'used' | 'both'>('both');
  const [scoutedAccountProducts, setScoutedAccountProducts] = useState<any[]>([]);
  const [selectedAccountIndices, setSelectedAccountIndices] = useState<number[]>([]);
  const [isPublishingBatch, setIsPublishingBatch] = useState(false);
  const [batchPublishSuccess, setBatchPublishSuccess] = useState<string | null>(null);

  // Check URL query parameters for ?scout=true or ?scout=account
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scoutParam = params.get('scout');
    if (scoutParam === 'true' || scoutParam === 'account') {
      setShowScoutModal(true);
      if (scoutParam === 'account') {
        setScoutMode('account');
      }
    }
  }, []);

  const handleScoutProduct = async () => {
    if (!scoutInput.trim()) {
      setScoutError('Please enter a TikTok / Instagram link or product keyword');
      return;
    }
    setIsScouting(true);
    setScoutError(null);
    setScoutedProduct(null);
    setScoutPublishSuccess(false);

    try {
      const res = await fetch('/api/ai/scout-social-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urlOrTrend: scoutInput.trim(),
          urlOrTopic: scoutInput.trim(),
          condition: scoutCondition,
          category: 'Latest Gadgets'
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `Server returned HTTP ${res.status}`);
      }

      if (!data.success || !data.product) {
        throw new Error(data?.error || 'Failed to scout viral product');
      }

      setScoutedProduct(data.product);
    } catch (err: any) {
      console.error('Social Scout Error:', err);
      setScoutError(err.message || 'Failed to scout product');
    } finally {
      setIsScouting(false);
    }
  };

  const handlePublishScoutedProduct = async () => {
    if (!scoutedProduct) return;
    setIsPublishingScout(true);
    try {
      const prodId = scoutedProduct.id || `sajoda-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await setDoc(doc(db, 'products', prodId), {
        ...scoutedProduct,
        id: prodId,
        status: 'active',
        inStock: true,
        inventory: scoutedProduct.stockCount || 40,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      setScoutPublishSuccess(true);
      setTimeout(() => {
        setShowScoutModal(false);
        setScoutedProduct(null);
        setScoutInput('');
        setScoutPublishSuccess(false);
      }, 1800);
    } catch (err: any) {
      console.error('Publish scouted product error:', err);
      setScoutError(err.message || 'Failed to publish product to store');
    } finally {
      setIsPublishingScout(false);
    }
  };

  const handleScoutAccount = async () => {
    if (!vendorAccountInput.trim()) {
      setScoutError('Please enter a vendor handle, username, or account link (e.g. @gadgethub_lagos)');
      return;
    }
    setIsScouting(true);
    setScoutError(null);
    setScoutedAccountProducts([]);
    setSelectedAccountIndices([]);
    setBatchPublishSuccess(null);

    try {
      const res = await fetch('/api/ai/scout-seller-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountHandle: vendorAccountInput.trim(),
          count: vendorCount,
          condition: vendorCondition
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Server returned HTTP ${res.status}`);
      }
      if (!data.success || !Array.isArray(data.products) || data.products.length === 0) {
        throw new Error(data?.error || 'Failed to scout products from seller account');
      }

      setScoutedAccountProducts(data.products);
      setSelectedAccountIndices(data.products.map((_: any, idx: number) => idx));
    } catch (err: any) {
      console.error('Vendor Scout Error:', err);
      setScoutError(err.message || 'Failed to scout seller account');
    } finally {
      setIsScouting(false);
    }
  };

  const handlePublishSelectedProducts = async () => {
    if (selectedAccountIndices.length === 0) return;
    setIsPublishingBatch(true);
    setScoutError(null);
    try {
      let publishedCount = 0;
      for (const idx of selectedAccountIndices) {
        const item = scoutedAccountProducts[idx];
        if (!item) continue;
        const prodId = item.id || `sajoda-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        await setDoc(doc(db, 'products', prodId), {
          ...item,
          id: prodId,
          status: 'active',
          inStock: true,
          inventory: item.stockCount || 35,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        publishedCount++;
      }
      setBatchPublishSuccess(`Successfully published ${publishedCount} products to SAJODA store catalog!`);
      setTimeout(() => {
        setBatchPublishSuccess(null);
        setScoutedAccountProducts([]);
        setSelectedAccountIndices([]);
        setShowScoutModal(false);
      }, 2500);
    } catch (err: any) {
      console.error('Batch publish error:', err);
      setScoutError('Failed to publish selected products to database.');
    } finally {
      setIsPublishingBatch(false);
    }
  };

  const handleAiAutoUpload = async (customCat?: string, customCnt?: number, customP?: string, customCond?: 'both' | 'new' | 'used') => {
    setIsAiGenerating(true);
    setAiSuccessResult(null);
    setAiStatusMsg('Gemini AI is analyzing specs, photos and curating products...');

    const categoryToUse = customCat || aiCategory;
    const countToUse = customCnt || aiCount;
    const promptToUse = customP !== undefined ? customP : aiCustomPrompt;
    const conditionToUse = customCond || aiCondition;

    try {
      const res = await fetch('/api/ai/generate-catalog-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryToUse,
          count: countToUse,
          customPrompt: promptToUse,
          condition: conditionToUse
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.success || !Array.isArray(data.products)) {
        throw new Error(data.error || 'Failed to generate products');
      }

      setAiStatusMsg(`Publishing ${data.products.length} products to live Firestore catalog...`);

      let addedCount = 0;
      for (const prod of data.products) {
        const prodId = prod.id || `sajoda-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        await setDoc(doc(db, 'products', prodId), {
          ...prod,
          id: prodId,
          status: 'active',
          inStock: true,
          inventory: prod.stockCount || 40,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        addedCount++;
      }

      setAiSuccessResult(`Successfully generated and uploaded ${addedCount} products to your store!`);
      setIsAiGenerating(false);
      setAiStatusMsg('');
    } catch (err: any) {
      console.error('AI Product Upload Error:', err);
      setAiStatusMsg(`Error: ${err.message || 'Failed to generate products'}`);
      setIsAiGenerating(false);
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeedingDefaults(true);
    try {
      let count = 0;
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          status: 'active',
          inStock: true,
          inventory: prod.stockCount || 30,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        count++;
      }
      alert(`Successfully seeded ${count} premier Home Appliances, Latest Gadgets, and Electronics to Firestore!`);
    } catch (err: any) {
      console.error('Seed error:', err);
      alert('Error seeding products: ' + err.message);
    } finally {
      setIsSeedingDefaults(false);
    }
  };

  const fetchProducts = () => {
    setIsLoading(true);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setProducts(productsData);
      
      const newStats = {
        total: productsData.length,
        active: productsData.filter(p => p.status === 'active').length,
        draft: productsData.filter(p => p.status === 'draft').length,
        outOfStock: productsData.filter(p => p.status === 'out_of_stock' || (p.inventory !== undefined && p.inventory <= 0)).length,
        archived: productsData.filter(p => p.status === 'archived').length
      };
      setStats(newStats);
      setIsLoading(false);
      setIsRefreshing(false);
    }, (err) => {
      console.warn('Admin products listener error:', err.message);
      setIsLoading(false);
      setIsRefreshing(false);
    });
  };

  useEffect(() => {
    const unsub = fetchProducts();
    return () => unsub();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProducts();
  };

  const filteredProducts = products.filter(product => {
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = 
      (product.name && product.name.toLowerCase().includes(q)) ||
      (product.sku && product.sku.toLowerCase().includes(q)) ||
      (product.cjSku && product.cjSku.toLowerCase().includes(q)) ||
      (product.id && product.id.toString().toLowerCase().includes(q));
      
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Brand New') return matchesSearch && (product.condition === 'new' || (!product.condition && !product.id.includes('used')));
    if (activeTab === 'Pre-Owned') return matchesSearch && (product.condition === 'used' || product.id.includes('used'));
    if (activeTab === 'Active') return matchesSearch && product.status === 'active';
    if (activeTab === 'Draft') return matchesSearch && product.status === 'draft';
    if (activeTab === 'Out of Stock') return matchesSearch && (product.status === 'out_of_stock' || (product.inventory !== undefined && product.inventory <= 0));
    if (activeTab === 'Archived') return matchesSearch && product.status === 'archived';
    
    return matchesSearch;
  });

  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const getStatusStyle = (status: string, inventory?: number) => {
    if (inventory !== undefined && inventory <= 0) return 'bg-rose-100 text-rose-800 border-rose-200';
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'draft': return 'bg-zinc-100 text-zinc-800 border-zinc-200';
      case 'out_of_stock': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'archived': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200'; // Legacy active
    }
  };

  const getStatusText = (status: string, inventory?: number) => {
    if (inventory !== undefined && inventory <= 0) return 'OUT OF STOCK';
    if (!status) return 'ACTIVE';
    return status.replace('_', ' ').toUpperCase();
  };

  const getInventoryStatus = (inventory?: number, lowStockThreshold: number = 5) => {
    if (inventory === undefined || inventory === null) return { text: 'Untracked', style: 'text-zinc-500' };
    if (inventory <= 0) return { text: 'Out of stock', style: 'text-rose-600 font-bold' };
    if (inventory <= lowStockThreshold) return { text: `${inventory} in stock (Low)`, style: 'text-amber-600 font-bold' };
    return { text: `${inventory} in stock`, style: 'text-emerald-600 font-medium' };
  };

  return (
    <div className="w-full pb-24 lg:pb-12 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-2">Products</h1>
          <p className="text-lg text-zinc-500 font-medium">Manage your SAJODA Electronics catalog.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => {
              setScoutMode('account');
              setShowScoutModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/20 whitespace-nowrap cursor-pointer"
          >
            <Users className="w-4 h-4 text-white" /> Harvest Seller Accounts
          </button>
          <button 
            onClick={() => {
              setScoutMode('single');
              setShowScoutModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-95 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-500/20 whitespace-nowrap cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-white" /> TikTok & Insta Viral Scout
          </button>
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-purple-500/20 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> AI Auto-Upload Products
          </button>
          <button 
            onClick={handleSeedDefaults}
            disabled={isSeedingDefaults}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer"
            title="Seed 10 Premier Appliances & Gadgets directly to Firestore"
          >
            {isSeedingDefaults ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500" />}
            Seed 10 Defaults
          </button>
          <Link 
            to="/admin/drive-import"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap"
          >
            <FolderGit2 className="w-4 h-4 text-emerald-600" /> Drive AI Import
          </Link>
          <Link 
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'TOTAL PRODUCTS', value: stats.total, icon: <Package className="w-4 h-4" />, color: 'text-zinc-900', bg: 'bg-zinc-100' },
          { label: 'ACTIVE', value: stats.active, icon: <TrendingUp className="w-4 h-4" />, color: 'text-emerald-700', bg: 'bg-emerald-100' },
          { label: 'DRAFT', value: stats.draft, icon: <Edit2 className="w-4 h-4" />, color: 'text-zinc-700', bg: 'bg-zinc-200' },
          { label: 'OUT OF STOCK', value: stats.outOfStock, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-rose-700', bg: 'bg-rose-100' },
          { label: 'ARCHIVED', value: stats.archived, icon: <Archive className="w-4 h-4" />, color: 'text-amber-700', bg: 'bg-amber-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-0.5">{stat.value.toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Private Wholesale & Profit Intelligence Banner for Owner */}
      <div className="mb-6 p-5 rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-300">
                🔒 Private Store Owner Intelligence
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">
                Stealth Sourcing Guarantee (100% Hidden from Customers)
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Where Your AI Sources Goods & Calculates Profit (₦)
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Your AI merchandiser automates sourcing from verified Nigerian distribution channels:
              <strong className="text-zinc-200"> Alaba International Market</strong> (Appliances & Electronics), 
              <strong className="text-zinc-200"> Computer Village Ikeja</strong> (Gadgets & Phones), and 
              <strong className="text-zinc-200"> Certified OEM Refurbishers</strong>. Every product is priced with realistic Nigerian market pricing (₦) and has your guaranteed 
              <strong className="text-white"> ₦10,000+ Owner Profit Commission</strong> added to wholesale cost. Customers only see final prices with SAJODA as the direct owner.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-zinc-800/90 border border-zinc-700 text-left">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Commission Rule</div>
              <div className="text-sm font-black text-white">₦10,000+ Minimum</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-zinc-800/90 border border-zinc-700 text-left">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Market Currency</div>
              <div className="text-sm font-black text-white">Nigerian Naira (₦)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm mb-6 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50/50">
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto snap-x hide-scrollbar">
            {['All', 'Brand New', 'Pre-Owned', 'Active', 'Draft', 'Out of Stock', 'Archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all snap-start ${
                  activeTab === tab 
                    ? 'bg-zinc-900 text-white shadow-sm' 
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:border-zinc-400 outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-16 bg-zinc-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              {/* Desktop Table */}
              <table className="w-full text-left border-collapse whitespace-nowrap hidden md:table">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Retail Price (₦)</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Sourcing & Profit (Private)</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Inventory</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {paginatedProducts.map((product) => {
                    const hubName = product.sourcingHub 
                      ? product.sourcingHub.replace(' (Lagos)', '').replace(' Distribution Hub', '').replace(' Tech Hub', '') 
                      : (product.category === 'Home Appliances' ? 'Alaba Mkt Hub' : 'Computer Village');
                    const baseCostNum = product.baseCost ? Number(product.baseCost) : Math.round((product.price || 0) * 0.82);
                    const commissionNum = product.ownerCommission ? Number(product.ownerCommission) : Math.max(10000, Math.round((product.price || 0) - baseCostNum));

                    return (
                      <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200 flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-zinc-300" />
                              )}
                            </div>
                            <div className="flex flex-col max-w-[220px]">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  product.condition === 'used'
                                    ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                                    : 'bg-zinc-900 text-white'
                                }`}>
                                  {product.condition === 'used' ? 'Pre-Owned' : 'Brand New'}
                                </span>
                                {product.usedPrice && product.newPrice && (
                                  <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">Dual Price</span>
                                )}
                              </div>
                              <Link to={`/admin/products/${product.id}`} className="text-sm font-bold text-zinc-900 hover:text-zinc-600 truncate transition-colors">
                                {product.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-medium text-zinc-600">
                            {product.variants && product.variants.length > 0 ? 'Multiple SKUs' : (product.sku || product.cjSku || 'N/A')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-zinc-600">{product.category || 'Uncategorized'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900">{formatPrice ? formatPrice(product.price || 0) : `₦${Math.round(product.price || 0).toLocaleString('en-NG')}`}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-zinc-400 line-through">{formatPrice ? formatPrice(product.originalPrice) : `₦${Math.round(product.originalPrice).toLocaleString('en-NG')}`}</span>
                            )}
                          </div>
                        </td>
                        {/* Private Wholesale & Markup Details */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 shrink-0"></span>
                              <span className="truncate max-w-[170px]" title={product.sourcingHub || hubName}>
                                {hubName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                              <span>Cost: ₦{baseCostNum.toLocaleString('en-NG')}</span>
                              <span className="font-bold text-zinc-900 bg-zinc-100 px-1 py-0.2 rounded">
                                Profit: +₦{commissionNum.toLocaleString('en-NG')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${getInventoryStatus(product.inventory).style}`}>
                            {getInventoryStatus(product.inventory).text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-lg border ${getStatusStyle(product.status, product.inventory)}`}>
                            {getStatusText(product.status, product.inventory)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/products/${product.id}`} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-zinc-100">
                {paginatedProducts.map((product) => {
                  const hubName = product.sourcingHub 
                    ? product.sourcingHub.replace(' (Lagos)', '').replace(' Distribution Hub', '').replace(' Tech Hub', '') 
                    : (product.category === 'Home Appliances' ? 'Alaba Mkt Hub' : 'Computer Village');
                  const baseCostNum = product.baseCost ? Number(product.baseCost) : Math.round((product.price || 0) * 0.82);
                  const commissionNum = product.ownerCommission ? Number(product.ownerCommission) : Math.max(10000, Math.round((product.price || 0) - baseCostNum));

                  return (
                    <div key={product.id} className="p-4 hover:bg-zinc-50 active:bg-zinc-100 transition-colors flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200 flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-zinc-300" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              product.condition === 'used'
                                ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                                : 'bg-zinc-900 text-white'
                            }`}>
                              {product.condition === 'used' ? 'Pre-Owned' : 'Brand New'}
                            </span>
                            <span className="text-[9px] font-semibold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                              {hubName}
                            </span>
                          </div>
                          <Link to={`/admin/products/${product.id}`} className="text-sm font-bold text-zinc-900 hover:text-zinc-600 line-clamp-1 transition-colors">
                            {product.name}
                          </Link>
                          <span className="text-xs font-mono text-zinc-500 mt-0.5">{product.variants && product.variants.length > 0 ? 'Multiple SKUs' : (product.sku || product.cjSku || 'No SKU')}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-black text-zinc-900">{formatPrice ? formatPrice(product.price || 0) : `₦${Math.round(product.price || 0).toLocaleString('en-NG')}`}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border ${getStatusStyle(product.status, product.inventory)}`}>
                            {getStatusText(product.status, product.inventory)}
                          </span>
                        </div>
                      </div>

                      {/* Private Wholesale & Profit Details (Admin Only) */}
                      <div className="flex items-center justify-between text-xs bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                        <span className="text-[11px] font-medium text-zinc-500">
                          🔒 Hub Cost: ₦{baseCostNum.toLocaleString('en-NG')}
                        </span>
                        <span className="text-[11px] font-bold text-zinc-900 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">
                          Profit: +₦{commissionNum.toLocaleString('en-NG')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-0.5">
                         <span className={`text-xs ${getInventoryStatus(product.inventory).style}`}>
                            {getInventoryStatus(product.inventory).text}
                          </span>
                          <Link to={`/admin/products/${product.id}`} className="text-xs font-bold text-zinc-900 flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors">
                            Edit <Edit2 className="w-3 h-3" />
                          </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-50/50">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-200 flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 mb-2 uppercase tracking-tight">Your Product Catalog is Empty</h3>
              <p className="text-zinc-500 max-w-sm mb-6 text-sm">
                {searchQuery || activeTab !== 'All' 
                  ? "Try adjusting your filters or search query to find what you're looking for."
                  : "Add your first product or scout trending items from TikTok & Instagram."}
              </p>
              {(searchQuery || activeTab !== 'All') ? (
                <button 
                  onClick={() => { setSearchQuery(''); setActiveTab('All'); setPage(1); }}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-sm"
                >
                  Clear Filters
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/admin/products/new" className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors">
                    Add Product
                  </Link>
                  <button 
                    onClick={() => setShowAiModal(true)} 
                    className="px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    AI Auto-Generate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <span className="text-sm font-medium text-zinc-500">
              Showing <span className="font-bold text-zinc-900">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-zinc-900">{Math.min(page * itemsPerPage, filteredProducts.length)}</span> of <span className="font-bold text-zinc-900">{filteredProducts.length}</span> products
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

      {/* AI Product Auto-Upload Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-100 w-full max-w-2xl overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 bg-zinc-900 border-b border-zinc-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-zinc-800 border border-zinc-700">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">AI Product Auto-Generator</h3>
                  <p className="text-xs text-zinc-400">Curates domestic inventory with guaranteed ₦10k+ owner commission</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowAiModal(false); setAiSuccessResult(null); }}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Private Sourcing & Commission Notice */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-start gap-3 text-xs text-zinc-600">
                <span className="text-sm shrink-0">🔒</span>
                <div>
                  <p className="font-bold text-zinc-900 mb-0.5">Automated Wholesale Sourcing & Profit Rules</p>
                  <p className="leading-relaxed">
                    Products will be assigned to <strong>Alaba Market</strong>, <strong>Computer Village</strong>, or <strong>OEM Refurbishers</strong>. Every item calculates realistic Nigerian Naira prices (₦) with your mandatory <strong>₦10,000+ Owner Profit Commission</strong> added to wholesale costs. Customers see SAJODA as the direct owner.
                  </p>
                </div>
              </div>

              {/* Success Banner */}
              {aiSuccessResult && (
                <div className="p-4 bg-zinc-100 border border-zinc-300 rounded-2xl flex items-center gap-3 text-zinc-900 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-zinc-900 shrink-0" />
                  <span>{aiSuccessResult}</span>
                </div>
              )}

              {/* Status or Progress */}
              {isAiGenerating && (
                <div className="p-5 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center gap-4 text-zinc-900">
                  <Loader2 className="w-6 h-6 text-zinc-900 animate-spin shrink-0" />
                  <div>
                    <p className="text-sm font-bold">AI Merchandiser is Working...</p>
                    <p className="text-xs text-zinc-600">{aiStatusMsg || 'Generating listings, pricing, and images...'}</p>
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                  1-Click Quick Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={() => handleAiAutoUpload('Home Appliances', 5, 'Curate trending smart home appliances like robot vacuums, air fryers, purifiers, and espresso machines.')}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-left transition-all group disabled:opacity-50 cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">🏠 <strong>5 Home Appliances</strong></span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-800">Alaba Wholesale Hub • +₦10k-₦35k commission</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={() => handleAiAutoUpload('Latest Gadgets', 5, 'Curate cutting-edge personal gadgets like smartwatches, foldable drones, wireless chargers, and smart lamps.')}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-left transition-all group disabled:opacity-50 cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">⚡ <strong>5 Latest Gadgets</strong></span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-800">Computer Village Hub • +₦12k-₦40k commission</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={() => handleAiAutoUpload('Electronics', 5, 'Curate high-performance electronics like 4K portable projectors, ANC earbuds, soundbars, and displays.')}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-left transition-all group disabled:opacity-50 cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">📺 <strong>5 Electronics</strong></span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-800">OEM / Alaba Hub • +₦15k-₦50k commission</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={() => handleAiAutoUpload('All', 8, 'A mixed catalog of best-selling home appliances, gadgets, and electronics.')}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-left transition-all group disabled:opacity-50 cursor-pointer"
                  >
                    <span className="text-base block mb-0.5">🌟 <strong>8 Mixed Best-Sellers</strong></span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-800">Balanced catalog with dual conditions</span>
                  </button>
                </div>
              </div>

              {/* Custom Generator Form */}
              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Or Custom AI Prompt
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Target Category</label>
                    <select
                      value={aiCategory}
                      onChange={(e: any) => setAiCategory(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-900"
                    >
                      <option value="All">All Categories</option>
                      <option value="Home Appliances">Home Appliances</option>
                      <option value="Latest Gadgets">Latest Gadgets</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Condition Model</label>
                    <select
                      value={aiCondition}
                      onChange={(e: any) => setAiCondition(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-900"
                    >
                      <option value="both">Both New & Pre-Owned</option>
                      <option value="new">Brand New Only</option>
                      <option value="used">Pre-Owned / Refurbished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Number of Products</label>
                    <select
                      value={aiCount}
                      onChange={(e) => setAiCount(Number(e.target.value))}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-900"
                    >
                      <option value={3}>3 Products</option>
                      <option value={5}>5 Products (Recommended)</option>
                      <option value={8}>8 Products</option>
                      <option value={10}>10 Products</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Specific Product Concept (Optional)
                  </label>
                  <input
                    type="text"
                    value={aiCustomPrompt}
                    onChange={(e) => setAiCustomPrompt(e.target.value)}
                    placeholder="e.g. Smart induction cookers, robot window cleaners, MagSafe stands..."
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-900 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="button"
                  disabled={isAiGenerating}
                  onClick={() => handleAiAutoUpload()}
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating & Uploading...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate {aiCount} Products & Upload to Store
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TIKTOK & INSTAGRAM VIRAL SCOUT MODAL FOR DAMIJOSH */}
      {showScoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border border-zinc-100 max-h-[92vh] overflow-y-auto my-auto animate-fade-in-up">
            
            <button 
              onClick={() => {
                setShowScoutModal(false);
                setScoutedProduct(null);
                setScoutError(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI Social & Vendor Catalog Scout
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600">
                DamiJosh Admin AI
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-zinc-100 rounded-2xl mb-6 mt-3">
              <button
                type="button"
                onClick={() => {
                  setScoutMode('single');
                  setScoutError(null);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  scoutMode === 'single'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-pink-600" />
                Single Viral Product / Link
              </button>

              <button
                type="button"
                onClick={() => {
                  setScoutMode('account');
                  setScoutError(null);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  scoutMode === 'account'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-600" />
                Harvest Seller Accounts
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-black">
                  Batch Multi-Item
                </span>
              </button>
            </div>

            {/* ===================== MODE 1: SINGLE PRODUCT / LINK SCOUT ===================== */}
            {scoutMode === 'single' && (
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">
                  Import Viral Products to SAJODA
                </h2>
                <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                  Found a hot gadget on TikTok or Instagram? Paste the link or topic. Your AI will locate domestic supply at Alaba or Computer Village, calculate realistic Naira pricing with your guaranteed <strong>₦10,000+ commission</strong>, generate 4 multi-angle photos (including carton box or tested hardware), and publish in 1 click!
                </p>

                {/* Sourcing Input Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      TikTok / Instagram Link or Trending Product Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={scoutInput}
                        onChange={(e) => setScoutInput(e.target.value)}
                        placeholder="e.g. https://www.tiktok.com/@tech/video/... or 'Wireless 3-in-1 Foldable Charger'"
                        className="w-full p-3.5 pr-10 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-900 focus:bg-white transition-all"
                      />
                      {scoutInput && (
                        <button
                          onClick={() => setScoutInput('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Condition Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Listing Condition Model
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setScoutCondition('new')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          scoutCondition === 'new'
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600 text-emerald-900'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>📦 Brand New</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Sealed retail carton & pack</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setScoutCondition('used')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          scoutCondition === 'used'
                            ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-600 text-amber-900'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>🛡️ Certified Pre-Owned</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">100% tested working fine</p>
                      </button>
                    </div>
                  </div>

                  {/* Quick Inspiration Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-zinc-400">Viral Inspiration:</span>
                    {[
                      'RGB Gaming Soundbar',
                      'Portable Electric Blender',
                      'MagSafe Wireless Power Bank',
                      'Mini Pocket 4K Drone',
                    ].map((idea, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setScoutInput(idea)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                      >
                        + {idea}
                      </button>
                    ))}
                  </div>

                  {scoutError && scoutMode === 'single' && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {scoutError}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isScouting}
                    onClick={handleScoutProduct}
                    className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-95 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isScouting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scouting Viral Source & Multi-Angle Photos...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        Scout & Generate Viral Product
                      </>
                    )}
                  </button>
                </div>

                {/* Scouted Product Preview */}
                {scoutedProduct && (
                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Product Ready for Publish
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                        {scoutedProduct.condition === 'used' ? 'Pre-Owned Card' : 'Brand New Card'}
                      </span>
                    </div>

                    {/* 4 Multi-Angle Side Photos Preview */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        4-Angle Side Photo Gallery ({scoutedProduct.images?.length || 4} Angles Generated)
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(scoutedProduct.images || [scoutedProduct.image]).map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-white border border-zinc-200 shadow-2xs">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-bold text-white text-center py-0.5 truncate px-1">
                              {idx === 0 ? 'Front' : idx === 1 ? 'Side' : idx === 2 ? 'Details' : scoutedProduct.condition === 'used' ? 'Hardware' : 'Carton'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Title & Hook */}
                    <div>
                      <h3 className="font-black text-base text-zinc-900">{scoutedProduct.name}</h3>
                      {scoutedProduct.viralHook && (
                        <p className="text-xs font-bold text-pink-600 mt-0.5">🔥 Viral Hook: "{scoutedProduct.viralHook}"</p>
                      )}
                      <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{scoutedProduct.description}</p>
                    </div>

                    {/* 🔒 DamiJosh Private Owner Profit & Sourcing Breakdown */}
                    <div className="p-4 rounded-xl bg-zinc-900 text-white space-y-2 border border-zinc-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400 font-bold">🔒 Sourcing Hub:</span>
                        <span className="font-semibold text-zinc-200">{scoutedProduct.sourcingSupplier || 'Alaba International Wholesale'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400 font-bold">Base Wholesale Cost:</span>
                        <span className="font-semibold text-zinc-300">₦{Number(scoutedProduct.costPrice || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold">DamiJosh Profit Commission:</span>
                        <span className="font-extrabold text-emerald-400">+₦{Number((scoutedProduct.price || 0) - (scoutedProduct.costPrice || 0)).toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm">
                        <span className="font-bold text-white">Store Retail Price:</span>
                        <span className="font-black text-white text-base">₦{Number(scoutedProduct.price || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 italic">
                        * Wholesale costs and commission are 100% hidden from customers. Customers only see SAJODA.
                      </p>
                    </div>

                    {/* Packaging & Guarantee */}
                    <div className="text-xs text-zinc-600 space-y-1">
                      <div><strong>Packaging:</strong> {scoutedProduct.packaging}</div>
                      <div><strong>Warranty:</strong> {scoutedProduct.warrantyInfo}</div>
                    </div>

                    {/* Publish Action */}
                    {scoutPublishSuccess ? (
                      <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-center font-bold text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Published to SAJODA Store Inventory Successfully!
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isPublishingScout}
                        onClick={handlePublishScoutedProduct}
                        className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isPublishingScout ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Publishing to Store Catalog...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            🚀 1-Click Publish to SAJODA Store
                          </>
                        )}
                      </button>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* ===================== MODE 2: VENDOR & COMPETITOR ACCOUNT HARVESTER ===================== */}
            {scoutMode === 'account' && (
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">
                  Harvest Winning Products from Seller Accounts
                </h2>
                <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                  Input any vendor's Instagram handle, TikTok seller profile, Jumia/Konga merchant, or Computer Village dealer handle. AI scans their public catalog, selects the highest-demand electronics for SAJODA, pairs them with domestic wholesale hubs, adds your <strong>₦10,000+ owner profit commission</strong>, generates 4-angle photo sets, and lets you batch-publish in 1 click!
                </p>

                {/* Account Sourcing Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Vendor Account Handle or Profile Link
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={vendorAccountInput}
                        onChange={(e) => setVendorAccountInput(e.target.value)}
                        placeholder="e.g. @gadgethub_lagos, @alaba_direct_deals, or profile URL"
                        className="w-full p-3.5 pr-10 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-600 focus:bg-white transition-all"
                      />
                      {vendorAccountInput && (
                        <button
                          onClick={() => setVendorAccountInput('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Preset Vendor Accounts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-zinc-400">Popular Sourcing Accounts:</span>
                    {[
                      { handle: '@gadgethub_lagos', label: 'GadgetHub (Audio & Tech)' },
                      { handle: '@alaba_direct_deals', label: 'Alaba Deals (Appliances)' },
                      { handle: '@ikeja_phones_gadgets', label: 'Ikeja Gadgets (Smartphones)' },
                      { handle: '@computer_village_refurb', label: 'CV Refurb (Certified Pre-Owned)' },
                    ].map((acc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setVendorAccountInput(acc.handle)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          vendorAccountInput === acc.handle
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                        }`}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>

                  {/* Configuration Row: Quantity & Condition Filter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Products to Curate
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[3, 5, 8].map((cnt) => (
                          <button
                            key={cnt}
                            type="button"
                            onClick={() => setVendorCount(cnt)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                              vendorCount === cnt
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                          >
                            {cnt} Items
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Inventory Condition Filter
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 'both', label: 'Both' },
                          { val: 'new', label: 'New Only' },
                          { val: 'used', label: 'Pre-Owned' },
                        ].map((c) => (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() => setVendorCondition(c.val as any)}
                            className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all truncate ${
                              vendorCondition === c.val
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {scoutError && scoutMode === 'account' && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {scoutError}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isScouting}
                    onClick={handleScoutAccount}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isScouting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scanning Account & Matching Wholesale Sourcing...
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 text-indigo-200" />
                        Scout Winning Products from {vendorAccountInput ? vendorAccountInput : 'Account'}
                      </>
                    )}
                  </button>
                </div>

                {/* Batch Harvested Results */}
                {scoutedAccountProducts.length > 0 && (
                  <div className="space-y-4 animate-fade-in pt-2 border-t border-zinc-200">
                    {/* Header bar with Select All & Profit calculation */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900 text-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span className="font-black text-sm">
                            {scoutedAccountProducts.length} Curated Products Ready
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {selectedAccountIndices.length} of {scoutedAccountProducts.length} selected for publishing
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedAccountIndices.length === scoutedAccountProducts.length) {
                              setSelectedAccountIndices([]);
                            } else {
                              setSelectedAccountIndices(scoutedAccountProducts.map((_, i) => i));
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {selectedAccountIndices.length === scoutedAccountProducts.length ? 'Deselect All' : 'Select All'}
                        </button>

                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Est. Profit</span>
                          <span className="text-base font-black text-emerald-400">
                            +₦{selectedAccountIndices.reduce((sum, idx) => {
                              const p = scoutedAccountProducts[idx];
                              return sum + Math.max(10000, (p?.price || 0) - (p?.costPrice || 0));
                            }, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product List */}
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                      {scoutedAccountProducts.map((item, idx) => {
                        const isSelected = selectedAccountIndices.includes(idx);
                        const commission = Math.max(10000, (item.price || 0) - (item.costPrice || 0));
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedAccountIndices(selectedAccountIndices.filter(i => i !== idx));
                              } else {
                                setSelectedAccountIndices([...selectedAccountIndices, idx]);
                              }
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4 ${
                              isSelected
                                ? 'bg-indigo-50/40 border-indigo-400 ring-1 ring-indigo-400'
                                : 'bg-white border-zinc-200 opacity-60 hover:opacity-90'
                            }`}
                          >
                            {/* Checkbox */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className="text-indigo-600 focus:outline-none"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-5 h-5" />
                                ) : (
                                  <Square className="w-5 h-5 text-zinc-400" />
                                )}
                              </button>

                              {/* Photo thumbnail */}
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                                <img
                                  src={item.image || (item.images && item.images[0])}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-bold text-white text-center py-0.5">
                                  4 Angles
                                </span>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  item.condition === 'used'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {item.condition === 'used' ? '🛡️ Pre-Owned' : '📦 Brand New'}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                                  {item.category}
                                </span>
                                <span className="text-[10px] font-semibold text-zinc-500">
                                  🔒 {item.sourcingSupplier || 'Alaba International'}
                                </span>
                              </div>

                              <h4 className="font-black text-sm text-zinc-900 truncate">{item.name}</h4>
                              <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                                {item.sellerInsight || item.description}
                              </p>
                            </div>

                            {/* Financial breakdown */}
                            <div className="sm:text-right shrink-0 bg-white p-2.5 rounded-xl border border-zinc-200">
                              <div className="text-[11px] text-zinc-400 font-semibold">
                                Base: ₦{Number(item.costPrice || 0).toLocaleString()}
                              </div>
                              <div className="text-xs font-bold text-emerald-600">
                                +₦{commission.toLocaleString()} profit
                              </div>
                              <div className="text-sm font-black text-zinc-900 mt-0.5">
                                ₦{Number(item.price || 0).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Batch Publish CTA */}
                    <div className="pt-2">
                      {batchPublishSuccess ? (
                        <div className="p-4 rounded-xl bg-emerald-600 text-white text-center font-bold text-sm flex items-center justify-center gap-2 animate-fade-in">
                          <CheckCircle2 className="w-5 h-5" />
                          {batchPublishSuccess}
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isPublishingBatch || selectedAccountIndices.length === 0}
                          onClick={handlePublishSelectedProducts}
                          className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          {isPublishingBatch ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Publishing {selectedAccountIndices.length} Products to Firestore Catalog...
                            </>
                          ) : (
                            <>
                              <Users className="w-5 h-5 text-indigo-300" />
                              🚀 Publish Selected ({selectedAccountIndices.length} Products) to SAJODA Store
                            </>
                          )}
                        </button>
                      )}
                      <p className="text-[10px] text-zinc-400 text-center mt-2 italic">
                        * All wholesale costs & commission markups remain private to DamiJosh. Customers only see SAJODA retail prices.
                      </p>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

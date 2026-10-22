import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Package, Search, Filter, Eye, Edit2, Trash2, Plus, Download, 
  RefreshCw, MoreVertical, Archive, Box, TrendingUp, AlertTriangle, Image as ImageIcon, FolderGit2,
  Sparkles, CheckCircle2, Loader2, Wand2, X, Zap
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
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
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Inventory</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {paginatedProducts.map((product) => (
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
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}>
                                {product.condition === 'used' ? 'Pre-Owned' : 'Brand New'}
                              </span>
                              {product.usedPrice && product.newPrice && (
                                <span className="text-[9px] font-bold text-zinc-400 bg-zinc-100 px-1 rounded">Dual Price</span>
                              )}
                            </div>
                            <Link to={`/admin/products/${product.id}`} className="text-sm font-bold text-zinc-900 hover:text-primary-blue truncate transition-colors">
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
                          <span className="text-sm font-bold text-zinc-900">{formatPrice ? formatPrice(product.price || 0) : `$${(product.price || 0).toFixed(2)}`}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-zinc-400 line-through">{formatPrice ? formatPrice(product.originalPrice) : `$${product.originalPrice.toFixed(2)}`}</span>
                          )}
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
                          <Link to={`/admin/products/${product.id}`} className="p-2 text-zinc-400 hover:text-primary-blue hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-zinc-100">
                {paginatedProducts.map((product) => (
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
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                            product.condition === 'used'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {product.condition === 'used' ? 'Pre-Owned' : 'Brand New'}
                          </span>
                        </div>
                        <Link to={`/admin/products/${product.id}`} className="text-sm font-bold text-zinc-900 hover:text-primary-blue line-clamp-1 transition-colors">
                          {product.name}
                        </Link>
                        <span className="text-xs font-mono text-zinc-500 mt-0.5">{product.variants && product.variants.length > 0 ? 'Multiple SKUs' : (product.sku || product.cjSku || 'No SKU')}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-black text-zinc-900">{formatPrice ? formatPrice(product.price || 0) : `$${(product.price || 0).toFixed(2)}`}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border ${getStatusStyle(product.status, product.inventory)}`}>
                          {getStatusText(product.status, product.inventory)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                       <span className={`text-xs ${getInventoryStatus(product.inventory).style}`}>
                          {getInventoryStatus(product.inventory).text}
                        </span>
                        <Link to={`/admin/products/${product.id}`} className="text-xs font-bold text-primary-blue flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                          Edit <Edit2 className="w-3 h-3" />
                        </Link>
                    </div>
                  </div>
                ))}
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
                  : "Add your first product or import products from CJdropshipping."}
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
                  <Link to="/admin/cjdropshipping" className="px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-50 transition-colors">
                    Import from CJ
                  </Link>
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
            <div className="p-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">AI Product Auto-Generator</h3>
                  <p className="text-xs text-purple-200">Generate & upload trending home appliances and gadgets without stress</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowAiModal(false); setAiSuccessResult(null); }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Success Banner */}
              {aiSuccessResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{aiSuccessResult}</span>
                </div>
              )}

              {/* Status or Progress */}
              {isAiGenerating && (
                <div className="p-5 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-4 text-purple-900">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin shrink-0" />
                  <div>
                    <p className="text-sm font-bold">AI Merchandiser is Working...</p>
                    <p className="text-xs text-purple-700">{aiStatusMsg || 'Generating listings, pricing, and images...'}</p>
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
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition-all group disabled:opacity-50"
                  >
                    <span className="text-base block mb-0.5">🏠 <strong>5 Home Appliances</strong></span>
                    <span className="text-xs text-zinc-500 group-hover:text-purple-700">Air fryers, robot vacuums, purifiers</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={() => handleAiAutoUpload('Latest Gadgets', 5, 'Curate cutting-edge personal gadgets like smartwatches, foldable drones, wireless chargers, and smart lamps.')}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group disabled:opacity-50"
                  >
                    <span className="text-base block mb-0.5">⚡ <strong>5 Latest Gadgets</strong></span>
                    <span className="text-xs text-zinc-500 group-hover:text-indigo-700">AMOLED watches, drones, charging hubs</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={() => handleAiAutoUpload('Electronics', 5, 'Curate high-performance electronics like 4K portable projectors, ANC earbuds, soundbars, and displays.')}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group disabled:opacity-50"
                  >
                    <span className="text-base block mb-0.5">📺 <strong>5 Electronics</strong></span>
                    <span className="text-xs text-zinc-500 group-hover:text-blue-700">Cinema projectors, studio audio, soundbars</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={() => handleAiAutoUpload('All', 8, 'A mixed catalog of best-selling home appliances, gadgets, and electronics.')}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-purple-600 hover:bg-purple-50/50 text-left transition-all group disabled:opacity-50"
                  >
                    <span className="text-base block mb-0.5">🌟 <strong>8 Mixed Best-Sellers</strong></span>
                    <span className="text-xs text-zinc-500 group-hover:text-purple-700">Complete balanced assortment</span>
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
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-purple-500"
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
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-purple-500"
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
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-purple-500"
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
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="button"
                  disabled={isAiGenerating}
                  onClick={() => handleAiAutoUpload()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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

    </div>
  );
}

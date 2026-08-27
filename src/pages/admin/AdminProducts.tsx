import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Package, Search, Filter, Eye, Edit2, Trash2, Plus, Download, 
  RefreshCw, MoreVertical, Archive, Box, TrendingUp, AlertTriangle, Image as ImageIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../StoreContext';

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
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.cjSku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === 'All') return matchesSearch;
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
        
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/cjdropshipping"
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Import from CJ
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
            {['All', 'Active', 'Draft', 'Out of Stock', 'Archived'].map((tab) => (
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
                          <div className="flex flex-col max-w-[200px]">
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
    </div>
  );
}

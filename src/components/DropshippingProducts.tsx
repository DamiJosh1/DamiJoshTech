import React, { useState, useEffect } from 'react';
import { ShoppingBag, Loader2, Search, ExternalLink, Heart } from 'lucide-react';
import { useStore } from '../StoreContext';

interface CJProduct {
  pid: string;
  productName: string;
  productImage: string;
  productPrice: number;
  sellPrice: number;
  categoryId: string;
  categoryName: string;
}

interface CJCategory {
  categoryId: string;
  categoryName: string;
}

export default function DropshippingProducts({ isDarkMode: _ignore }: { isDarkMode?: boolean }) {
  const { isDarkMode, wishlistIds, handleWishlistToggle } = useStore();
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [categories, setCategories] = useState<CJCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/dropshipping/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      if (data.code === 200 && data.data) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching CJ categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async (pageToFetch: number, keyword: string = '', catId: string = '') => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(pageToFetch),
        size: '12'
      });
      if (keyword) {
        params.append('keyWord', keyword);
      }
      if (catId) {
        params.append('categoryId', catId);
      }

      const res = await fetch(`/api/dropshipping/products?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch dropshipping products');
      }
      
      const data = await res.json();
      
      if (data.code === 200 && data.data && data.data.list) {
        setProducts(data.data.list);
      } else {
        if (data.data) {
           setProducts(Array.isArray(data.data) ? data.data : (data.data.list || []));
        } else {
           setError('No products found.');
           setProducts([]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching CJ products:', err);
      setError(err.message || 'An error occurred while fetching products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, search, activeCategoryId);
  }, [page, activeCategoryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search, activeCategoryId);
  };

  const handleWishlistClick = (cjProduct: CJProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const adaptedProduct = {
      id: cjProduct.pid,
      name: cjProduct.productName,
      price: cjProduct.sellPrice || cjProduct.productPrice || 0,
      image: cjProduct.productImage,
      category: cjProduct.categoryName || 'Dropshipping',
      cjSku: cjProduct.pid,
      badge: 'Dropship'
    };
    
    handleWishlistToggle(adaptedProduct, e);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 transition-colors ${isDarkMode ? 'text-zinc-50' : 'text-slate-900'}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-blue-500" />
            Supplier Catalog
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Browse live products directly from our global dropshipping partners.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-auto relative flex items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supplier..."
            className={`w-full md:w-80 pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-colors ${isDarkMode ? 'bg-zinc-800/50 border-zinc-700 focus:border-blue-500 placeholder-zinc-500' : 'bg-white border-zinc-200 focus:border-blue-500 placeholder-slate-400'}`}
          />
          <Search className={`absolute left-3 w-5 h-5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`} />
          <button type="submit" className="hidden" aria-label="Search">Search</button>
        </form>
      </div>

      {/* Categories Filter Tabs */}
      {categories.length > 0 && (
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveCategoryId(''); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategoryId === '' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : isDarkMode 
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                    : 'bg-white border border-zinc-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Categories
            </button>
            {categories.slice(0, 15).map(cat => (
              <button
                key={cat.categoryId}
                onClick={() => { setActiveCategoryId(cat.categoryId); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategoryId === cat.categoryId 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : isDarkMode 
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                      : 'bg-white border border-zinc-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 flex items-center gap-3">
          <span className="font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`group flex flex-col rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className={`aspect-[4/3] w-full animate-pulse ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className={`h-5 w-3/4 rounded animate-pulse ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                <div className={`h-5 w-1/2 rounded animate-pulse ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                <div className="mt-auto flex items-end justify-between pt-4">
                  <div className="w-1/3">
                    <div className={`h-3 w-full rounded mb-2 animate-pulse ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                    <div className={`h-6 w-3/4 rounded animate-pulse ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                  </div>
                  <div className={`h-9 w-9 rounded-full animate-pulse ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <div className={`text-center py-20 min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed ${isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-slate-500'}`}>
           <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
           <p className="text-lg font-medium mb-1">No products found</p>
           <p className="text-sm">Try adjusting your search terms or category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const isWishlisted = wishlistIds.includes(product.pid);
              
              return (
                <div key={product.pid} className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-blue-500/30' : 'bg-white border-zinc-200 hover:border-blue-200 hover:shadow-blue-500/5'}`}>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                    <img
                      src={product.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                    
                    <button
                      onClick={(e) => handleWishlistClick(product, e)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors z-10 shadow-sm"
                      aria-label="Toggle Wishlist"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors ${
                          isWishlisted 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-white'
                        }`} 
                      />
                    </button>

                    {product.categoryName && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-black/60 text-white backdrop-blur-md">
                        {product.categoryName}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className={`font-semibold line-clamp-2 mb-2 min-h-[48px] ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                      {product.productName}
                    </h3>
                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-medium mb-0.5">Wholesale Price</p>
                        <p className="text-xl font-bold text-blue-500">${product.sellPrice || product.productPrice || '0.00'}</p>
                      </div>
                      <button className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${isDarkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-blue-600 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-blue-600 hover:text-white'}`} aria-label="Import Product">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} ${isDarkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-white border border-zinc-200 text-slate-700 hover:bg-slate-50'}`}
            >
              Previous
            </button>
            <span className={`px-4 font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Page {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={products.length < 12}
              className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${products.length < 12 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} ${isDarkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-white border border-zinc-200 text-slate-700 hover:bg-slate-50'}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

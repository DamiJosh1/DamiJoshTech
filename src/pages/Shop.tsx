import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Heart, Eye, Star, Search, Filter } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || "";
  const { 
    products, 
    isDarkMode, 
    wishlistIds, 
    addingToCartId, 
    prefersReducedMotion,
    handleFeaturedAddToCart,
    handleWishlistToggle,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  React.useEffect(() => {
    setSearchQuery(new URLSearchParams(location.search).get('q') || "");
  }, [location.search]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`w-full min-h-screen pt-24 pb-24 transition-colors duration-1000 ${isDarkMode ? 'bg-[#111318]' : 'bg-[#F3F4F6]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-3 block ${isDarkMode ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}`}>
            COMPLETE CATALOG
          </span>
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
            All Products
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-colors ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 text-white focus:border-[#3B82F6]' 
                    : 'bg-white border-zinc-200 text-zinc-900 focus:border-[#3B82F6]'
                }`}
              />
            </div>
            
            {/* Categories */}
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeCategory === cat
                      ? 'bg-[#3B82F6] text-white'
                      : isDarkMode 
                        ? 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200' 
                        : 'bg-black/5 text-[#64748B] hover:bg-black/10 hover:text-[#111827]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className={`text-lg font-medium ${isDarkMode ? 'text-zinc-400' : 'text-[#64748B]'}`}>
              No products found. Try adjusting your search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 gap-y-10 sm:gap-y-12">
            {filteredProducts.map((product, i) => (
              <div 
                key={product.id} 
                className={`group flex flex-col transition-all duration-700 ease-out transform ${prefersReducedMotion ? '' : 'hover:-translate-y-1'}`}
              >
                <div 
                  className="relative aspect-square w-full rounded-2xl overflow-hidden mb-5 bg-white/5 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  <button 
                    onClick={(e) => handleWishlistToggle(product, e)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-zinc-600 dark:text-zinc-300 hover:text-[#7C3AED] dark:hover:text-[#A78BFA] transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${wishlistIds.includes(product.id) ? 'fill-[#7C3AED] text-[#7C3AED] dark:fill-[#A78BFA] dark:text-[#A78BFA]' : ''}`} />
                  </button>
                </div>

                <div className="flex flex-col flex-1 px-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className={`text-sm sm:text-base font-semibold line-clamp-1 flex-1 cursor-pointer hover:text-[#3B82F6] transition-colors ${isDarkMode ? 'text-white' : 'text-[#111827]'}`} onClick={() => navigate(`/product/${product.id}`)}>
                      {product.name}
                    </h3>
                    {(product as any).rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-amber-400 text-amber-400" />
                        <span className={`text-[10px] sm:text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{(product as any).rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-4">
                    <span className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                      ₦{(product.price).toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm line-through text-[#64748B]">
                        ₦{(product.originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleFeaturedAddToCart(product, e)}
                    disabled={addingToCartId === product.id}
                    className={`mt-auto w-full py-2.5 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      addingToCartId === product.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                    }`}
                  >
                    {addingToCartId === product.id ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

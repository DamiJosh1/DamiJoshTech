const fs = require('fs');

const shopCode = `import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Search, Filter, SlidersHorizontal, ChevronDown, X, ShoppingBag } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || "";
  const initialCategory = searchParams.get('category') || "All";

  const { 
    products, 
    wishlistIds, 
    addingToCartId, 
    handleFeaturedAddToCart,
    handleWishlistToggle,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    setSearchQuery(new URLSearchParams(location.search).get('q') || "");
    const cat = new URLSearchParams(location.search).get('category');
    if (cat) setActiveCategory(cat);
  }, [location.search]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]];

  let filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price_low") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_high") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    // mock sort logic for newest
    filteredProducts = filteredProducts.sort((a, b) => (b.originalPrice || 0) - (a.originalPrice || 0));
  }

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group flex flex-col w-full">
      <div 
        className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-3 bg-zinc-100 cursor-pointer"
        onClick={() => navigate(\`/product/\${product.id}\`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-error text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Sale
          </div>
        )}

        <button 
          onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product, e); }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-charcoal hover:text-error transition-colors shadow-sm"
        >
          <Heart className={\`w-4 h-4 \${wishlistIds.includes(product.id) ? 'fill-error text-error' : ''}\`} />
        </button>

        <div className="hidden lg:flex absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); handleFeaturedAddToCart(product, e); }}
            disabled={addingToCartId === product.id}
            className={\`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-lg \${
              addingToCartId === product.id
                ? 'bg-success text-white'
                : 'bg-white hover:bg-zinc-50 text-primary-blue'
            }\`}
          >
            {addingToCartId === product.id ? 'Added' : 'Add to Cart'}
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleFeaturedAddToCart(product, e); }}
          disabled={addingToCartId === product.id}
          className={\`lg:hidden absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2.5 rounded-full shadow-md transition-colors \${
            addingToCartId === product.id ? 'bg-success text-white' : 'bg-white text-primary-blue'
          }\`}
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="flex flex-col flex-1 px-1">
        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">{product.category || 'Tech'}</span>
        <h3 className="text-sm font-semibold text-dark-text mb-2 line-clamp-2 leading-snug cursor-pointer hover:text-primary-blue transition-colors" onClick={() => navigate(\`/product/\${product.id}\`)}>
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-dark-text">
            \${(product.price).toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-zinc-400 line-through">
              \${(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen pt-4 pb-24 bg-white flex flex-col">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 w-full flex-1 flex flex-col">
        
        {/* Mobile Filter & Sort Controls */}
        <div className="lg:hidden flex items-center gap-2 mb-4">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-dark-text"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="flex-1 relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none flex items-center justify-center gap-2 py-3 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-dark-text outline-none focus:border-primary-blue"
            >
              <option value="featured">Featured</option>
              <option value="newest">New Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Mobile Horizontal Subcategory Nav */}
        <div className="lg:hidden flex overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 gap-2 snap-x scrollbar-hide mb-2 border-b border-zinc-100">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 snap-start \${
                activeCategory === cat
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Header for Desktop */}
        <div className="hidden lg:flex items-end justify-between mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-dark-text mb-2">
              {activeCategory === 'All' ? 'Complete Catalog' : activeCategory}
            </h1>
            <p className="text-zinc-500 text-sm">Showing {filteredProducts.length} products</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white border-zinc-200 text-dark-text focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all text-sm shadow-sm"
              />
            </div>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-dark-text outline-none focus:border-primary-blue shadow-sm cursor-pointer"
              >
                <option value="featured">Sort by Featured</option>
                <option value="newest">New Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-6">Categories</h3>
              <ul className="space-y-3">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={\`text-sm font-medium transition-colors hover:text-primary-blue flex items-center justify-between w-full \${activeCategory === cat ? 'text-primary-blue' : 'text-zinc-500'}\`}
                    >
                      {cat}
                      {activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-primary-blue" />}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="h-px bg-zinc-200 my-8" />

              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-6">Price Range</h3>
              {/* Dummy Price Filter Visuals */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                    <input type="number" placeholder="Min" className="w-full pl-7 pr-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-primary-blue" />
                  </div>
                  <span className="text-zinc-400">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                    <input type="number" placeholder="Max" className="w-full pl-7 pr-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-primary-blue" />
                  </div>
                </div>
                <button className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg text-sm font-semibold transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-50 rounded-3xl h-full">
                <Search className="w-12 h-12 text-zinc-300 mb-4" />
                <h2 className="text-xl font-bold text-zinc-900 mb-2">No results found</h2>
                <p className="text-sm text-zinc-500 mb-6 max-w-sm">
                  We couldn't find any products matching your search or filters. Try adjusting them or explore our categories.
                </p>
                <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 gap-y-8 sm:gap-y-10">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {/* Pagination / Infinite Scroll Loading Indicator */}
            {filteredProducts.length > 0 && (
              <div className="mt-16 flex justify-center">
                <button className="px-8 py-3 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-700 hover:border-primary-blue hover:text-primary-blue transition-colors">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full h-[80vh] bg-white rounded-t-3xl shadow-2xl flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-dark-text">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={\`px-4 py-2 rounded-xl text-sm font-medium border transition-colors \${activeCategory === cat ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200'}\`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Price Range</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                  <input type="number" placeholder="Min" className="w-full pl-7 pr-3 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-primary-blue" />
                </div>
                <span className="text-zinc-400">-</span>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                  <input type="number" placeholder="Max" className="w-full pl-7 pr-3 py-3 border border-zinc-200 rounded-xl text-sm outline-none focus:border-primary-blue" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-100 flex gap-4">
              <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-semibold">
                Reset
              </button>
              <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-4 bg-primary-blue text-white rounded-xl text-sm font-semibold">
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`

fs.writeFileSync('src/pages/Shop.tsx', shopCode);

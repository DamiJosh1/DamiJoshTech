import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../StoreContext';
import ProductCard from '../components/ProductCard';
import { Search, ChevronDown, Filter, X, Loader2, Check } from 'lucide-react';
import SearchInput from '../components/SearchInput';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useStore();
  
  const query = searchParams.get('q') || '';
  const { slug } = useParams();
  const categoryParam = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : (searchParams.get('category') || 'All');
  const sortParam = searchParams.get('sort') || 'relevance';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const availabilityParam = searchParams.get('availability') || 'all';

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter state for mobile drawer (unapplied until 'Apply' is clicked)
  const [draftCategory, setDraftCategory] = useState(categoryParam);
  const [draftSort, setDraftSort] = useState(sortParam);
  const [draftMinPrice, setDraftMinPrice] = useState(minPriceParam || '');
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPriceParam || '');
  const [draftAvailability, setDraftAvailability] = useState(availabilityParam);

  // Calculate drafted results count
  const draftFilteredProducts = useMemo(() => {
    let result = products;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (draftCategory && draftCategory !== 'All') {
      result = result.filter(p => p.category === draftCategory);
    }
    if (draftMinPrice) result = result.filter(p => p.price >= Number(draftMinPrice));
    if (draftMaxPrice) result = result.filter(p => p.price <= Number(draftMaxPrice));
    if (draftAvailability === 'in-stock') result = result.filter(p => p.inventory > 0);
    if (draftAvailability === 'out-of-stock') result = result.filter(p => p.inventory === 0);
    return result;
  }, [products, query, draftCategory, draftMinPrice, draftMaxPrice, draftAvailability]);


  useEffect(() => {
    // Simulate loading for better UX
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [query, categoryParam, sortParam, minPriceParam, maxPriceParam, availabilityParam]);

  useEffect(() => {
    setDraftCategory(categoryParam);
    setDraftSort(sortParam);
    setDraftMinPrice(minPriceParam || '');
    setDraftMaxPrice(maxPriceParam || '');
    setDraftAvailability(availabilityParam);
  }, [categoryParam, sortParam, minPriceParam, maxPriceParam, availabilityParam]);

  const allCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
      );
    }

    // Category
    if (categoryParam !== 'All') {
      result = result.filter(p => p.category === categoryParam);
    }

    // Price
    if (minPriceParam && !isNaN(Number(minPriceParam))) {
      result = result.filter(p => p.price >= Number(minPriceParam));
    }
    if (maxPriceParam && !isNaN(Number(maxPriceParam))) {
      result = result.filter(p => p.price <= Number(maxPriceParam));
    }

    // Availability
    if (availabilityParam === 'in-stock') {
      result = result.filter(p => p.inStock !== false);
    } else if (availabilityParam === 'out-of-stock') {
      result = result.filter(p => p.inStock === false);
    }

    // Sort
    switch (sortParam) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming higher ID means newer for mock data if no createdAt exists
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'relevance':
      default:
        // Already sorted by relevance naturally based on array order or could add specific logic
        break;
    }

    return result;
  }, [products, query, categoryParam, sortParam, minPriceParam, maxPriceParam, availabilityParam]);

  const applyFilters = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || (key === 'category' && value === 'All') || (key === 'availability' && value === 'all') || (key === 'sort' && value === 'relevance')) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (query) newParams.set('q', query);
    setSearchParams(newParams);
  };

  const removeFilter = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const activeFilterCount = Array.from(searchParams.keys()).filter(k => k !== 'q' && k !== 'sort').length;

  return (
    <div className="w-full bg-zinc-50 min-h-[calc(100vh-80px)]">
      {/* Mobile Search Header */}
      <div className="lg:hidden bg-white border-b border-zinc-200 px-4 py-3 sticky top-0 z-30 flex gap-2">
        <SearchInput isMobile={true} />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {query ? (
          <div className="mb-8 lg:mb-12">
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2">
              Search results for "{query}"
            </h1>
            <p className="text-zinc-500 font-medium">Showing {filteredProducts.length} products</p>
          </div>
        ) : (
          <div className="mb-8 lg:mb-12">
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2">
              {categoryParam !== 'All' ? categoryParam : 'Discover Products'}
            </h1>
            <p className="text-zinc-500 font-medium">Showing {filteredProducts.length} products</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-32">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-xs font-bold text-primary-blue hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Categories</h3>
                <ul className="space-y-2">
                  {allCategories.map(cat => (
                    <li key={cat}>
                      <button
                        onClick={() => applyFilters({ category: cat === 'All' ? null : cat })}
                        className={`text-sm w-full text-left transition-colors flex items-center justify-between group ${categoryParam === cat ? 'text-primary-blue font-bold' : 'text-zinc-600 hover:text-zinc-900'}`}
                      >
                        {cat}
                        {categoryParam === cat && <Check className="w-4 h-4" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={draftMinPrice}
                    onChange={(e) => setDraftMinPrice(e.target.value)}
                    onBlur={() => applyFilters({ minPrice: draftMinPrice || null })}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters({ minPrice: draftMinPrice || null })}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900"
                  />
                  <span className="text-zinc-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={draftMaxPrice}
                    onChange={(e) => setDraftMaxPrice(e.target.value)}
                    onBlur={() => applyFilters({ maxPrice: draftMaxPrice || null })}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters({ maxPrice: draftMaxPrice || null })}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="availability" 
                      checked={availabilityParam === 'all'}
                      onChange={() => applyFilters({ availability: null })}
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                    />
                    <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">All items</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="availability" 
                      checked={availabilityParam === 'in-stock'}
                      onChange={() => applyFilters({ availability: 'in-stock' })}
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                    />
                    <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">In stock</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="availability" 
                      checked={availabilityParam === 'out-of-stock'}
                      onChange={() => applyFilters({ availability: 'out-of-stock' })}
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                    />
                    <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">Out of stock</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 w-full">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden w-full sm:w-auto px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-900 flex items-center justify-center gap-2 shadow-sm"
              >
                <Filter className="w-4 h-4" /> Filters {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>}
              </button>

              {/* Active Filter Chips (Desktop & Tablet) */}
              <div className="hidden sm:flex flex-wrap items-center gap-2 flex-1">
                {categoryParam !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 shadow-sm">
                    Category: {categoryParam} <button onClick={() => removeFilter('category')} className="hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {minPriceParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 shadow-sm">
                    Min: ${minPriceParam} <button onClick={() => removeFilter('minPrice')} className="hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {maxPriceParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 shadow-sm">
                    Max: ${maxPriceParam} <button onClick={() => removeFilter('maxPrice')} className="hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {availabilityParam !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 shadow-sm">
                    {availabilityParam === 'in-stock' ? 'In Stock' : 'Out of Stock'} <button onClick={() => removeFilter('availability')} className="hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 underline ml-2">Clear All</button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="w-full sm:w-auto relative shrink-0">
                <select
                  value={sortParam}
                  onChange={(e) => applyFilters({ sort: e.target.value })}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-900 outline-none focus:border-zinc-900 shadow-sm cursor-pointer"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Loading / Results */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="w-8 h-8 text-primary-blue animate-spin mb-4" />
                <p className="text-zinc-500 font-medium">Searching...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-zinc-200 rounded-3xl shadow-sm">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-zinc-300" />
                </div>
                <h2 className="text-2xl font-black text-zinc-900 mb-2">NO RESULTS FOUND</h2>
                <p className="text-zinc-500 max-w-md mb-8">
                  We couldn't find anything matching your search for "{query}". Try checking your spelling or using different keywords.
                </p>
                <button 
                  onClick={clearAllFilters} 
                  className="px-8 py-3.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
                >
                  CLEAR SEARCH
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 animate-fade-in">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 shrink-0">
              <h2 className="text-lg font-black text-zinc-900">FILTERS</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-8">
              {/* Mobile Categories */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setDraftCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${draftCategory === cat ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-white text-zinc-700 border-zinc-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Price Range</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">$</span>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={draftMinPrice}
                      onChange={(e) => setDraftMinPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3.5 border border-zinc-200 rounded-xl text-sm outline-none focus:border-zinc-900 font-medium" 
                    />
                  </div>
                  <span className="text-zinc-400">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">$</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={draftMaxPrice}
                      onChange={(e) => setDraftMaxPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3.5 border border-zinc-200 rounded-xl text-sm outline-none focus:border-zinc-900 font-medium" 
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Availability */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Availability</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setDraftAvailability('in-stock')} className={`px-4 py-3 rounded-xl text-sm font-bold border transition-colors ${draftAvailability === 'in-stock' ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-white text-zinc-700 border-zinc-200'}`}>In Stock</button>
                  <button onClick={() => setDraftAvailability('out-of-stock')} className={`px-4 py-3 rounded-xl text-sm font-bold border transition-colors ${draftAvailability === 'out-of-stock' ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-white text-zinc-700 border-zinc-200'}`}>Out of Stock</button>
                </div>
              </div>
            </div>

            {/* Mobile Filter Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-zinc-100 flex gap-3 pb-safe shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => {
                  setDraftCategory('All');
                  setDraftMinPrice('');
                  setDraftMaxPrice('');
                  setDraftAvailability('all');
                }} 
                className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-bold active:bg-zinc-200 transition-colors"
              >
                CLEAR
              </button>
              <button 
                onClick={() => {
                  applyFilters({
                    category: draftCategory === 'All' ? null : draftCategory,
                    minPrice: draftMinPrice || null,
                    maxPrice: draftMaxPrice || null,
                    availability: draftAvailability === 'all' ? null : draftAvailability,
                  });
                  setIsFilterOpen(false);
                }} 
                className="flex-[2] py-4 bg-zinc-900 text-white rounded-xl text-sm font-bold active:scale-[0.98] transition-all shadow-lg shadow-zinc-900/20"
              >
                SHOW {draftFilteredProducts.length} PRODUCTS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

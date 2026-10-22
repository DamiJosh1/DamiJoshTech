import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, TrendingUp, Clock } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function Categories() {
  const navigate = useNavigate();
  const { products, productsLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];
  const recentSearches = ['Robot Vacuum', 'Smart Air Fryer', 'AMOLED Smartwatch', 'HEPA Purifier'];
  const trendingSearches = ['Robot Vacuum Mop', '4K Smart Projector', '3-in-1 Wireless Hub', 'Espresso Machine'];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const executeSearch = (term: string) => {
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="w-full min-h-screen pt-6 pb-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        
        {/* App-like Search Header */}
        <div className="mb-10">
          <div className="flex items-center rounded-2xl px-4 py-3 bg-zinc-100 border border-transparent transition-colors focus-within:bg-white focus-within:border-primary-blue focus-within:shadow-md mb-6">
            <Search className="w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={handleSearch} 
              className="bg-transparent border-none outline-none w-full ml-3 text-base text-dark-text placeholder:text-zinc-500" 
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Searches */}
            <div>
              <h3 className="text-xs font-bold tracking-wider uppercase mb-4 text-zinc-400">Recent</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <button 
                    key={term}
                    onClick={() => executeSearch(term)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-medium text-zinc-700 hover:border-primary-blue transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-xs font-bold tracking-wider uppercase mb-4 text-zinc-400">Trending</h3>
              <div className="flex flex-col gap-3">
                {trendingSearches.map(term => (
                  <button 
                    key={term}
                    onClick={() => executeSearch(term)}
                    className="flex items-center gap-3 text-left group"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <TrendingUp className="w-4 h-4 text-zinc-400 group-hover:text-primary-blue transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-zinc-700 group-hover:text-primary-blue transition-colors">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-zinc-100 mb-10" />

        <div className="mb-8">
          <span className="text-xs font-bold tracking-wider uppercase mb-3 block text-primary-blue">
            DISCOVER
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mb-6 text-dark-text">
            Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-zinc-200 animate-pulse">
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="h-6 w-32 bg-zinc-300 rounded-full mb-2" />
                  <div className="h-4 w-24 bg-zinc-300 rounded-full" />
                </div>
              </div>
            ))
          ) : (
            categories.map((cat, i) => {
            const catProducts = products.filter(p => p.category === cat);
            const coverImage = catProducts[0]?.image || 'https://images.unsplash.com/photo-1550009158-9efff6c97364?auto=format&fit=crop&q=80&w=1000';
            
            return (
              <div 
                key={cat}
                className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm border border-zinc-200/50 flex flex-col justify-end p-6"
              >
                <img 
                  src={coverImage} 
                  alt={cat} 
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:opacity-95 transition-opacity" />
                
                <div className="relative z-10">
                  <div 
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl md:text-2xl font-black text-white mb-1 group-hover:text-blue-300 transition-colors">{cat}</h3>
                    <p className="text-xs text-zinc-300 mb-4">{catProducts.length} Products Available</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shop?category=${encodeURIComponent(cat)}&condition=new`);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-emerald-600 backdrop-blur-md text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Brand New
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shop?category=${encodeURIComponent(cat)}&condition=used`);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-amber-600 backdrop-blur-md text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Pre-Owned
                    </button>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
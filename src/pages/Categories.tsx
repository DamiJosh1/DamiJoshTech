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
            />
          </div>

          {/* Quick Popular & Trending Searches - Short and compact so products stay visible */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary-blue" /> Popular:
            </span>
            {trendingSearches.map(term => (
              <button 
                key={term}
                onClick={() => executeSearch(term)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-50 hover:bg-zinc-900 hover:text-white border border-zinc-200 text-xs font-semibold text-zinc-700 transition-all cursor-pointer shadow-2xs"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-zinc-100 mb-8" />

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
                      className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/20"
                    >
                      Brand New
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shop?category=${encodeURIComponent(cat)}&condition=used`);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/20"
                    >
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
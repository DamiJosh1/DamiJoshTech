const fs = require('fs');
let code = fs.readFileSync('src/pages/Categories.tsx', 'utf8');

const replacement = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, TrendingUp, Clock } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function Categories() {
  const navigate = useNavigate();
  const { products } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const recentSearches = ['Headphones', 'Smart Watch', 'Speaker'];
  const trendingSearches = ['Sony WH-1000XM5', 'Dyson Airwrap', 'Samsung S24 Ultra'];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(\`/shop?q=\${encodeURIComponent(searchQuery.trim())}\`);
    }
  };

  const executeSearch = (term) => {
    navigate(\`/shop?q=\${encodeURIComponent(term)}\`);
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
          {categories.map((cat, i) => {
            const catProducts = products.filter(p => p.category === cat);
            const coverImage = catProducts[0]?.image || 'https://images.unsplash.com/photo-1550009158-9efff6c97364?auto=format&fit=crop&q=80&w=1000';
            
            return (
              <div 
                key={cat}
                onClick={() => navigate(\`/shop?category=\${encodeURIComponent(cat)}\`)} 
                className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={coverImage} 
                  alt={cat} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{cat}</h3>
                  <div className="flex items-center gap-2 text-zinc-300 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">{catProducts.length} Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}`;

fs.writeFileSync('src/pages/Categories.tsx', replacement);
console.log('Categories.tsx updated for Search view.');

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function Categories() {
  const navigate = useNavigate();
  const { products, isDarkMode } = useStore();

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <div className={`w-full min-h-screen pt-24 pb-24 transition-colors duration-1000 ${isDarkMode ? 'bg-[#111318]' : 'bg-[#F3F4F6]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-3 block ${isDarkMode ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}`}>
            BROWSE BY
          </span>
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
            Categories
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const catProducts = products.filter(p => p.category === cat);
            const coverImage = catProducts[0]?.image || 'https://images.unsplash.com/photo-1550009158-9efff6c97364?auto=format&fit=crop&q=80&w=1000';
            
            return (
              <div 
                key={cat}
                onClick={() => navigate('/shop')} // Could pass state to filter, but routing to shop is enough
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={coverImage} 
                  alt={cat} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">{cat}</h3>
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
}

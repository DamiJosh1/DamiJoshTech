import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../StoreContext';

interface SearchInputProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export default function SearchInput({ onClose, isMobile }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { products , formatPrice} = useStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onClose) onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsSearching(true);
  };

  const getSuggestions = () => {
    if (!debouncedQuery) return [];
    
    const searchLower = debouncedQuery.toLowerCase();
    
    // Exact product matches or relevant product names
    const exactMatches = products.filter(p => 
      (p.name && p.name.toLowerCase().includes(searchLower)) || 
      (p.brand && p.brand.toLowerCase().includes(searchLower)) ||
      (p.category && p.category.toLowerCase().includes(searchLower))
    ).slice(0, 5);

    return exactMatches;
  };

  const suggestions = getSuggestions();
  const popularSearches = ["Wireless Earbuds", "Smart Watches", "Portable Fans", "Air Fryers"];

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    if (onClose) onClose();
  };

  const handleProductClick = (productId: string) => {
    setIsFocused(false);
    navigate(`/product/${productId}`);
    if (onClose) onClose();
  };

  return (
    <div ref={wrapperRef} className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md'}`}>
      <form onSubmit={handleSearch} className={`flex items-center rounded-full px-4 py-2 transition-colors ${isMobile ? 'bg-zinc-100 border border-transparent' : 'bg-light-bg border border-zinc-200 focus-within:bg-white focus-within:border-primary-blue focus-within:shadow-sm'}`}>
        <Search className="w-4 h-4 text-zinc-500 shrink-0" />
        <input
          ref={inputRef}
          type="text" 
          placeholder="Search gadgets, appliances and more..." 
          value={query} 
          onChange={handleChange} 
          onFocus={() => setIsFocused(true)}
          className="bg-transparent border-none outline-none w-full ml-3 text-sm text-dark-text placeholder:text-zinc-500" 
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Autocomplete Panel - Compact, short dropdown so users can see products */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden z-50 animate-fade-in-up max-h-72 overflow-y-auto">
          <div className="p-3 sm:p-4">
            {!query.trim() ? (
               <div>
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular Searches
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setIsFocused(false)} 
                      className="text-[11px] font-bold text-zinc-400 hover:text-zinc-800 px-2 py-0.5 rounded hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>
                  {/* Short, compact chip pills so products stay completely visible */}
                  <div className="flex flex-wrap gap-1.5">
                    {popularSearches.map(term => (
                      <button 
                        key={term} 
                        type="button" 
                        onClick={() => handleSuggestionClick(term)} 
                        className="px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
                      >
                        <Search className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
               </div>
            ) : isSearching ? (
               <div className="flex items-center justify-center py-6 text-zinc-400 gap-2">
                 <Loader2 className="w-4 h-4 animate-spin" /> <span className="text-xs font-medium">Searching...</span>
               </div>
            ) : suggestions.length > 0 ? (
               <div>
                 <div className="flex items-center justify-between mb-2.5 px-1">
                   <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Matching Products</span>
                   <button 
                     type="button" 
                     onClick={() => setIsFocused(false)} 
                     className="text-[11px] font-bold text-zinc-400 hover:text-zinc-800 px-2 py-0.5 rounded hover:bg-zinc-100 transition-colors cursor-pointer"
                   >
                     Close ✕
                   </button>
                 </div>
                 <ul className="space-y-1.5">
                   {suggestions.slice(0, 4).map(p => (
                     <li key={p.id}>
                       <button type="button" onClick={() => handleProductClick(p.id)} className="w-full text-left p-2 rounded-xl hover:bg-zinc-50 flex items-center gap-3 group transition-colors cursor-pointer">
                         <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                           <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 overflow-hidden">
                           <p className="text-xs font-bold text-zinc-900 truncate group-hover:text-primary-blue transition-colors">{p.name}</p>
                           <p className="text-[11px] text-zinc-500 font-medium">{formatPrice(p.price)}</p>
                         </div>
                         <ArrowRight className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                       </button>
                     </li>
                   ))}
                 </ul>
                 
                 <div className="mt-3 pt-2.5 border-t border-zinc-100">
                   <button type="button" onClick={() => handleSuggestionClick(debouncedQuery)} className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                     View all results for "{debouncedQuery}" <ArrowRight className="w-3.5 h-3.5" />
                   </button>
                 </div>
               </div>
            ) : (
               <div className="py-6 text-center">
                  <p className="text-xs text-zinc-500 font-medium mb-1">No results found for "{debouncedQuery}"</p>
                  <p className="text-[11px] text-zinc-400">Try a different keyword or browse categories below.</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

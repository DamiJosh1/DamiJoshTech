import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
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
  const { products } = useStore();
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
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

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
      p.name.toLowerCase().includes(searchLower) || 
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

      {/* Autocomplete Panel */}
      {isFocused && (query.trim() || isMobile) && (
        <div className={`absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-50 animate-fade-in-up ${isMobile ? 'fixed top-[70px] bottom-0 rounded-none border-none mt-0 shadow-none' : 'max-h-[80vh] overflow-y-auto'}`}>
          <div className="p-4">
            {!query.trim() && isMobile ? (
               <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 px-2">Popular Searches</h3>
                  <ul className="space-y-1">
                    {popularSearches.map(term => (
                      <li key={term}>
                        <button type="button" onClick={() => handleSuggestionClick(term)} className="w-full text-left px-2 py-2 text-sm text-zinc-700 hover:text-primary-blue hover:bg-zinc-50 rounded-lg flex items-center gap-3">
                           <Search className="w-3.5 h-3.5 text-zinc-400" /> {term}
                        </button>
                      </li>
                    ))}
                  </ul>
               </div>
            ) : isSearching ? (
               <div className="flex items-center justify-center py-8 text-zinc-400 gap-2">
                 <Loader2 className="w-4 h-4 animate-spin" /> <span className="text-sm font-medium">Searching...</span>
               </div>
            ) : suggestions.length > 0 ? (
               <div>
                 <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 px-2">Products</h3>
                 <ul className="space-y-2">
                   {suggestions.map(p => (
                     <li key={p.id}>
                       <button type="button" onClick={() => handleProductClick(p.id)} className="w-full text-left p-2 rounded-xl hover:bg-zinc-50 flex items-center gap-4 group transition-colors">
                         <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                           <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                         </div>
                         <div className="flex-1 overflow-hidden">
                           <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-primary-blue transition-colors">{p.name}</p>
                           <p className="text-xs text-zinc-500 font-medium">${p.price.toFixed(2)}</p>
                         </div>
                         <ArrowRight className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                       </button>
                     </li>
                   ))}
                 </ul>
                 
                 <div className="mt-4 pt-4 border-t border-zinc-100">
                   <button type="button" onClick={() => handleSuggestionClick(debouncedQuery)} className="w-full py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                     View all results for "{debouncedQuery}" <ArrowRight className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            ) : (
               <div className="py-8 text-center">
                  <p className="text-sm text-zinc-500 font-medium mb-2">No results found for "{debouncedQuery}"</p>
                  <p className="text-xs text-zinc-400">Try checking your spelling or use more general terms.</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

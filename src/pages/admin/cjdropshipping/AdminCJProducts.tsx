import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Package, ExternalLink, ChevronRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function AdminCJProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [sajodaMapping, setSajodaMapping] = useState<Record<string, string>>({});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      // Use existing endpoint
      const res = await fetch(`/api/dropshipping/products?keyword=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        // Check API structure
        const items = data.data?.list || [];
        setProducts(items);
        
        // Check mappings
        checkExistingMappings(items);
      } else {
        setError('Unable to retrieve CJ products.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while searching.');
    } finally {
      setIsSearching(false);
    }
  };

  const checkExistingMappings = async (items: any[]) => {
    try {
      const pids = items.map(p => p.pid).filter(Boolean);
      if (pids.length === 0) return;
      
      const productsRef = collection(db, 'products');
      // Firebase limits 'in' queries to 10
      const chunks = [];
      for (let i = 0; i < pids.length; i += 10) {
        chunks.push(pids.slice(i, i + 10));
      }
      
      const newMapping: Record<string, string> = {};
      
      for (const chunk of chunks) {
        const q = query(productsRef, where('cjProductId', 'in', chunk));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.cjProductId) {
            newMapping[data.cjProductId] = doc.id;
          }
        });
      }
      
      setSajodaMapping(prev => ({ ...prev, ...newMapping }));
    } catch (err) {
      console.error("Mapping check failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Product Discovery</h2>
          <p className="text-sm text-zinc-500">Search the CJ Dropshipping catalog and import products.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by keyword, product name, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center gap-2"
          >
            {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!isSearching && products.length === 0 && !error && (
        <div className="py-12 text-center text-zinc-500">
          <Package className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
          <p>No products found. Enter a keyword to start searching.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.pid} className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-indigo-300 transition-colors flex flex-col group">
              <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                <img 
                  src={product.productImage} 
                  alt={product.productNameEn} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image' }}
                />
                {sajodaMapping[product.pid] && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Imported
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-zinc-500 mb-1 line-clamp-1">ID: {product.pid}</p>
                <h3 className="font-medium text-zinc-900 mb-2 line-clamp-2" title={product.productNameEn}>
                  {product.productNameEn}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100">
                  <div className="font-bold text-lg text-zinc-900">
                    ${product.sellPrice || '0.00'}
                  </div>
                  
                  {sajodaMapping[product.pid] ? (
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      View
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Import
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

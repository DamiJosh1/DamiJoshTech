import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Package, ChevronRight, CheckCircle2, 
  AlertCircle, RefreshCw, Key, HelpCircle, ExternalLink, 
  Sparkles, Check, ArrowRight
} from 'lucide-react';
import { collection, query, getDocs, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminCJProducts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [sajodaMapping, setSajodaMapping] = useState<Record<string, string>>({});
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  // Check connection status on load
  useEffect(() => {
    fetch('/api/dropshipping/status')
      .then(res => res.json())
      .then(data => {
        setApiStatus(data.status);
        if (data.status !== 'CONNECTED' && data.message) {
          setError(data.message);
        }
      })
      .catch(() => setApiStatus('CONNECTION ERROR'));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError('');
    setImportSuccess(null);
    
    try {
      const res = await fetch(`/api/dropshipping/products?keyWord=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to search CJ Dropshipping catalog');
      }

      // Check API structure from CJ Developers (data.list or data.data.list)
      const items = data.data?.list || data.list || [];
      if (items.length === 0) {
        if (data.message && data.code !== 200) {
          setError(data.message);
        }
      }
      setProducts(items);
      
      // Check existing mappings
      if (items.length > 0) {
        checkExistingMappings(items);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while searching CJ Dropshipping.');
    } finally {
      setIsSearching(false);
    }
  };

  const checkExistingMappings = async (items: any[]) => {
    try {
      const pids = items.map(p => p.pid).filter(Boolean);
      if (pids.length === 0) return;
      
      const productsRef = collection(db, 'products');
      const chunks = [];
      for (let i = 0; i < pids.length; i += 10) {
        chunks.push(pids.slice(i, i + 10));
      }
      
      const newMapping: Record<string, string> = {};
      
      for (const chunk of chunks) {
        const q = query(productsRef, where('cjProductId', 'in', chunk));
        const snapshot = await getDocs(q);
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (data.cjProductId) {
            newMapping[data.cjProductId] = docSnap.id;
          }
        });
      }
      
      setSajodaMapping(prev => ({ ...prev, ...newMapping }));
    } catch (err) {
      console.error("Mapping check failed:", err);
    }
  };

  const handleImportProduct = async (product: any) => {
    setImportingId(product.pid);
    setError('');
    setImportSuccess(null);

    try {
      // Calculate suggested selling price in NGN or USD
      const rawCost = parseFloat(product.sellPrice || '0');
      // Standard dropshipping markup: 40-50%
      const markupPrice = rawCost > 0 ? Math.round(rawCost * 1.5 * 100) / 100 : 25;
      const originalPrice = rawCost > 0 ? Math.round(rawCost * 1.9 * 100) / 100 : 35;

      const slug = (product.productNameEn || 'cj-product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const newProduct = {
        name: product.productNameEn || 'CJ Dropshipping Product',
        slug: `${slug}-${Date.now()}`,
        price: markupPrice,
        originalPrice: originalPrice,
        costPrice: rawCost,
        image: product.productImage || '',
        images: product.productImage ? [product.productImage] : [],
        category: product.categoryName || 'Electronics',
        brand: 'CJ Dropshipping',
        shortDescription: `Imported directly from CJ supplier. Quality verified item with fast global tracking.`,
        description: `Imported directly from CJ supplier. Standard CJ SKU: ${product.productSku || product.pid}. High quality manufacturing and factory tested.`,
        inStock: true,
        stockCount: 100,
        status: 'active',
        source: 'CJDROPSHIPPING',
        cjProductId: product.pid,
        cjSku: product.productSku || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'products'), newProduct);

      setSajodaMapping(prev => ({ ...prev, [product.pid]: docRef.id }));
      setImportSuccess(`Successfully imported "${product.productNameEn?.slice(0, 35)}..." to your store catalog!`);
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Failed to import product into store catalog.');
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Product Discovery & Import</h2>
          <p className="text-sm text-zinc-500">
            Search CJ Dropshipping's worldwide catalog and import items with one click directly into your store.
          </p>
        </div>
      </div>

      {/* API Key Guide Banner if disconnected or error */}
      {apiStatus !== 'CONNECTED' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
              <Key className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-sm flex-1">
              <h3 className="font-bold text-amber-900">
                CJ Dropshipping Access Token Setup Required
              </h3>
              <p className="text-amber-800 leading-relaxed">
                To connect your CJ Dropshipping account and search millions of wholesale products, you need a valid <strong className="font-semibold">Access Token</strong> from CJ.
              </p>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200 font-mono text-xs text-amber-900 space-y-1">
                <div>1. Log in to <a href="https://developers.cjdropshipping.com" target="_blank" rel="noreferrer" className="underline font-bold text-amber-950 inline-flex items-center gap-1">CJ Developers Center <ExternalLink className="w-3 h-3" /></a></div>
                <div>2. Generate an <strong>API Key</strong> or request an <strong>Access Token</strong> under Authorization</div>
                <div>3. Add it to this app in AI Studio: <strong>Settings &gt; Secrets &gt; CJ_ACCESS_TOKEN</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by keywords, gadgets, earbuds, watch, drone, or CJ Product ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-sm whitespace-nowrap"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search CJ Catalog</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {importSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-medium">{importSuccess}</p>
          </div>
          <Link 
            to="/admin/products"
            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
          >
            View in Catalog
          </Link>
        </div>
      )}

      {!isSearching && products.length === 0 && !error && (
        <div className="py-16 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200 p-8">
          <Package className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
          <h3 className="font-bold text-zinc-800 mb-1">Find Wholesale Products</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Type an item name like "smart watch", "wireless charger", or "bluetooth speaker" to fetch live pricing and stock from CJ Dropshipping.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isImported = Boolean(sajodaMapping[product.pid]);
            const isCurrentlyImporting = importingId === product.pid;

            return (
              <div 
                key={product.pid} 
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all flex flex-col group"
              >
                <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                  <img 
                    src={product.productImage} 
                    alt={product.productNameEn} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image' }}
                  />
                  {isImported && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Store
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      PID: {product.pid}
                    </span>
                    <h3 
                      className="font-bold text-xs text-zinc-900 mt-1 line-clamp-2 leading-relaxed" 
                      title={product.productNameEn}
                    >
                      {product.productNameEn}
                    </h3>
                  </div>
                  
                  <div className="mt-4 pt-3 flex items-center justify-between border-t border-zinc-100">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">Wholesale Price</span>
                      <div className="font-black text-base text-zinc-900">
                        ${product.sellPrice || '0.00'}
                      </div>
                    </div>
                    
                    {isImported ? (
                      <button 
                        onClick={() => navigate(`/admin/products/${sajodaMapping[product.pid]}`)}
                        className="text-xs font-bold text-zinc-900 hover:text-emerald-600 flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit in Store
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleImportProduct(product)}
                        disabled={isCurrentlyImporting}
                        className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                      >
                        {isCurrentlyImporting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            Import to Store
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useStore } from '../StoreContext';
import React, { useContext } from 'react';
import { StoreContext } from '../StoreContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Tag, Zap } from 'lucide-react';
import Countdown from '../components/Countdown';

export default function Deals() {
  const { formatPrice } = useStore();
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  if (!context) return null;
  const { products, promotions, handleFeaturedAddToCart, wishlistIds, handleWishlistToggle } = context;

  const activeFlashSales = promotions.filter(p => p.type === 'flash_sale' && p.status === 'active' && p.endDate && new Date(p.endDate.toDate()) > new Date());
  const mainFlashSale = activeFlashSales[0];

  // Let's pretend products have an originalPrice field if they are on sale natively, or apply flash sale logic.
  // For now, we will pick some products to simulate native deals if flash sale isn't applied.
  const deals = products.filter(p => p.originalPrice && p.price < p.originalPrice);

  return (
    <div className="animate-fade-in-up w-full min-h-screen bg-zinc-50 pb-20">
      {/* Hero Section */}
      <section className="bg-zinc-950 text-white relative overflow-hidden py-24 md:py-32 px-4">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-6">
            Sajoda Promotions
          </span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">SMART TECHNOLOGY.<br/><span className="text-zinc-500">BETTER VALUE.</span></h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-medium">Explore active deals, flash sales, and exclusive discounts on premium electronics and smart home devices.</p>
          <button onClick={() => {
            document.getElementById('deals-grid')?.scrollIntoView({ behavior: 'smooth' });
          }} className="bg-white text-zinc-950 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
            SHOP TODAY'S DEALS <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Flash Sale Banner */}
      {mainFlashSale && mainFlashSale.endDate && (
        <div className="bg-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Zap className="w-64 h-64" />
          </div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-300" fill="currentColor" />
                <span className="font-bold tracking-widest text-sm uppercase text-indigo-100">Flash Sale</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black">{mainFlashSale.name}</h2>
              <p className="text-indigo-200 mt-1 font-medium">{mainFlashSale.description || "Incredible savings, limited time."}</p>
            </div>
            
            <div className="flex flex-col items-center bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Ends In</span>
              <Countdown endDate={mainFlashSale.endDate.toDate()} />
            </div>
          </div>
        </div>
      )}

      {/* Deals Grid */}
      <div id="deals-grid" className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900">Current Deals</h2>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            <Tag className="w-4 h-4" /> {deals.length} active deals
          </div>
        </div>

        {deals.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-zinc-100 text-center">
            <Tag className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No active deals right now</h3>
            <p className="text-zinc-500">Check back later for more promotions and flash sales.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {deals.map(product => {
              const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
              return (
                <div key={product.id} className="bg-white group rounded-3xl p-4 border border-zinc-100 relative overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="bg-error text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {discountPercent}% OFF
                    </span>
                    {product.badge && (
                      <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-full aspect-square mb-4 bg-zinc-50 rounded-2xl overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-zinc-900 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-black text-error">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm font-medium text-zinc-400 line-through">$\{(product.originalPrice).toFixed(2)}</span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleFeaturedAddToCart(product); }}
                        className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-900 text-zinc-900 hover:text-white rounded-xl font-bold text-sm transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Eye, Star, X } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function Home() {
  const navigate = useNavigate();
  const { 
    products, 
    isDarkMode, 
    user, 
    wishlistIds, 
    addingToCartId, 
    prefersReducedMotion,
    handleFeaturedAddToCart,
    handleWishlistToggle,
    setQuickViewProduct: setGlobalQuickViewProduct
  } = useStore();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [activeFeaturedCategory, setActiveFeaturedCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  useEffect(() => {
    setIsHeroLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <section className={`relative w-full min-h-[100dvh] flex items-center overflow-hidden transition-colors bg-transparent`}>
        
        {/* Background Video Layer */}
        <div 
          className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
          style={{
            transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.25}px)`,
            opacity: prefersReducedMotion ? 1 : Math.max(0, 1 - scrollY / 800),
          }}
        >
           <video
             autoPlay
             loop
             muted
             playsInline
             
             className="w-full h-full object-center object-cover"
           >
             <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-smartwatch-with-a-blue-interface-4082-large.mp4" type="video/mp4" />
           </video>
           <div className={`absolute inset-0 ${isDarkMode ? 'bg-zinc-950/60' : 'bg-slate-900/40'}`} />
        </div>

        {/* Content Layer */}
        <div 
           className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center min-h-[100dvh] pt-32 pb-24"
           style={{
              transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * -0.15}px)`,
              opacity: prefersReducedMotion ? 1 : Math.max(0, 1 - scrollY / 400),
           }}
        >
           <div className="max-w-2xl w-full flex flex-col items-start text-left mt-auto lg:mt-0 mb-auto lg:mb-0">
              {/* 1. Eyebrow */}
              <div 
                className={`transition-all duration-1000 ease-out transform mb-4 lg:mb-6 text-xs lg:text-sm font-bold tracking-[0.2em] uppercase drop-shadow-md ${isDarkMode ? 'text-zinc-300' : 'text-[#A78BFA]'} ${isHeroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: '100ms' }}
              >
                <span className={isDarkMode ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}>SMART</span> TECH. BETTER LIVING.
              </div>
              
              {/* 2. Headline */}
              <h1 
                className={`transition-all duration-1000 ease-out transform text-[2.5rem] leading-[1.1] sm:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-md ${isDarkMode ? 'text-white' : 'text-white'} ${isHeroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: '300ms' }}
              >
                Technology Made for the Way You Live.
              </h1>
              
              {/* 3. Description */}
              <p 
                className={`transition-all duration-1000 ease-out transform mt-6 lg:mt-8 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl drop-shadow-md font-medium ${isDarkMode ? 'text-zinc-300' : 'text-slate-600'} ${isHeroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: '500ms' }}
              >
                Discover thoughtfully selected gadgets and smart technology designed to make everyday life simpler, smarter and better.
              </p>
              
              {/* 4 & 5. Buttons */}
              <div 
                className={`transition-all duration-1000 ease-out transform mt-8 lg:mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto ${isHeroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: '700ms' }}
              >
                <button onClick={() => navigate('/shop')} className="w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-4.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 rounded-full font-medium transition-all duration-300 active:scale-95 flex items-center justify-center">
                  Explore Products
                </button>
                <button onClick={() => navigate('/categories')} className={`w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-4.5 rounded-full font-medium transition-all duration-300 active:scale-95 flex items-center justify-center border-2 shadow-xl ${isDarkMode ? 'border-white/20 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md' : 'border-slate-800/10 bg-white/80 hover:bg-white text-white backdrop-blur-md'}`}>
                  View Categories
                </button>
              </div>
           </div>
        </div>

        {/* Scroll Cue */}
        <div 
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center transition-opacity duration-1000 delay-1000 ${isHeroLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ opacity: prefersReducedMotion ? 1 : Math.max(0, 1 - scrollY / 200) }}
        >
          <span className={`text-[10px] tracking-[0.3em] font-medium uppercase mb-3 ${isDarkMode ? 'text-zinc-500' : 'text-[#64748B]'}`}>
            Scroll to Explore
          </span>
          <div className={`w-px h-8 animate-pulse ${isDarkMode ? 'bg-zinc-400' : 'bg-[#64748B]'}`}></div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`relative w-full transition-colors duration-1000 ${isDarkMode ? 'bg-[#111318]' : 'bg-[#f4f6fc]'} pt-16 lg:pt-24 pb-20 lg:pb-32`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="flex flex-col items-start text-left max-w-2xl">
              <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-3 ${isDarkMode ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}`}>
                FEATURED TECHNOLOGY
              </span>
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                Explore What's New
              </h2>
              <p className={`text-base md:text-lg ${isDarkMode ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                Discover standout gadgets and everyday technology selected for you.
              </p>
            </div>
            <button onClick={() => navigate('/shop')} className="hidden md:flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#3B82F6] text-[#64748B]">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {['All', 'Audio', 'Smart Devices', 'Mobile', 'Gaming', 'Power', 'Accessories'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFeaturedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeFeaturedCategory === cat
                    ? 'bg-[#3B82F6] text-white'
                    : isDarkMode 
                      ? 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200' 
                      : 'bg-black/5 text-[#64748B] hover:bg-black/10 hover:text-[#111827]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className={`text-lg font-medium mb-6 ${isDarkMode ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                Featured products are coming soon.
              </p>
              <button onClick={() => navigate('/shop')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 rounded-full font-medium transition-colors">
                Explore All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 gap-y-10 sm:gap-y-12">
              {(activeFeaturedCategory === 'All' ? products : products.filter(p => p.category?.toLowerCase().includes(activeFeaturedCategory.toLowerCase()))).slice(0, 8).map((product, i) => (
                <div 
                  key={product.id} 
                  className={`group flex flex-col transition-all duration-700 ease-out transform ${prefersReducedMotion ? '' : 'hover:-translate-y-1'}`}
                  style={{ transitionDelay: prefersReducedMotion ? '0ms' : `${i * 100}ms` }}
                >
                  <div 
                    className="relative aspect-square w-full rounded-2xl overflow-hidden mb-5 bg-white/5 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => handleWishlistToggle(product, e)}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-zinc-600 dark:text-zinc-300 hover:text-[#7C3AED] dark:hover:text-[#A78BFA] transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${wishlistIds.includes(product.id) ? 'fill-[#7C3AED] text-[#7C3AED] dark:fill-[#A78BFA] dark:text-[#A78BFA]' : ''}`} />
                    </button>

                    {/* Quick View Button (Desktop only) */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-4 px-4 py-2 bg-white/90 dark:bg-black/80 backdrop-blur-md text-sm font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex items-center gap-2 ${isDarkMode ? 'text-white hover:bg-black' : 'text-zinc-900 hover:bg-white'}`}
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </button>
                  </div>

                  <div className="flex flex-col flex-1 px-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className={`text-sm sm:text-base font-semibold line-clamp-1 flex-1 cursor-pointer hover:text-[#3B82F6] transition-colors ${isDarkMode ? 'text-white' : 'text-[#111827]'}`} onClick={() => navigate(`/product/${product.id}`)}>
                        {product.name}
                      </h3>
                      {(product as any).rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-amber-400 text-amber-400" />
                          <span className={`text-[10px] sm:text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{(product as any).rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-4">
                      <span className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                        ₦{(product.price).toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm line-through text-[#64748B]">
                          ₦{(product.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleFeaturedAddToCart(product, e)}
                      disabled={addingToCartId === product.id}
                      className={`mt-auto w-full py-2.5 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        addingToCartId === product.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20'
                      }`}
                    >
                      {addingToCartId === product.id ? 'Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile View All */}
          <button onClick={() => navigate('/shop')} className="mt-10 md:hidden w-full flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border rounded-xl border-[#3B82F6] text-[#3B82F6]">
            Explore All Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}>
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl flex flex-col md:flex-row ${isDarkMode ? 'bg-[#111318]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors">
              <X className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`} />
            </button>
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-zinc-100 dark:bg-zinc-900">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-center" />
            </div>
            <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <span className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}`}>
                {quickViewProduct.category}
              </span>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                {quickViewProduct.name}
              </h2>
              <div className="flex items-baseline gap-3 mb-6">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                  ₦{(quickViewProduct.price).toLocaleString()}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-lg line-through text-[#64748B]">
                    ₦{(quickViewProduct.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>
              <p className={`text-base mb-8 line-clamp-4 ${isDarkMode ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                Premium technology designed to upgrade your daily routine. Experience unparalleled performance and sleek aesthetics with the {quickViewProduct.name}.
              </p>
              <div className="flex flex-col gap-4 mt-auto">
                <button
                  onClick={() => { handleFeaturedAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                  className="w-full py-4 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => { setQuickViewProduct(null); navigate(`/product/${quickViewProduct.id}`); }}
                  className={`w-full py-4 rounded-xl font-semibold transition-colors border ${isDarkMode ? 'border-zinc-800 text-white hover:bg-white/5' : 'border-zinc-200 text-[#111827] hover:bg-black/5'}`}
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

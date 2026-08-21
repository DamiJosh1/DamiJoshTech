import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { ArrowRight, ChevronRight, ShieldCheck, Truck, CreditCard, HeadphonesIcon, RefreshCw, Mail, Heart, ShoppingBag, Star } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { products, handleFeaturedAddToCart, addingToCartId, wishlistIds, handleWishlistToggle } = useStore();

  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Categories for quick nav
  const featuredCategories = [
    { name: 'Gadgets', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Home Appliances', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800' },
    { name: 'Smart Living', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800' },
    { name: 'Audio', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group flex flex-col min-w-[200px] md:min-w-[240px] max-w-[280px] flex-shrink-0 snap-start">
      <div 
        className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-4 bg-zinc-100 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Deal Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 bg-error text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Sale
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product, e); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-charcoal hover:text-error transition-colors shadow-sm"
        >
          <Heart className={`w-4 h-4 ${wishlistIds.includes(product.id) ? 'fill-error text-error' : ''}`} />
        </button>

        {/* Add to Cart - Desktop Hover */}
        <div className="hidden lg:flex absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); handleFeaturedAddToCart(product, e); }}
            disabled={addingToCartId === product.id}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${
              addingToCartId === product.id
                ? 'bg-success text-white'
                : 'bg-white hover:bg-zinc-50 text-primary-blue'
            }`}
          >
            {addingToCartId === product.id ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
        
        {/* Add to Cart - Mobile Visible */}
        <button
          onClick={(e) => { e.stopPropagation(); handleFeaturedAddToCart(product, e); }}
          disabled={addingToCartId === product.id}
          className={`lg:hidden absolute bottom-3 right-3 p-3 rounded-full shadow-md transition-colors ${
            addingToCartId === product.id ? 'bg-success text-white' : 'bg-white text-primary-blue'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col flex-1 px-1">
        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1.5">{product.category || 'Tech'}</span>
        <h3 className="text-sm font-semibold text-dark-text mb-2 line-clamp-2 leading-snug cursor-pointer hover:text-primary-blue transition-colors" onClick={() => navigate(`/product/${product.id}`)}>
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-base font-bold text-dark-text">
            ${(product.price).toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-zinc-400 line-through">
              ${(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] min-h-[600px] bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80&w=2000" 
            alt="Modern Smart Home" 
            className="w-full h-full object-cover object-center opacity-60 animate-hero-image"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>
        
        <div className="relative max-w-[1440px] mx-auto h-full px-6 md:px-12 lg:px-20 flex flex-col justify-center animate-hero-text">
          <div className="max-w-2xl">
            <span className="text-primary-blue font-bold tracking-[0.2em] text-xs md:text-sm mb-4 block">
              SAJODA ELECTRONICS
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              SMART TECHNOLOGY.<br />
              <span className="text-zinc-300">BETTER LIVING.</span>
            </h1>
            <p className="text-base md:text-lg text-zinc-400 mb-10 max-w-lg leading-relaxed">
              Discover premium gadgets, smart devices and modern home appliances designed to make everyday life simpler.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/shop')} className="px-8 py-4 bg-primary-blue hover:bg-blue-800 text-white rounded-full font-semibold transition-colors flex items-center justify-center gap-2 group">
                SHOP NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/categories')} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-full font-semibold transition-colors flex items-center justify-center">
                EXPLORE SMART LIVING
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK CATEGORY NAVIGATION */}
      <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-dark-text tracking-tight">Shop by Category</h2>
          </div>
          <button onClick={() => navigate('/categories')} className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-blue hover:text-blue-800 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-hide">
          {featuredCategories.map((cat) => (
            <div 
              key={cat.name}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group min-w-[240px] sm:min-w-0 snap-start shrink-0"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                <span className="text-sm text-zinc-300 flex items-center gap-1 group-hover:text-white transition-colors">
                  Explore <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Carousel) */}
      <section className="py-12 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-dark-text tracking-tight">Featured Products</h2>
            <button onClick={() => navigate('/shop')} className="text-sm font-semibold text-primary-blue hover:text-blue-800 transition-colors flex items-center gap-1">
              Shop All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {products.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">Loading products...</div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
              {products.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. SMART LIVING EDITORIAL */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="rounded-[2rem] overflow-hidden bg-zinc-950 relative flex flex-col lg:flex-row min-h-[500px]">
          <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center z-10">
            <span className="text-primary-blue font-bold tracking-[0.2em] text-xs mb-4 block uppercase">
              Smart Living
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Technology for the way you live.
            </h2>
            <p className="text-zinc-400 text-base md:text-lg mb-8 max-w-md leading-relaxed">
              Discover connected devices and modern appliances designed to make everyday routines easier and more efficient.
            </p>
            <button onClick={() => navigate('/shop?category=Smart%20Living')} className="self-start px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 rounded-full font-semibold transition-colors">
              EXPLORE SMART LIVING
            </button>
          </div>
          <div className="absolute lg:relative inset-0 lg:inset-auto w-full lg:w-1/2 h-full min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1200" 
              alt="Smart Living" 
              className="w-full h-full object-cover opacity-40 lg:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent lg:bg-gradient-to-r lg:from-zinc-950 lg:via-zinc-950/20 lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* 5. NEXT-GEN GADGETS */}
      <section className="py-12 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-dark-text tracking-tight mb-4">Next-Gen Gadgets</h2>
          <p className="text-zinc-500 text-lg">Everyday technology made smarter.</p>
        </div>
        
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.filter(p => !p.category || p.category.includes('Gadget') || p.category.includes('Audio')).slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <button onClick={() => navigate('/shop')} className="px-8 py-3 rounded-full border border-zinc-300 text-dark-text font-semibold hover:border-primary-blue hover:text-primary-blue transition-colors">
            SHOP GADGETS
          </button>
        </div>
      </section>

      {/* 6. TODAY'S DEALS */}
      <section className="py-16 bg-blue-50/50 mt-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-dark-text tracking-tight">Today's Deals</h2>
            <span className="bg-error text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sale</span>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
             {products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
             ))}
             {products.filter(p => p.originalPrice && p.originalPrice > p.price).length === 0 && (
               <p className="text-zinc-500">No active deals right now. Check back later!</p>
             )}
          </div>
        </div>
      </section>

      {/* 7. WHY SAJODA / TRUST SECTION */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-dark-text tracking-tight mb-4">Why SAJODA?</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">We focus on useful technology and modern products worth bringing into everyday life.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-zinc-50 rounded-2xl p-8 text-center flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-dark-text mb-3">Secure Shopping</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Your checkout and payment experience is protected and straightforward.</p>
          </div>
          
          <div className="bg-zinc-50 rounded-2xl p-8 text-center flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-dark-text mb-3">Reliable Delivery</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Clear shipping information and order tracking from purchase to delivery.</p>
          </div>
          
          <div className="bg-zinc-50 rounded-2xl p-8 text-center flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-dark-text mb-3">Easy Returns</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Not completely satisfied? Return it within 30 days for a hassle-free refund.</p>
          </div>
          
          <div className="bg-zinc-50 rounded-2xl p-8 text-center flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HeadphonesIcon className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-dark-text mb-3">Customer Support</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Help when you need it. Our dedicated team is here to assist you.</p>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-20 bg-primary-blue text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Mail className="w-10 h-10 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Stay in the loop</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto text-lg">
            Get new product drops, smart-living ideas and exclusive offers delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="flex-1 px-5 py-3 rounded-xl text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-zinc-950 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
          {subscribeStatus === 'success' && (
            <p className="text-green-300 mt-4 font-medium animate-fade-in-up">Thanks for subscribing!</p>
          )}
        </div>
      </section>

    </div>
  );
}

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ArrowLeft, ShieldCheck, Truck, PlayCircle, Clock, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    isDarkMode, 
    wishlistIds, 
    addingToCartId,
    handleFeaturedAddToCart,
    handleWishlistToggle,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className={`w-full min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#111318] text-white' : 'bg-[#F3F4F6] text-[#111827]'}`}>
        <p>Product not found.</p>
        <button onClick={() => navigate('/shop')} className="mt-4 text-[#3B82F6] hover:underline">Return to Shop</button>
      </div>
    );
  }

  // Mock gallery images by re-using the main image with different treatments for demonstration
  const galleryImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  return (
    <div className={`w-full min-h-screen pt-24 pb-24 transition-colors duration-1000 ${isDarkMode ? 'bg-[#111318]' : 'bg-[#F3F4F6]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className={`flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-[#3B82F6] ${isDarkMode ? 'text-zinc-400' : 'text-[#64748B]'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24">
          {/* Left Column: Images */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
              <img 
                src={galleryImages[activeImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              />
              <button 
                onClick={(e) => handleWishlistToggle(product, e)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-zinc-600 dark:text-zinc-300 hover:text-[#7C3AED] dark:hover:text-[#A78BFA] transition-colors"
              >
                <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? 'fill-[#7C3AED] text-[#7C3AED] dark:fill-[#A78BFA] dark:text-[#A78BFA]' : ''}`} />
              </button>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-white/5 border-2 transition-all ${activeImageIndex === idx ? 'border-[#3B82F6]' : 'border-transparent hover:border-white/20'}`}
                >
                  <img src={img} alt={`Gallery view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'bg-[#3B82F6]/10 text-[#2563EB]'}`}>
                {product.category}
              </span>
              {product.badge && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 text-amber-600'}`}>
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor((product as any).rating || 5) ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <span className={`text-sm font-medium ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                  {(product as any).rating || '5.0'} (128 Reviews)
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-500" />
              <span className="text-sm font-medium text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> In Stock
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
              <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                ₦{(product.price).toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl line-through text-[#64748B]">
                  ₦{(product.originalPrice).toLocaleString()}
                </span>
              )}
            </div>

            <p className={`text-base sm:text-lg mb-8 leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-[#475569]'}`}>
              {product.description || `Engineered for premium performance and uncompromised quality. The ${product.name} seamlessly combines modern design with advanced functionality.`}
            </p>

            {/* Trust Bullet Points */}
            <ul className={`space-y-3 mb-10 text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {product.features ? product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> {feature}</li>
              )) : (
                <>

              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 100% Authentic Product Guarantee</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Secure SSL Encrypted Checkout</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 24/7 Priority Customer Support</li>
                </>
              )}
            </ul>

            <button
              onClick={(e) => handleFeaturedAddToCart(product, e)}
              disabled={addingToCartId === product.id}
              className={`w-full py-5 rounded-2xl text-lg font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-3 mb-8 ${
                addingToCartId === product.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-xl shadow-[#3B82F6]/20'
              }`}
            >
              {addingToCartId === product.id ? 'Successfully Added' : 'Add to Cart — Secure Checkout'}
            </button>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 ${isDarkMode ? 'bg-white/5' : 'bg-indigo-50'}`}>
                <Truck className="w-6 h-6 text-[#3B82F6]" />
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-[#111827]'}`}>Free Worldwide<br/>Delivery</span>
              </div>
              <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 ${isDarkMode ? 'bg-white/5' : 'bg-indigo-50'}`}>
                <ShieldCheck className="w-6 h-6 text-[#3B82F6]" />
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-[#111827]'}`}>2-Year Extended<br/>Warranty</span>
              </div>
              <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 ${isDarkMode ? 'bg-white/5' : 'bg-indigo-50'}`}>
                <RotateCcw className="w-6 h-6 text-[#3B82F6]" />
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-[#111827]'}`}>30-Day Easy<br/>Returns</span>
              </div>
            </div>
          </div>
        </div>
        
        {product.video && (
          <div className="mt-24 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>See It In Action</h2>
              <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Watch our full product overview to discover all the hidden features and premium quality materials.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 group border border-white/10 shadow-2xl">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 transition-opacity duration-700">
                <source src={product.video} type="video/mp4" />
              </video>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

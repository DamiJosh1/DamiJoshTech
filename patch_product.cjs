const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf-8');

const newProductDetail = `import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ArrowLeft, ShieldCheck, Truck, RotateCcw, CheckCircle2, Sparkles, Bot } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    wishlistIds, 
    addingToCartId,
    handleFeaturedAddToCart,
    handleWishlistToggle,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-light-bg text-dark-text">
        <p>Product not found.</p>
        <button onClick={() => navigate('/shop')} className="mt-4 text-primary-blue hover:underline">Return to Shop</button>
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
    <div className="w-full min-h-screen pt-12 pb-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-8 text-sm font-bold transition-colors hover:text-primary-blue text-charcoal"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24">
          {/* Left Column: Images */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-light-bg border border-border group">
              <img 
                src={galleryImages[activeImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              />
              <button 
                onClick={(e) => handleWishlistToggle(product, e)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/80 backdrop-blur-md text-charcoal hover:text-error transition-colors shadow-sm"
              >
                <Heart className={\`w-5 h-5 \${wishlistIds.includes(product.id) ? 'fill-error text-error' : ''}\`} />
              </button>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={\`relative aspect-square rounded-xl overflow-hidden bg-light-bg border-2 transition-all \${activeImageIndex === idx ? 'border-primary-blue' : 'border-transparent hover:border-border'}\`}
                >
                  <img src={img} alt={\`Gallery view \${idx + 1}\`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded text-xs font-bold tracking-wider uppercase bg-light-bg text-primary-blue">
                {product.category}
              </span>
              {product.badge && (
                <span className="px-3 py-1 rounded text-xs font-bold tracking-wider uppercase bg-amber-50 text-amber-600">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-dark-text">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={\`w-4 h-4 \${i < Math.floor((product as any).rating || 5) ? 'fill-current' : 'opacity-30'}\`} />
                  ))}
                </div>
                <span className="text-sm font-medium ml-1 text-charcoal">
                  {(product as any).rating || '5.0'} (128 Reviews)
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> In Stock
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border">
              <span className="text-4xl font-extrabold text-dark-text">
                ₦{(product.price).toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl line-through text-charcoal">
                  ₦{(product.originalPrice).toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-base lg:text-lg mb-10 text-body-text leading-relaxed">
              Premium technology designed to upgrade your daily routine. Experience unparalleled performance and sleek aesthetics with the {product.name}.
            </p>

            <button
              onClick={(e) => handleFeaturedAddToCart(product, e)}
              disabled={addingToCartId === product.id}
              className={\`w-full py-4 rounded-lg font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 mb-8 shadow-md \${
                addingToCartId === product.id
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-primary-blue hover:bg-secondary-blue text-white shadow-primary-blue/20'
              }\`}
            >
              {addingToCartId === product.id ? 'Added to Cart' : 'Add to Cart'}
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto p-6 bg-light-bg rounded-xl border border-border">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-text">Free Delivery</h4>
                  <p className="text-xs text-charcoal">On orders over ₦100k</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-text">1-Year Warranty</h4>
                  <p className="text-xs text-charcoal">Official manufacturer guarantee</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-text">30-Day Returns</h4>
                  <p className="text-xs text-charcoal">No questions asked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/ProductDetail.tsx', newProductDetail);

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, Star, ArrowLeft, ShieldCheck, Truck, RotateCcw, 
  CheckCircle2, Minus, Plus, ShoppingBag, X, ChevronRight, Share2,
  TrendingDown, Bell, Sparkles 
} from 'lucide-react';
import { useStore } from '../StoreContext';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    productsLoading, 
    wishlistIds, 
    addingToCartId,
    handleAddToCart,
    handleWishlistToggle,
    formatPrice, 
    activeCurrency,
    setPriceAlertModalProduct,
    getActiveAlertForProduct
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const product = products.find(p => p.id === id);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, product]);

  if (!product) {
    if (productsLoading) {
      return (
        <LoadingSpinner size="fullscreen" label="Loading product..." />
      );
    }
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-white text-zinc-900 px-6">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-zinc-500 mb-6 text-center max-w-sm">This product may have been removed or is no longer available.</p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium">Back to Shop</button>
          <button onClick={() => navigate('/categories')} className="px-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-medium hover:bg-zinc-200">Explore Categories</button>
        </div>
      </div>
    );
  }

  // Dedicated single-condition pricing and authentication
  const isUsed = product.condition === 'used';
  const currentPrice = selectedVariant && selectedVariant.price ? selectedVariant.price : product.price;
  const originalPrice = product.originalPrice;
  const activeAlert = product ? getActiveAlertForProduct(product.id) : undefined;

  const currentConditionGrade = product.conditionGrade || (isUsed ? 'Certified Pre-Owned - 100% Tested Working Fine' : 'Brand New - Factory Sealed Box');
  const currentWarranty = product.warrantyInfo || (isUsed ? '90-Day Sajoda Certified Replacement Guarantee' : '1-Year Official Manufacturer Warranty');
  const packagingDesc = product.packaging || (isUsed ? 'Certified Tested Unit with Padded Protective Packaging & Accessories' : 'Factory Sealed Retail Pack & Carton with Serial Seal');

  // Find counterpart product in alternate condition if available in store
  const alternateConditionProduct = products.find(p => 
    (product.relatedConditionId && p.id === product.relatedConditionId) ||
    (p.id !== product.id && p.category === product.category && p.condition !== product.condition && p.name.toLowerCase().includes(product.name.toLowerCase().split(' ')[0]))
  );

  // Generate some dummy variants and specs if they don't exist
  const variants = product.variants || [
    { id: 'v1', name: 'Standard Edition', type: 'Model', price: product.price, inStock: true },
    { id: 'v2', name: 'Pro Edition', type: 'Model', price: product.price * 1.3, inStock: true },
    { id: 'v3', name: 'Ultra Edition', type: 'Model', price: product.price * 1.8, inStock: false },
  ];

  const specs = product.specifications || [
    { name: 'Brand', value: product.brand || 'SAJODA' },
    { name: 'Category', value: product.category },
    { name: 'Weight', value: '0.45 kg' },
    { name: 'Dimensions', value: '15 x 8 x 3 cm' },
  ];

  const galleryImages = product.images?.length ? product.images : [
    product.image,
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800'
  ];

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const getAngleLabel = (idx: number, usedProduct: boolean) => {
    if (idx === 0) return 'Front View';
    if (idx === 1) return 'Side Profile';
    if (idx === 2) return 'Side / Ports Detail';
    if (idx === 3) return usedProduct ? 'Tested Hardware' : 'Factory Sealed Carton Box';
    return `Angle ${idx + 1}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const Lightbox = () => {
    if (!isLightboxOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="absolute top-0 inset-x-0 p-4 flex justify-end z-10">
          <button onClick={() => setIsLightboxOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center relative p-4">
          <img src={galleryImages[activeImageIndex]} alt="" className="max-w-full max-h-[85vh] object-contain select-none" />
          
          {activeImageIndex > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i => i - 1); }} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          {activeImageIndex < galleryImages.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i => i + 1); }} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md">
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
        <div className="p-4 flex gap-2 justify-center overflow-x-auto">
          {galleryImages.map((img, idx) => (
            <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${activeImageIndex === idx ? 'border-white' : 'border-transparent opacity-50'}`}>
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white pb-24 lg:pb-12">
      <Lightbox />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: galleryImages[0],
            description: product.description,
            sku: product.cjSku || product.id,
            offers: {
              "@type": "Offer",
              url: `https://sajodaelectronics.com/product/${product.id}`,
              priceCurrency: activeCurrency?.code || "USD",
              price: product.price,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock"
            }
          })
        }}
      />

      
      {/* Breadcrumb - Desktop & Tablet */}
      <div className="hidden md:block max-w-[1440px] mx-auto px-6 md:px-8 py-6 border-b border-zinc-100">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <button onClick={() => navigate('/')} className="hover:text-zinc-900 transition-colors">Home</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/shop')} className="hover:text-zinc-900 transition-colors">Shop</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate(`/shop?category=${encodeURIComponent(product.category)}`)} className="hover:text-zinc-900 transition-colors">{product.category}</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-900 truncate max-w-[200px] lg:max-w-md">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-0 md:px-8 pt-0 md:pt-8 flex flex-col lg:flex-row gap-0 md:gap-12 lg:gap-16 xl:gap-24">
        
        {/* Mobile Header / Back Button */}
        <div className="md:hidden absolute top-4 left-4 z-10 flex gap-2">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-zinc-100 text-zinc-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="md:hidden absolute top-4 right-4 z-10 flex gap-2">
          <button onClick={handleShare} className="p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-zinc-100 text-zinc-900">
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={(e) => handleWishlistToggle(product, e)} className="p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-zinc-100 text-zinc-900">
            <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? 'fill-error text-error' : ''}`} />
          </button>
        </div>

        {/* LEFT COLUMN: IMAGES (MULTI-ANGLE & PACKAGING VIEWS) */}
        <div className="w-full lg:w-[55%] flex flex-col gap-4">
          {/* Mobile Swipe Gallery */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 gap-4" style={{ overscrollBehaviorX: 'contain' }}>
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className="relative w-full aspect-square shrink-0 snap-center bg-zinc-100 cursor-zoom-in"
                onClick={() => {
                  setActiveImageIndex(idx);
                  setIsLightboxOpen(true);
                }}
              >
                <img 
                  src={img} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{getAngleLabel(idx, isUsed)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Single Image View with Multi-Angle Indicator */}
          <div 
            className="hidden md:block relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 cursor-zoom-in group border border-zinc-200"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img 
              src={galleryImages[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Multi-angle active perspective badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-sm pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{getAngleLabel(activeImageIndex, isUsed)}</span>
              <span className="text-zinc-400 text-[11px] font-normal border-l border-zinc-600 pl-2">
                Angle {activeImageIndex + 1} of {galleryImages.length}
              </span>
            </div>

            {/* Desktop Quick Actions overlay */}
            <div className="hidden md:flex absolute top-4 right-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="p-3 rounded-full bg-white/90 backdrop-blur-md text-zinc-900 hover:text-primary-blue shadow-sm">
                <Share2 className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product, e); }} className="p-3 rounded-full bg-white/90 backdrop-blur-md text-zinc-900 hover:text-error shadow-sm">
                <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? 'fill-error text-error' : ''}`} />
              </button>
            </div>
            {/* Image Indicator Mobile */}
            <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium tracking-widest">
              {activeImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
          
          {/* Thumbnails - Labeled with exact angle/side/packaging view */}
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-4 gap-3">
            {galleryImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-100 border-2 transition-all flex flex-col group ${
                  activeImageIndex === idx 
                    ? 'border-primary-blue ring-2 ring-primary-blue/30 shadow-sm' 
                    : 'border-zinc-200 hover:border-zinc-400 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white text-center py-1 truncate px-1">
                  {getAngleLabel(idx, isUsed)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="w-full lg:w-[45%] flex flex-col px-6 md:px-0 py-6 md:py-0">
          <div className="flex flex-col mb-6 border-b border-zinc-100 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-primary-blue">
                {product.brand || 'SAJODA'} • {product.category}
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                isUsed
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {isUsed ? '🛡️ Pre-Owned • 100% Tested Working' : '📦 Brand New • Sealed Carton'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-4">
              <span>Condition:</span>
              <span className="font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">{currentConditionGrade}</span>
            </div>
            
            <div className="flex items-center flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 4.8) ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4">
                  {product.rating || '4.8'} ({product.reviewCount || '128'} Reviews)
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:block" />
              <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> In Stock & Ready to Ship
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-extrabold text-zinc-900">
                {formatPrice(currentPrice)}
              </span>
              {originalPrice && originalPrice > currentPrice && (
                <>
                  <span className="text-xl line-through text-zinc-400 font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black tracking-wider uppercase">
                    Save {Math.round((1 - currentPrice/originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* DEDICATED AUTHENTICATION & PACKAGING CARD */}
          <div className={`mb-8 p-5 rounded-2xl border ${
            isUsed 
              ? 'bg-amber-50/60 border-amber-200' 
              : 'bg-emerald-50/60 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 ${
                isUsed 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {isUsed ? '🛡️ Certified Pre-Owned • 100% Tested Working Fine' : '📦 Brand New • Factory Sealed Retail Carton & Pack'}
              </span>
              <span className="text-[11px] font-bold text-zinc-500">
                {isUsed ? 'Pre-Owned Card' : 'Factory Sealed Card'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-zinc-900 shrink-0">Packaging:</span>
                <span>{packagingDesc}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-zinc-900 shrink-0">Condition Check:</span>
                <span>{currentConditionGrade}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-zinc-900 shrink-0">Warranty / Guarantee:</span>
                <span className="font-semibold text-primary-blue">{currentWarranty}</span>
              </div>
            </div>

            {/* If there is an alternate condition product in store, give clean standalone navigation link */}
            {alternateConditionProduct && (
              <div className="mt-4 pt-3 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-zinc-600">
                  Looking for the {alternateConditionProduct.condition === 'used' ? 'Pre-Owned (Tested Working)' : 'Brand New (Sealed Carton)'} edition?
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/product/${alternateConditionProduct.id}`)}
                  className="text-xs font-bold text-primary-blue hover:text-blue-800 underline underline-offset-2 shrink-0 flex items-center gap-1"
                >
                  View Separate {alternateConditionProduct.condition === 'used' ? 'Pre-Owned' : 'Brand New'} Card ({formatPrice(alternateConditionProduct.price)}) →
                </button>
              </div>
            )}
          </div>

          <p className="text-base text-zinc-600 mb-8 leading-relaxed">
            {product.description || `Experience premium functionality with the ${product.name}. Designed to seamlessly integrate into your daily life, offering uncompromising quality and modern aesthetics that define the next generation of smart living.`}
          </p>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">{variants[0].type || 'Options'}</h3>
                {selectedVariant && <span className="text-sm font-medium text-primary-blue">{selectedVariant.name}</span>}
              </div>
              <div className="flex flex-wrap gap-3">
                {variants.map(v => (
                  <button
                    key={v.id}
                    disabled={!v.inStock}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      !v.inStock 
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed line-through' 
                        : selectedVariant?.id === v.id 
                          ? 'border-primary-blue bg-blue-50/50 text-primary-blue ring-1 ring-primary-blue shadow-sm' 
                          : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 bg-white'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-4 h-14">
              {/* Quantity */}
              <div className="flex items-center justify-between px-4 border border-zinc-200 rounded-xl w-32 bg-white shrink-0">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1 text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-semibold text-zinc-900 w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1 text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  const productToAdd: Product = {
                    ...product,
                    price: currentPrice,
                    condition: product.condition || 'new',
                    conditionGrade: currentConditionGrade,
                    warrantyInfo: currentWarranty
                  };
                  handleAddToCart(productToAdd, quantity, selectedVariant);
                }}
                disabled={addingToCartId === product.id || (variants.length > 0 && !selectedVariant)}
                className={`flex-1 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
                  addingToCartId === product.id
                    ? 'bg-success text-white shadow-success/20'
                    : (variants.length > 0 && !selectedVariant)
                      ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed shadow-none'
                      : 'bg-primary-blue hover:bg-blue-800 text-white shadow-primary-blue/20 active:scale-[0.98]'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {addingToCartId === product.id ? 'Adding...' : `Add to Cart (${isUsed ? 'Pre-Owned' : 'Brand New'})`}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={() => {
                const productToAdd: Product = {
                  ...product,
                  price: currentPrice,
                  condition: product.condition || 'new',
                  conditionGrade: currentConditionGrade,
                  warrantyInfo: currentWarranty
                };
                handleAddToCart(productToAdd, quantity, selectedVariant);
                navigate('/checkout');
              }}
              disabled={(variants.length > 0 && !selectedVariant)}
              className={`w-full h-14 rounded-xl font-bold text-base transition-all flex items-center justify-center border-2 ${
                (variants.length > 0 && !selectedVariant)
                  ? 'border-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white active:scale-[0.98]'
              }`}
            >
              Buy it Now • {isUsed ? 'Pre-Owned' : 'Brand New'}
            </button>
          </div>

          {/* Price Drop Alert Trigger Card */}
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-blue-50/50 to-white border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                activeAlert 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                <TrendingDown className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                    {activeAlert ? 'Price Drop Alert Active' : 'Waiting for a Price Drop?'}
                  </h4>
                  {activeAlert && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      Target: {formatPrice(activeAlert.targetPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {activeAlert 
                    ? `We'll notify you automatically the instant this item drops to or below ${formatPrice(activeAlert.targetPrice)}.` 
                    : 'Set your target threshold and we will notify you the moment the price falls.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPriceAlertModalProduct(product)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                activeAlert
                  ? 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{activeAlert ? 'Modify Threshold' : 'Set Price Alert'}</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-zinc-100">
                <Truck className="w-5 h-5 text-zinc-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Fast Delivery</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Estimated 2-4 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-zinc-100">
                <ShieldCheck className="w-5 h-5 text-zinc-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Secure Checkout</h4>
                <p className="text-xs text-zinc-500 mt-0.5">SSL Encrypted payments</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-zinc-100">
                <RotateCcw className="w-5 h-5 text-zinc-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">30-Day Returns</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Not satisfied? Return it for a full refund within 30 days.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section: Description, Specs, Reviews */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 mt-16 md:mt-24 border-t border-zinc-100 pt-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Product Details</h2>
            <div className="prose prose-zinc max-w-none text-zinc-600 mb-12">
              <p>Experience the next level of innovation. The {product.name} is engineered to deliver exceptional performance while maintaining a sleek, modern aesthetic that fits perfectly into your lifestyle.</p>
              <p>Whether you're looking for superior reliability, cutting-edge technology, or intuitive design, this product is crafted to exceed your expectations in every way.</p>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Specifications</h2>
            <div className="bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 mb-12">
              {specs.map((spec, i) => (
                <div key={i} className={`flex flex-col sm:flex-row sm:items-center p-4 ${i !== specs.length - 1 ? 'border-b border-zinc-200' : ''}`}>
                  <span className="w-full sm:w-1/3 text-sm font-bold text-zinc-900 mb-1 sm:mb-0 uppercase tracking-wider">{spec.name}</span>
                  <span className="w-full sm:w-2/3 text-sm text-zinc-600">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Empty Reviews Section for UI purpose */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Customer Reviews</h2>
              <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center flex flex-col items-center">
                <Star className="w-12 h-12 text-zinc-300 mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 mb-2">No reviews yet</h3>
                <p className="text-sm text-zinc-500 mb-6">Be the first to review this product and share your experience with others.</p>
                <button className="px-6 py-3 rounded-xl border-2 border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-900 hover:text-white transition-colors">
                  Write a Review
                </button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            {/* Sidebar content if needed, empty for now to match 2-col visual balance */}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 mt-16 md:mt-24 border-t border-zinc-100 pt-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map(p => (
              <div key={p.id} className="group flex flex-col cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-zinc-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1 line-clamp-2">{p.name}</h3>
                <span className="text-sm font-bold text-zinc-900">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Purchase Bar */}
      <div className="md:hidden fixed bottom-[calc(68px+env(safe-area-inset-bottom))] inset-x-0 bg-white/90 backdrop-blur-md border-t border-zinc-200 p-4 z-40 flex items-center gap-4 animate-slide-up">
        <div className="flex flex-col flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-blue">
            {isUsed ? 'Pre-Owned • Tested' : 'Brand New • Sealed'}
          </span>
          <span className="text-sm font-bold text-zinc-900 line-clamp-1">{product.name}</span>
          <span className="text-sm font-semibold text-primary-blue">{formatPrice(currentPrice)}</span>
        </div>
        <button
          onClick={() => {
            const productToAdd = {
              ...product,
              price: currentPrice,
              condition: product.condition || 'new',
              conditionGrade: currentConditionGrade,
              warrantyInfo: currentWarranty
            };
            handleAddToCart(productToAdd, 1, selectedVariant);
          }}
          disabled={addingToCartId === product.id || (variants.length > 0 && !selectedVariant)}
          className={`px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
            addingToCartId === product.id
              ? 'bg-success text-white'
              : (variants.length > 0 && !selectedVariant)
                ? 'bg-zinc-200 text-zinc-500'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
          }`}
        >
          {addingToCartId === product.id ? 'Added' : 'Add to Cart'}
        </button>
      </div>

      {/* Copied Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Product link copied to clipboard</span>
        </div>
      )}

    </div>
  );
}

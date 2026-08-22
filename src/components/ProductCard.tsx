import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, X, Check, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../StoreContext';

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { 
    handleWishlistToggle, 
    wishlistIds, 
    handleAddToCart, 
    addingToCartId 
  } = useStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);
  const isAdding = addingToCartId === product.id;

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(product);
  };

  return (
    <>
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="group flex flex-col h-full bg-white rounded-2xl md:rounded-[32px] overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 cursor-pointer"
      >
        <div className="relative aspect-[4/5] bg-zinc-50 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 left-3 md:top-5 md:left-5 flex flex-col gap-2">
            {product.badge && (
              <span className="bg-white text-zinc-900 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          <button 
            onClick={(e) => handleWishlistToggle(product, e)}
            className="absolute top-3 right-3 md:top-5 md:right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform z-10"
          >
            <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
          </button>

          {/* Quick View Button (Desktop) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
            <button 
              onClick={handleQuickView}
              className="px-6 py-2.5 bg-white/90 backdrop-blur-md text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all"
            >
              Quick View
            </button>
          </div>
          
          {/* Quick View Button (Mobile) */}
          <button 
            onClick={handleQuickView}
            className="md:hidden absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white active:scale-95 transition-all z-10"
          >
            <Search className="w-4 h-4 text-zinc-900" />
          </button>
        </div>

        <div className="p-4 md:p-6 flex flex-col flex-1">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-3.5 h-3.5 text-zinc-900 fill-current" />
              <span className="text-[11px] font-bold text-zinc-900">{product.rating || "4.9"}</span>
              <span className="text-[11px] text-zinc-400">({product.reviewCount || Math.floor(Math.random() * 100 + 50)})</span>
            </div>
            
            <h3 className="font-bold text-zinc-900 text-sm md:text-base leading-snug line-clamp-2 mb-2 group-hover:text-primary-blue transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-zinc-900 md:text-lg">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm font-medium text-zinc-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={product.inStock === false || isAdding}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
              product.inStock === false
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : isAdding
                ? 'bg-green-500 text-white'
                : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 active:scale-[0.98]'
            }`}
          >
            {product.inStock === false ? (
              'OUT OF STOCK'
            ) : isAdding ? (
              <>
                <Check className="w-4 h-4" /> ADDED
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> ADD TO CART
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsQuickViewOpen(false)} 
          />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in max-h-[90vh]">
            <button 
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white text-zinc-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-zinc-50 shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                {product.category && <span className="text-xs font-bold uppercase tracking-wider text-primary-blue">{product.category}</span>}
                {product.inStock === false ? (
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In Stock</span>
                )}
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight mb-4">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-black text-zinc-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-zinc-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <p className="text-zinc-600 mb-8 leading-relaxed">
                {product.description || product.shortDescription || "Experience premium quality with this essential addition to your lifestyle. Designed for performance and built to last."}
              </p>
              
              <div className="mt-auto space-y-3">
                <button 
                  onClick={handleAdd}
                  disabled={product.inStock === false || isAdding}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                    product.inStock === false
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      : isAdding
                      ? 'bg-green-500 text-white'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 active:scale-[0.98]'
                  }`}
                >
                  {product.inStock === false ? 'OUT OF STOCK' : isAdding ? 'ADDED TO CART' : 'ADD TO CART'}
                </button>
                <button 
                  onClick={() => {
                    setIsQuickViewOpen(false);
                    navigate(`/product/${product.id}`);
                  }}
                  className="w-full py-4 rounded-xl flex items-center justify-center font-bold bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                  VIEW FULL DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

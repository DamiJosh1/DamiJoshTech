import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistIds, products, handleWishlistToggle, handleAddToCart, addingToCartId } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-white text-zinc-900 px-6">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-red-200" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">Save Something You Love</h2>
        <p className="text-zinc-500 mb-8 text-center max-w-sm text-lg">Your favorite products will appear here. Find something worth saving.</p>
        <button onClick={() => navigate('/shop')} className="px-8 py-4 bg-zinc-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pt-8 pb-32 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900">Your Wishlist</h1>
          <span className="text-zinc-500 font-medium">{wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 gap-y-10">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="group flex flex-col h-full">
              <div 
                className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-4 bg-zinc-100 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-3 left-3 bg-error text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    Sale
                  </div>
                )}

                <button 
                  onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product, e); }}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-error hover:bg-error hover:text-white transition-colors shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="flex flex-col flex-1 px-1">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">{product.category || 'Tech'}</span>
                <h3 
                  className="text-sm md:text-base font-semibold text-zinc-900 mb-2 line-clamp-2 leading-snug cursor-pointer hover:text-primary-blue transition-colors" 
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-base md:text-lg font-bold text-zinc-900">
                    ${(product.price).toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-zinc-400 line-through">
                      ${(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-2 border-t border-zinc-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product, 1); }}
                    disabled={addingToCartId === product.id}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      addingToCartId === product.id
                        ? 'bg-success text-white shadow-md'
                        : 'bg-zinc-100 hover:bg-zinc-900 text-zinc-900 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {addingToCartId === product.id ? 'Added to Cart' : 'Move to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

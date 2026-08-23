import React from 'react';
import { useStore } from '../../StoreContext';
import { Product } from '../../types';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AccountWishlist() {
  const { products, wishlistIds, handleWishlistToggle, handleAddToCart , formatPrice} = useStore();
  const navigate = useNavigate();

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-black text-zinc-900 mb-6">My Wishlist</h1>
      
      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Your wishlist is empty</h2>
          <p className="text-zinc-500 mb-8 max-w-md">Save items you love to your wishlist and they will show up here.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
          >
            DISCOVER PRODUCTS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden group shadow-sm flex flex-col md:flex-row h-full">
              <div className="relative h-48 md:h-full md:w-2/5 shrink-0 bg-zinc-100 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => handleWishlistToggle(product, e)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              
              <div className="p-4 md:p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-zinc-900 leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-primary-blue transition-colors" onClick={() => navigate(`/product/${product.id}`)}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-zinc-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="w-full py-2.5 bg-zinc-100 text-zinc-900 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { useStore } from '../StoreContext';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';

export default function AccountWishlist() {
  const { wishlistIds, products, handleWishlistToggle, handleAddToCart , formatPrice} = useStore();
  
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-black text-zinc-900 mb-2">Your Wishlist</h2>
      <p className="text-zinc-500 font-medium mb-8 pb-8 border-b border-zinc-100">
        Products you've saved for later.
      </p>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-zinc-50 rounded-[1.5rem] border border-zinc-200">
          <Heart className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 mb-2">Save products you love</h3>
          <p className="text-zinc-500 mb-6">Your wishlist is currently empty.</p>
          <Link to="/shop" className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
            EXPLORE PRODUCTS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id} className="bg-white border border-zinc-200 rounded-[1.5rem] overflow-hidden group hover:shadow-xl hover:border-zinc-300 transition-all flex flex-col">
              <div className="aspect-square relative bg-zinc-100 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                <button 
                  onClick={(e) => handleWishlistToggle(product, e)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-error hover:scale-110 transition-transform shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-zinc-900 line-clamp-1 mb-1">{product.name}</h3>
                <p className="font-medium text-zinc-500 text-sm mb-4">{formatPrice(product.price)}</p>
                <div className="mt-auto pt-4 border-t border-zinc-100">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    MOVE TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

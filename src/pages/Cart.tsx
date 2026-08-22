import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../StoreContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, handleWishlistToggle, wishlistIds } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tax = cartTotal * 0.08; // dummy 8% tax
  const shipping = cartTotal > 100 ? 0 : 15; // dummy shipping
  const finalTotal = cartTotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-white text-zinc-900 px-6">
        <div className="w-24 h-24 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-zinc-300" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">Your Cart is Empty</h2>
        <p className="text-zinc-500 mb-8 text-center max-w-sm text-lg">Discover products designed for better everyday living.</p>
        <button onClick={() => navigate('/shop')} className="px-8 py-4 bg-zinc-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50/50 pt-8 pb-32 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900">Your Cart</h1>
          <span className="text-zinc-500 font-medium">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Cart Items */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4 md:gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-zinc-100 flex gap-4 md:gap-6 relative group">
                <div 
                  className="w-24 h-24 md:w-36 md:h-36 rounded-2xl bg-zinc-100 overflow-hidden cursor-pointer shrink-0"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img src={item.productSnapshot.image} alt={item.productSnapshot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-2 md:mb-4">
                    <div>
                      <span className="text-[10px] md:text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1 block">
                        {item.productSnapshot.brand || 'SAJODA'}
                      </span>
                      <h3 
                        className="text-sm md:text-lg font-bold text-zinc-900 leading-snug cursor-pointer hover:text-primary-blue transition-colors line-clamp-2"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        {item.productSnapshot.name}
                      </h3>
                      {item.variantSnapshot && (
                        <p className="text-xs md:text-sm text-zinc-500 mt-1 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-zinc-100 font-medium">{item.variantSnapshot.name}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base md:text-xl font-extrabold text-zinc-900 block">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                      {item.quantity > 1 && (
                        <span className="text-xs text-zinc-500 font-medium">${item.unitPrice.toFixed(2)} each</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl h-10 md:h-12 w-28 md:w-32 px-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex-1 flex justify-center items-center h-full text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        <Minus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm md:text-base text-zinc-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex-1 flex justify-center items-center h-full text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                      <button 
                        onClick={(e) => handleWishlistToggle(item.productSnapshot, e)}
                        className={`p-2.5 rounded-full hover:bg-zinc-100 transition-colors ${wishlistIds.includes(item.productId) ? 'text-error' : 'text-zinc-400'}`}
                        aria-label="Save to Wishlist"
                      >
                        <Heart className={`w-5 h-5 ${wishlistIds.includes(item.productId) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2.5 rounded-full text-zinc-400 hover:text-error hover:bg-error/5 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-100 sticky top-28">
              <h2 className="text-xl font-extrabold text-zinc-900 mb-6 tracking-tight">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-zinc-100 text-sm md:text-base">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-zinc-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-zinc-900">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-zinc-900">Total</span>
                <span className="text-3xl font-extrabold text-zinc-900">${finalTotal.toFixed(2)}</span>
              </div>

              <div className="relative mb-8">
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  className="w-full pl-4 pr-24 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 text-sm font-medium uppercase tracking-wider"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors">
                  APPLY
                </button>
              </div>

              <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 transition-all active:scale-[0.98]">
                Checkout Securely <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                SSL Encrypted & Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

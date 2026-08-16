/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Plus, Minus, Search, Menu, ArrowRight, ShieldCheck, Truck, HeadphonesIcon, CreditCard, ArrowLeft, Moon, Sun, User } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Product, CartItem } from './types';

export default function Store() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(fetchedProducts);
    });
    return () => unsub();
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Paystack Config
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: customer.email,
    amount: Math.round(cartTotal * 100), // in kobo/cents
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_dummy_key',
    metadata: {
      custom_fields: [
        {
          display_name: 'Cart Items',
          variable_name: 'cart_items',
          value: JSON.stringify(cartItems.map(i => `${i.quantity}x ${i.name}`)),
        },
        {
          display_name: 'Cart Items Raw',
          variable_name: 'cart_items_raw',
          value: JSON.stringify(cartItems.map(i => ({ sku: i.cjSku, quantity: i.quantity }))),
        },
        {
          display_name: 'Shipping Address',
          variable_name: 'shipping_address',
          value: customer.address,
        }
      ],
    },
  };
  const initializePaystack = usePaystackPayment(paystackConfig);

  const onSuccess = async (reference: any) => {
    try {
      const orderData = {
        status: 'pending',
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || '',
        shippingAddress: customer.address,
        totalAmount: cartTotal,
        items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        paymentReference: reference?.reference || reference?.transaction_id || 'manual_success',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'orders'), orderData);
      alert(`Payment complete! Order received.`);
    } catch (e) {
      console.error(e);
      alert('Payment complete but failed to save order details. Please contact support.');
    }
    setCartItems([]);
    setIsCartOpen(false);
    setCheckoutStep('cart');
  };

  const onClose = () => {
    console.log('Payment closed');
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setCheckoutStep('cart');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-50' : 'bg-zinc-100 text-zinc-900'}`}>
      {/* Header */}
      <header className="relative w-full overflow-hidden">
        {/* Moving Blue Orb */}
        <div className="absolute w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_4px_rgba(59,130,246,0.6)] animate-orb pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-blue-500 transition-colors" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
            <a href="#" className="text-2xl font-bold tracking-tight">
              <span className="text-blue-600">DamiJosh</span>Tech
            </a>
          </div>

          {/* Search Bar */}
          <div className={`hidden md:flex flex-1 max-w-md mx-4 items-center rounded-full px-4 py-2 transition-colors ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
            <Search className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
            <input 
              type="text" 
              placeholder="Search premium tech..." 
              className={`bg-transparent border-none outline-none w-full ml-3 text-sm placeholder:text-zinc-500 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-blue-500 transition-colors">Home</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Shop</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Categories</a>
            <a href="#" className="hover:text-blue-500 transition-colors">About</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
          </nav>

          {/* Actions (Theme, Cart, Profile/Auth) */}
          <div className="flex items-center gap-2 sm:gap-4 z-10">
            {/* Mobile Search Icon */}
            <button className="md:hidden p-2 text-zinc-500 hover:text-blue-500 transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            {/* Dark/Light Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${isDarkMode ? 'bg-zinc-800 text-zinc-300 hover:text-white' : 'bg-white shadow-sm text-zinc-600 hover:text-zinc-900'}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-zinc-500 hover:text-blue-500 relative transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-transparent">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Button / Profile */}
            {isLoggedIn ? (
              <button onClick={() => setIsLoggedIn(false)} className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'}`}>
                <User className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setIsLoggedIn(true)} className="ml-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap">
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1550009158-9efff6c97364?auto=format&fit=crop&q=80&w=2000"
            alt="Modern tech setup"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48 flex flex-col items-start">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-2xl leading-tight text-white">
            Next-Generation <span className="text-blue-500">Tech</span> & Gadgets.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-xl">
            Upgrade your digital lifestyle with premium electronics, engineered for the future. From smart home to wearables, experience tomorrow today.
          </p>
          <button className="mt-10 bg-blue-600 text-white px-8 py-4 text-sm font-semibold hover:bg-blue-500 transition-colors flex items-center gap-2 whitespace-nowrap rounded-sm">
            Shop Collection
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Features/Trust */}
      <section className="border-y border-zinc-800 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Express Global Shipping', desc: 'Tracked & Insured' },
            { icon: ShieldCheck, title: '1-Year Warranty', desc: 'Guaranteed quality' },
            { icon: CreditCard, title: 'Secure Checkout', desc: '256-bit encryption' },
            { icon: HeadphonesIcon, title: '24/7 Tech Support', desc: 'Here to help anytime' },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <feature.icon className="w-6 h-6 text-blue-500 mb-4" />
              <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-white">Trending Gadgets</h2>
          <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1 group whitespace-nowrap">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map(product => (
            <div key={product.id} className="group relative flex flex-col">
              <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-900 relative mb-4 rounded-sm border border-zinc-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm whitespace-nowrap rounded-sm">
                    {product.badge}
                  </div>
                )}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-zinc-950/90 backdrop-blur-sm text-white px-6 py-3 text-sm font-medium hover:bg-zinc-900 border border-zinc-700 transition-colors w-[85%] shadow-lg shadow-black/20 whitespace-nowrap rounded-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-xs text-blue-500 mb-1 uppercase tracking-wider font-semibold">{product.category}</p>
                <h3 className="text-sm font-medium text-white line-clamp-1">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-16 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold tracking-tight mb-4"><span className="text-blue-500">DamiJosh</span>Tech</h3>
            <p className="max-w-xs leading-relaxed">
              Curating the best modern essentials for a seamless lifestyle. Quality, design, and function in every detail.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 DamiJoshTech. All rights reserved.</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col translate-x-0 transition-transform transform">
              {/* Drawer Header */}
              <div className="px-4 py-6 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {checkoutStep !== 'cart' && (
                    <button
                      onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'details' : 'cart')}
                      className="text-zinc-500 hover:text-zinc-900"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="text-lg font-medium text-zinc-900">
                    {checkoutStep === 'cart' ? `Your Cart (${cartCount})` : checkoutStep === 'details' ? 'Shipping Details' : 'Payment'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}
                  className="text-zinc-500 hover:text-zinc-900 p-2 -mr-2"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                {checkoutStep === 'cart' && (
                  <>
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                        <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                        <p>Your cart is empty.</p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="mt-6 text-sm font-medium text-zinc-900 hover:underline"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      cartItems.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 shrink-0 bg-zinc-100 overflow-hidden border border-zinc-200">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <div className="flex justify-between gap-2">
                              <h3 className="text-sm font-medium text-zinc-900 line-clamp-2">{item.name}</h3>
                              <p className="text-sm font-medium text-zinc-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-zinc-500 mt-1">${item.price.toFixed(2)} each</p>
                            
                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center border border-zinc-200">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-1 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-1 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => updateQuantity(item.id, -item.quantity)}
                                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline underline-offset-2"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {checkoutStep === 'details' && (
                  <form 
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCheckoutStep('payment');
                    }}
                    id="checkout-form"
                  >
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={customer.name}
                        onChange={e => setCustomer({...customer, name: e.target.value})}
                        className="w-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        required 
                        value={customer.email}
                        onChange={e => setCustomer({...customer, email: e.target.value})}
                        className="w-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900" 
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Phone (Optional)</label>
                      <input 
                        type="tel" 
                        value={customer.phone}
                        onChange={e => setCustomer({...customer, phone: e.target.value})}
                        className="w-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900" 
                        placeholder="+234..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Shipping Address</label>
                      <textarea 
                        required 
                        value={customer.address}
                        onChange={e => setCustomer({...customer, address: e.target.value})}
                        className="w-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 min-h-[80px]" 
                        placeholder="123 Main St..."
                      />
                    </div>
                  </form>
                )}

                {checkoutStep === 'payment' && (
                  <div className="flex flex-col gap-6">
                    <div className="bg-zinc-50 p-4 border border-zinc-200">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-zinc-600">Total to pay:</span>
                        <span className="font-semibold text-zinc-900">${cartTotal.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-600">Email:</span>
                        <span className="text-zinc-900">{customer.email}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => initializePaystack({ onSuccess, onClose })}
                      className="w-full bg-[#0ba4db] text-white py-4 text-sm font-semibold hover:bg-[#0a95c7] transition-colors flex items-center justify-center gap-2"
                    >
                      Pay with Paystack
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && checkoutStep === 'cart' && (
                <div className="border-t border-zinc-200 p-4 bg-zinc-50 shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-medium text-zinc-900">Subtotal</span>
                    <span className="text-lg font-semibold text-zinc-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-zinc-500 mb-6">Shipping and taxes calculated at checkout.</p>
                  <button 
                    onClick={() => setCheckoutStep('details')}
                    className="w-full bg-zinc-900 text-white py-4 text-sm font-semibold hover:bg-zinc-800 transition-colors whitespace-nowrap"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
              {checkoutStep === 'details' && (
                <div className="border-t border-zinc-200 p-4 bg-zinc-50 shrink-0">
                  <button 
                    type="submit"
                    form="checkout-form"
                    className="w-full bg-zinc-900 text-white py-4 text-sm font-semibold hover:bg-zinc-800 transition-colors whitespace-nowrap"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Search, Menu, ArrowRight, ShieldCheck, Truck, HeadphonesIcon, CreditCard, ArrowLeft, Moon, Sun, User, Bot, Home as HomeIcon, Package, Heart, Star, Eye } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from './firebase';
import { Product, CartItem } from './types';
import { StoreContext } from './StoreContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';

export default function Store() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('home');
  const [activeFeaturedCategory, setActiveFeaturedCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  useEffect(() => {
    setIsHeroLoaded(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      if (mediaQuery.matches) return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(fetchedProducts);
    }, (error) => {
      console.error("Firestore connection error:", error);
    });
    return () => unsub();
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Paystack Config
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: customer.email,
    amount: Math.round(cartTotal * 100), // in kobo/cents
    publicKey: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_dummy_key',
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

  const handleFeaturedAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingToCartId(product.id);
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    setTimeout(() => {
      setAddingToCartId(null);
    }, 1500);
  };

  const handleWishlistToggle = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setWishlistIds(prev => 
      prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
    );
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

  const storeState = {
    products,
    isDarkMode,
    user,
    wishlistIds,
    addingToCartId,
    prefersReducedMotion,
    handleFeaturedAddToCart,
    handleWishlistToggle,
    setQuickViewProduct
  };

  return (
    <StoreContext.Provider value={storeState}>
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-50' : 'bg-[#f4f6fc] text-slate-800'} ${user ? 'pb-16 lg:pb-0' : ''}`}>
      
      {/* Desktop Header */}
      <header className="hidden lg:block relative w-full pt-6 px-4 z-40">
         <div className={`max-w-7xl mx-auto rounded-full px-6 h-[72px] flex items-center justify-between gap-4 border shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-colors relative overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-blue-500/30' : 'bg-slate-100 border-blue-200 shadow-xl shadow-blue-500/5'}`}>
            
            {/* Logo */}
            <button onClick={() => navigate('/')} className="text-2xl font-bold tracking-tight z-10">
              <span className="text-blue-500">Vora</span><span className={isDarkMode ? 'text-white' : 'text-slate-800'}>Tech</span>
            </button>

            {/* Search */}
            <div className={`flex flex-1 max-w-md mx-4 items-center rounded-full px-4 py-2.5 z-10 transition-colors ${isDarkMode ? 'bg-zinc-800/50' : 'bg-blue-50/50'}`}>
              <Search className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`} />
              <input type="text" placeholder="Search products..." className={`bg-transparent border-none outline-none w-full ml-3 text-sm placeholder:text-zinc-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`} />
            </div>

            {/* Links */}
            <nav className="flex items-center gap-8 text-sm font-medium z-10">
              <button onClick={() => navigate('/')} className={`transition-colors hover:text-blue-500 ${window.location.pathname === '/' ? 'text-blue-500' : isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>Home</button>
              <button onClick={() => navigate('/shop')} className={`transition-colors hover:text-blue-500 ${window.location.pathname === '/shop' ? 'text-blue-500' : isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>Shop</button>
              <button onClick={() => navigate('/categories')} className={`transition-colors hover:text-blue-500 ${window.location.pathname === '/categories' ? 'text-blue-500' : isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>Categories</button>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 z-10">
               {/* Cart */}
               <button onClick={() => setIsCartOpen(true)} className={`p-2 rounded-full relative transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-blue-100 text-slate-600'}`}>
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && <span className="absolute top-1 right-0 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-transparent">{cartCount}</span>}
               </button>
               {/* Theme Toggle */}
               <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-blue-100 text-slate-600'}`}>
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
               </button>
               {/* Auth */}
               {user ? (
                 <div className="relative ml-2">
                   <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                     {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : <User className="w-5 h-5" />}
                   </button>
                   {isProfileMenuOpen && (
                     <div className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-xl py-2 border overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800 shadow-black/50' : 'bg-slate-50 border-blue-100 shadow-blue-100/50'}`}>
                        <button className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${isDarkMode ? 'hover:bg-blue-500/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'}`}>My Profile</button>
                        <button className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${isDarkMode ? 'hover:bg-blue-500/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'}`}>My Orders</button>
                        <button className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${isDarkMode ? 'hover:bg-blue-500/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'}`}>Saved/Favorites</button>
                        <button className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${isDarkMode ? 'hover:bg-blue-500/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'}`}>Settings</button>
                        <div className={`h-px my-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                        <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors">Logout</button>
                     </div>
                   )}
                 </div>
               ) : (
                 <button onClick={handleLogin} className="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                   Get Started
                 </button>
               )}
            </div>
         </div>
      </header>

      {/* Mobile Top Navbar */}
      <header className="lg:hidden relative w-full pt-4 px-4 z-40">
        <div className={`w-full rounded-2xl px-5 h-16 flex items-center justify-between border shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-colors relative overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-blue-500/30' : 'bg-slate-100 border-blue-200 shadow-xl shadow-blue-500/5'}`}>
          
          <button onClick={() => navigate('/')} className="text-xl font-bold tracking-tight z-10">
            <span className="text-blue-500">Vora</span><span className={isDarkMode ? 'text-white' : 'text-slate-800'}>Tech</span>
          </button>

          <div className="flex items-center gap-2 z-10">
            <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-200'}`}>
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className={`p-2 rounded-full relative transition-colors ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-200'}`}>
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            {!user && (
              <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-200'}`}>
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Non-Logged In) */}
      {isMobileMenuOpen && !user && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className={`relative w-4/5 max-w-sm h-full shadow-2xl flex flex-col transition-colors ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
             <div className="p-6 flex items-center justify-between border-b border-zinc-500/20">
               <span className="text-xl font-bold"><span className="text-blue-500">Vora</span>Tech</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className={`p-2 -mr-2 rounded-full ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}><X className="w-6 h-6"/></button>
             </div>
             <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
                <nav className="flex flex-col gap-6 text-lg font-medium">
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }} className={`text-left transition-colors hover:text-blue-500 ${window.location.pathname === '/' ? 'text-blue-500' : isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>Home</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop'); }} className={`text-left transition-colors hover:text-blue-500 ${window.location.pathname === '/shop' ? 'text-blue-500' : isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>Shop</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/categories'); }} className={`text-left transition-colors hover:text-blue-500 ${window.location.pathname === '/categories' ? 'text-blue-500' : isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>Categories</button>
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center justify-between py-4 border-t border-zinc-500/20">
                    <span className="font-medium">Theme</span>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                  </div>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors active:scale-95">Login</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className={`w-full py-3.5 rounded-xl font-semibold transition-colors active:scale-95 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'}`}>Sign Up</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation (Logged In) */}
      {user && (
        <div className={`lg:hidden fixed bottom-0 left-0 w-full pb-2 z-40 border-t transition-colors shadow-[0_-5px_15px_rgba(0,0,0,0.05)] ${isDarkMode ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-zinc-200'} backdrop-blur-lg`}>
          <div className="flex justify-around items-center h-16 px-2">
            <button onClick={() => setActiveMobileTab('profile')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeMobileTab === 'profile' ? 'text-blue-500' : (isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}`}>
              <User className={`w-5 h-5 ${activeMobileTab === 'profile' ? 'fill-blue-500/20' : ''}`} />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
            <button onClick={() => setActiveMobileTab('ai')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeMobileTab === 'ai' ? 'text-blue-500' : (isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}`}>
              <Bot className={`w-5 h-5 ${activeMobileTab === 'ai' ? 'fill-blue-500/20' : ''}`} />
              <span className="text-[10px] font-medium">AI</span>
            </button>
            <button onClick={() => setActiveMobileTab('home')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeMobileTab === 'home' ? 'text-blue-500' : (isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}`}>
              <HomeIcon className={`w-5 h-5 ${activeMobileTab === 'home' ? 'fill-blue-500/20' : ''}`} />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button onClick={() => setActiveMobileTab('shop')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeMobileTab === 'shop' ? 'text-blue-500' : (isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}`}>
              <ShoppingBag className={`w-5 h-5 ${activeMobileTab === 'shop' ? 'fill-blue-500/20' : ''}`} />
              <span className="text-[10px] font-medium">Shop</span>
            </button>
            <button onClick={() => setActiveMobileTab('orders')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeMobileTab === 'orders' ? 'text-blue-500' : (isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}`}>
              <Package className={`w-5 h-5 ${activeMobileTab === 'orders' ? 'fill-blue-500/20' : ''}`} />
              <span className="text-[10px] font-medium">Orders</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}>
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl flex flex-col md:flex-row ${isDarkMode ? 'bg-[#111318]' : 'bg-slate-50'}`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors">
              <X className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`} />
            </button>
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-zinc-100 dark:bg-zinc-900">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover object-center" />
            </div>
            <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <span className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}`}>
                {quickViewProduct.category}
              </span>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                {quickViewProduct.name}
              </h2>
              <div className="flex items-baseline gap-3 mb-6">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111827]'}`}>
                  ₦{(quickViewProduct.price).toLocaleString()}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-lg line-through text-[#64748B]">
                    ₦{(quickViewProduct.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>
              <p className={`text-base mb-8 line-clamp-4 ${isDarkMode ? 'text-zinc-400' : 'text-[#64748B]'}`}>
                Premium technology designed to upgrade your daily routine. Experience unparalleled performance and sleek aesthetics with the {quickViewProduct.name}.
              </p>
              <div className="flex flex-col gap-4 mt-auto">
                <button
                  onClick={() => { handleFeaturedAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                  className="w-full py-4 rounded-xl font-semibold bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => { setQuickViewProduct(null); navigate(`/product/${quickViewProduct.id}`); }}
                  className={`w-full py-4 rounded-xl font-semibold transition-colors border ${isDarkMode ? 'border-zinc-800 text-white hover:bg-white/5' : 'border-zinc-200 text-[#111827] hover:bg-black/5'}`}
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative bg-zinc-950 border-t border-zinc-800 text-zinc-300 py-16 text-sm overflow-hidden z-10 p-4">
        {/* Animated Gadgets Slideshow */}
        <div className="absolute inset-0 bg-zinc-950 pointer-events-none"></div>
        <div className="absolute inset-0 slide-1 bg-[url('https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center pointer-events-none opacity-0"></div>
        <div className="absolute inset-0 slide-2 bg-[url('https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center pointer-events-none opacity-0"></div>
        <div className="absolute inset-0 slide-3 bg-[url('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center pointer-events-none opacity-0"></div>
        <div className="absolute inset-0 slide-4 bg-[url('https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center pointer-events-none opacity-0"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-12 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 z-10 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold tracking-tight mb-4 drop-shadow-md"><span className="text-blue-400">Vora</span>Tech</h3>
            <p className="max-w-xs leading-relaxed drop-shadow-md font-medium">
              Curating the best modern essentials for a seamless lifestyle. Quality, design, and function in every detail.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Track Order</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Returns & Exchanges</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Shipping Info</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Refund Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-8 py-6 mt-8 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-4 z-10 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
          <p className="drop-shadow-md font-medium text-white">&copy; 2026 VoraTech. All rights reserved.</p>
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
    </StoreContext.Provider>
  );
}

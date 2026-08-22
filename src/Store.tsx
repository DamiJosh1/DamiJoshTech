import Preloader from './Preloader';
import Logo from './Logo';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Search, Menu, ArrowRight, ShieldCheck, Truck, HeadphonesIcon, CreditCard, ArrowLeft, Moon, Sun, User, Bot, Home as HomeIcon, Package, Heart, Star, Eye, LayoutDashboard } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { collection, addDoc, serverTimestamp, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from './firebase';
import { Product, CartItem } from './types';
import { StoreContext } from './StoreContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Ai from './pages/Ai';
import ProductDetail from './pages/ProductDetail';
import Dropshipping from './pages/Dropshipping';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';
import AccountOrders from './pages/AccountOrders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCustomers from './pages/admin/AdminCustomers';
import AccountLayout from './pages/account/AccountLayout';
import AccountDashboard from './pages/account/AccountDashboard';
import AccountProfile from './pages/account/AccountProfile';
import AccountWishlist from './pages/account/AccountWishlist';
import AccountAddresses from './pages/AccountAddresses';
import AccountSecurity from './pages/account/AccountSecurity';
import AccountNotifications from './pages/account/AccountNotifications';
import AdminComingSoon from './pages/admin/AdminComingSoon';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminLayout from './components/admin/AdminLayout';


import SearchInput from './components/SearchInput';
import MobileBottomNav from './components/MobileBottomNav';

export default function Store() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/shop')) return 'shop';
    if (path.startsWith('/ai')) return 'ai';
    if (path.startsWith('/account')) return 'profile';
    if (path.startsWith('/orders')) return 'orders_tab';
    if (path.startsWith('/admin')) return 'admin';
    return '';
  };
  const activeMobileTab = getActiveTab();
  const [activeFeaturedCategory, setActiveFeaturedCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => { const saved = localStorage.getItem("sajoda_guest_wishlist"); return saved ? JSON.parse(saved) : []; });

  useEffect(() => {
    if (user && wishlistIds.length > 0) {
      setDoc(doc(db, 'wishlists', user.uid), { products: wishlistIds });
    }
  }, [wishlistIds, user]);
  
  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'wishlists', user.uid)).then(snap => {
        if (snap.exists() && snap.data().products) {
          setWishlistIds(prev => Array.from(new Set([...prev, ...snap.data().products])));
        }
      });
    }
  }, [user]);

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
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('open-cart', handleOpenCart);
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

  const handleWishlistToggle = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds(prev => {
      const updated = prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id];
      if (!user) {
        localStorage.setItem('sajoda_guest_wishlist', JSON.stringify(updated));
      } else {
        // We sync to firestore in a useEffect, but let's just let the state handle it 
        // if there's a listener. Wait, is there a firestore sync for wishlist?
      }
      return updated;
    });
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

  const handleAddToCart = addToCart;
  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  const clearCart = () => setCartItems([]);

  const storeState = {
    products,
    isDarkMode,
    user,
    wishlistIds,
    addingToCartId,
    prefersReducedMotion,
    handleFeaturedAddToCart,
    handleAddToCart,
    handleWishlistToggle,
    setQuickViewProduct,
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    clearCart
  };

  return (
    <StoreContext.Provider value={storeState}>
      <Preloader isDarkMode={isDarkMode} />
    <div className="min-h-screen font-sans flex flex-col text-dark-text bg-light-bg pb-20 lg:pb-0">
      
                  {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
        <div className="max-w-[1440px] mx-auto px-8 h-[80px] flex items-center justify-between gap-6">
          <button onClick={() => navigate('/')} className="z-10 hover:opacity-80 transition-opacity">
            <Logo className="h-8" variant="full" />
          </button>

          <nav className="flex items-center gap-8 text-[15px] font-medium z-10">
            <button onClick={() => navigate('/shop')} className="transition-colors text-charcoal hover:text-primary-blue">Shop</button>
            <button onClick={() => navigate('/categories')} className="transition-colors text-charcoal hover:text-primary-blue">Categories</button>
            <button onClick={() => navigate('/shop?q=new')} className="transition-colors text-charcoal hover:text-primary-blue">New Arrivals</button>
            <button onClick={() => navigate('/shop?q=best')} className="transition-colors text-charcoal hover:text-primary-blue">Best Sellers</button>
            <button onClick={() => navigate('/shop?q=deals')} className="transition-colors text-charcoal hover:text-primary-blue text-error">Deals</button>
          </nav>

          <SearchInput />

          <div className="flex items-center gap-4 z-10">
             <button onClick={() => navigate('/account/wishlist')} className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-zinc-100 transition-colors relative group">
                <Heart className="w-5 h-5" />
             </button>
             <button onClick={() => setIsCartOpen(true)} className="p-2 relative transition-colors hover:text-primary-blue text-charcoal">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-primary-blue text-white text-[10px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
             </button>
             {user ? (
               <div className="relative ml-2">
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 hover:border-zinc-900 transition-colors flex items-center justify-center font-bold text-sm bg-zinc-900 text-white cursor-pointer shadow-sm">
                   {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                 </button>
                 {isProfileMenuOpen && (
                   <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl py-2 bg-white border border-zinc-100 animate-fade-in-up origin-top-right">
                      <div className="px-5 py-3 border-b border-zinc-100 mb-2">
                        <p className="text-sm font-semibold truncate text-zinc-900">{user.displayName || 'Customer'}</p>
                        <p className="text-xs truncate text-zinc-500">{user.email}</p>
                      </div>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">My Account</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/orders'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">My Orders</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/wishlist'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Wishlist</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/addresses'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Addresses</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/security'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Settings</button>
                      {user.email === 'damijosh12@gmail.com' && <button onClick={() => { setIsProfileMenuOpen(false); navigate('/admin'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-primary-blue font-medium">Admin Dashboard</button>}
                      <div className="h-px my-1 bg-zinc-100" />
                      <button onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }} className="w-full text-left px-5 py-2 text-sm text-error hover:bg-red-50 transition-colors">Log Out</button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="relative ml-2">
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 p-2 hover:text-zinc-900 transition-colors text-zinc-600">
                   <User className="w-5 h-5" />
                   <span className="text-sm font-medium">Account</span>
                 </button>
                 {isProfileMenuOpen && (
                   <div className="absolute right-0 mt-3 w-64 rounded-xl shadow-xl p-5 bg-white border border-zinc-100 animate-fade-in-up origin-top-right">
                      <h3 className="text-sm font-black text-zinc-900 mb-1 tracking-tight">WELCOME TO SAJODA</h3>
                      <p className="text-xs text-zinc-500 mb-4">Sign in to your account or create a new account.</p>
                      <div className="space-y-2">
                        <button onClick={() => { setIsProfileMenuOpen(false); navigate('/login'); }} className="w-full py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">LOGIN</button>
                        <button onClick={() => { setIsProfileMenuOpen(false); navigate('/register'); }} className="w-full py-2.5 bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors">CREATE ACCOUNT</button>
                      </div>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>
      </header>
{/* Mobile Top Navbar */}
      <header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 z-10">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/')}>
              <Logo className="h-5" variant="full" />
            </button>
          </div>
          
          <div className="flex items-center gap-1 -mr-2 z-10">
            <button onClick={() => user ? navigate('/account') : navigate('/login')} className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors relative overflow-hidden flex items-center justify-center">
              {user ? (
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] overflow-hidden">
                  {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 relative text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary-blue text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className={`px-4 transition-all duration-300 overflow-hidden ${scrollY > 50 ? 'h-0 opacity-0 pb-0' : 'h-[52px] pb-3 opacity-100'}`}>
          <div className="w-full flex items-center justify-between">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors mr-2">
               <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" onClick={() => navigate('/search')}>
               <div className="w-full py-2.5 px-4 bg-zinc-100 rounded-full flex items-center gap-2 text-zinc-500">
                 <Search className="w-4 h-4" />
                 <span className="text-sm">Search gadgets, appliances...</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-full md:w-4/5 max-w-sm h-[90vh] md:h-full mt-auto md:mt-0 bg-white rounded-t-3xl md:rounded-none shadow-2xl flex flex-col transform transition-transform animate-slide-up md:animate-slide-left">
             <div className="p-5 flex items-center justify-between border-b border-zinc-100">
               <Logo className="h-6" variant="full" />
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-charcoal hover:bg-light-bg rounded-full"><X className="w-6 h-6"/></button>
             </div>
             <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
                <nav className="flex flex-col gap-6 text-[15px] font-medium text-dark-text">
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }} className="text-left hover:text-primary-blue">Home</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop'); }} className="text-left hover:text-primary-blue">Shop</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/categories'); }} className="text-left hover:text-primary-blue">Categories</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop?q=new'); }} className="text-left hover:text-primary-blue">New Arrivals</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop?q=best'); }} className="text-left hover:text-primary-blue">Best Sellers</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop?q=deals'); }} className="text-left text-error hover:text-primary-blue">Deals</button>
                  
                  <div className="h-px bg-zinc-100 my-2" />
                  
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/orders'); }} className="text-left hover:text-primary-blue">Track Order</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/about'); }} className="text-left hover:text-primary-blue">About</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/contact'); }} className="text-left hover:text-primary-blue">Contact</button>
                  
                  <div className="h-px bg-zinc-100 my-2" />
                  
                  {user ? (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/account'); }} className="text-left flex items-center gap-3 hover:bg-zinc-50 p-2 -ml-2 rounded-xl transition-colors w-full">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm shrink-0">
                          {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className="font-bold text-sm text-zinc-900 truncate w-full text-left">{user.displayName || 'My Account'}</span>
                          <span className="text-xs text-zinc-500 truncate w-full text-left">{user.email}</span>
                        </div>
                     </button>
                  ) : (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="text-left flex items-center gap-3 hover:bg-zinc-50 p-2 -ml-2 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm">Login / Sign Up</span>
                     </button>
                  )}
                </nav>
             </div>
          </div>
        </div>
      )}
<main className="flex-1 flex flex-col w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/search" element={<Shop />} />
          <Route path="/category/:slug" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          
          <Route path="/ai" element={<Ai />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/track-order" element={<TrackOrder />} />
          
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountDashboard />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="security" element={<AccountSecurity />} />
            <Route path="notifications" element={<AccountNotifications />} />
          </Route>

          <Route path="/dropshipping" element={<Dropshipping />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:id" element={<AdminProductForm />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="categories" element={<AdminComingSoon />} />
            <Route path="inventory" element={<AdminComingSoon />} />
            <Route path="cjdropshipping" element={<AdminComingSoon />} />
            <Route path="discounts" element={<AdminComingSoon />} />
            <Route path="shipping" element={<AdminComingSoon />} />
            <Route path="homepage" element={<AdminComingSoon />} />
            <Route path="reviews" element={<AdminComingSoon />} />
            <Route path="marketing" element={<AdminComingSoon />} />
            <Route path="analytics" element={<AdminComingSoon />} />
            <Route path="notifications" element={<AdminComingSoon />} />
            <Route path="settings" element={<AdminComingSoon />} />
          </Route>
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
            <Logo variant="full" className="h-6" />
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
          <div className="fixed inset-x-0 bottom-0 md:inset-x-auto md:inset-y-0 md:right-0 max-w-md w-full flex justify-end">
            <div className="w-full h-[90vh] md:h-full bg-white md:shadow-2xl flex flex-col rounded-t-[2rem] md:rounded-none translate-y-0 md:translate-x-0 transition-transform transform animate-slide-up md:animate-none border-t border-zinc-200 md:border-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <div className="md:hidden w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-zinc-200" />
              </div>
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
      <MobileBottomNav cartCount={cartCount} />
    </StoreContext.Provider>
  );
}

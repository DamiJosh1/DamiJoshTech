import Footer from "./components/Footer";
import Preloader from './Preloader';
import Logo from './Logo';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { ShoppingBag, Zap, Bell, X, Plus, Minus, Search, Menu, ArrowRight, ShieldCheck, Truck, HeadphonesIcon, CreditCard, ArrowLeft, Moon, Sun, User, Bot, Home as HomeIcon, Package, Heart, Star, Eye, LayoutDashboard } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { collection, addDoc, serverTimestamp, onSnapshot, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from './firebase';
import { Product, CartItem, Promotion, AppNotification, StoreCountry, StoreCurrency, ShippingMethod, TaxRule } from './types';
import { StoreContext } from './StoreContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Ai from './pages/Ai';
import Deals from './pages/Deals';
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
import AccountNotificationPreferences from './pages/account/AccountNotificationPreferences';
import AdminComingSoon from './pages/admin/AdminComingSoon';
import AdminCommunications from './pages/admin/AdminCommunications';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminDiscountForm from './pages/admin/AdminDiscountForm';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProductForm from './pages/admin/AdminProductForm';
import ContentPage from './pages/ContentPage';
import NotFound from './pages/NotFound';
import AdminSystemHealth from './pages/admin/AdminSystemHealth';
import AdminLayout from './components/admin/AdminLayout';


import SearchInput from './components/SearchInput';
import MobileBottomNav from './components/MobileBottomNav';
import PWAPrompt from './components/PWAPrompt';

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

  const [countries, setCountries] = useState<StoreCountry[]>([]);
  const [currencies, setCurrencies] = useState<StoreCurrency[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [taxRules, setTaxRules] = useState<TaxRule[]>([]);
  const [activeCountry, setActiveCountry] = useState<StoreCountry | null>(null);
  const [activeCurrency, setActiveCurrency] = useState<StoreCurrency | null>(null);

  // Load international data
  useEffect(() => {
    const unsubCountries = onSnapshot(collection(db, 'countries'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StoreCountry));
      setCountries(docs);
      if (docs.length > 0 && !activeCountry) {
        setActiveCountry(docs.find(c => c.active) || docs[0]);
      }
    });

    const unsubCurrencies = onSnapshot(collection(db, 'currencies'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StoreCurrency));
      setCurrencies(docs);
      if (docs.length > 0 && !activeCurrency) {
        setActiveCurrency(docs.find(c => c.code === 'USD') || docs[0]);
      }
    });

    const unsubShipping = onSnapshot(collection(db, 'shipping_methods'), (snapshot) => {
      setShippingMethods(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ShippingMethod)));
    });

    const unsubTaxes = onSnapshot(collection(db, 'tax_rules'), (snapshot) => {
      setTaxRules(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TaxRule)));
    });

    return () => {
      unsubCountries();
      unsubCurrencies();
      unsubShipping();
      unsubTaxes();
    };
  }, []);

  const [user, setUser] = useState<FirebaseUser | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const q = query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: AppNotification[] = [];
      snapshot.forEach(doc => {
        notifs.push({ id: doc.id, ...doc.data() } as AppNotification);
      });
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [user]);

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch(err) { console.error(err) }
  };

  const markAllNotificationsAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const notif of unread) {
      if (notif.id) {
         try {
           await updateDoc(doc(db, "notifications", notif.id), { read: true });
         } catch(err) {}
      }
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch(err) { console.error(err) }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/checkout');
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
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeCoupon, setActiveCoupon] = useState<Promotion | null>(null);

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

    const unsubPromotions = onSnapshot(collection(db, 'promotions'), (snapshot) => {
      const fetchedPromotions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
      setPromotions(fetchedPromotions);
    }, (error) => {
      console.error("Firestore promotions connection error:", error);
    });
    
    return () => {
      unsub();
      unsubPromotions();
    };

  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    signOut(auth);
  };


  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount
  let cartDiscount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      cartDiscount = cartSubtotal * (activeCoupon.discountValue / 100);
    } else if (activeCoupon.discountType === 'fixed') {
      cartDiscount = activeCoupon.discountValue;
    }
  }
  
  // Handle automatic promotions later if needed...
  
  // Ensure discount doesn't exceed subtotal
  if (cartDiscount > cartSubtotal) {
    cartDiscount = cartSubtotal;
  }
  
  const cartTotal = cartSubtotal - cartDiscount;

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

  const formatPrice = (amount: number) => {
    if (!activeCurrency) {
      return "$" + amount.toFixed(2);
    }
    const converted = amount * activeCurrency.exchangeRate;
    return activeCurrency.symbol + converted.toFixed(activeCurrency.decimalPrecision);
  };

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
    clearCart,
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    countries,
    currencies,
    shippingMethods,
    taxRules,
    activeCountry,
    setActiveCountry,
    activeCurrency,
    setActiveCurrency,
    formatPrice
  };

  return (
    <StoreContext.Provider value={storeState}>
      <Preloader isDarkMode={isDarkMode} />
    <div className="min-h-screen font-sans flex flex-col text-dark-text bg-light-bg pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-0">
      
                  {/* Desktop Header */}
      {!isCheckout && (
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
                      <div className="px-5 py-3 border-b border-zinc-100 mb-1">
                        <p className="text-sm font-bold text-zinc-900 truncate">{user.displayName || 'Customer'}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">My Account</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/orders'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">My Orders</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/wishlist'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Wishlist</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/addresses'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Addresses</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/security'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Settings</button>
                      {user.email === 'damijosh12@gmail.com' && <button onClick={() => { setIsProfileMenuOpen(false); navigate('/admin'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-primary-blue font-medium">Admin Dashboard</button>}
                      <div className="h-px my-1 bg-zinc-100" />
                     {user.email === 'damijosh12@gmail.com' && <button onClick={() => { setIsMobileMenuOpen(false); navigate('/admin'); }} className="text-left text-primary-blue font-bold transition-colors mt-2 p-2 -ml-2">Admin Dashboard</button>}
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
                   <div className="absolute right-0 mt-3 w-64 rounded-xl shadow-xl p-5 bg-white border border-zinc-100 animate-fade-in-up origin-top-right z-50">
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
      )}

      {/* Mobile Top Navbar */}
      {!isCheckout && (
        <header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 pt-safe">
        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="z-10" aria-label="Home">
            <Logo className="h-6" variant="full" />
          </button>
          <div className="flex items-center gap-1 z-10">
            <button onClick={() => navigate('/search')} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/account')} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Profile">
              <User className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 relative transition-colors hover:bg-zinc-100 rounded-full text-zinc-800" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary-blue text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
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
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/deals'); }} className="text-left text-error hover:text-primary-blue flex items-center gap-2"><Zap className="w-4 h-4" /> Deals</button>
                  
                  <div className="h-px bg-zinc-100 my-2" />
                  
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/orders'); }} className="text-left hover:text-primary-blue">Track Order</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/about'); }} className="text-left hover:text-primary-blue">About</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/contact'); }} className="text-left hover:text-primary-blue">Contact</button>
                  
                  <div className="h-px bg-zinc-100 my-2" />
                  
                  {user ? (
                     <>
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/account'); }} className="text-left flex items-center gap-3 hover:bg-zinc-50 p-2 -ml-2 rounded-xl transition-colors w-full">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm shrink-0">
                          {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className="font-bold text-sm text-zinc-900 truncate w-full text-left">{user.displayName || 'My Account'}</span>
                          <span className="text-xs text-zinc-500 truncate w-full text-left">{user.email}</span>
                        </div>
                     </button>
                     {user.email === 'damijosh12@gmail.com' && <button onClick={() => { setIsMobileMenuOpen(false); navigate('/admin'); }} className="text-left text-primary-blue font-bold transition-colors mt-2 p-2 -ml-2">Admin Dashboard</button>}
                     <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-left text-error hover:text-red-600 font-bold transition-colors mt-2 p-2 -ml-2">Log Out</button>
                     </>
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
          <Route path="/deals" element={<Deals />} />
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
            <Route path="notifications/preferences" element={<AccountNotificationPreferences />} />
          </Route>

          
          <Route path="/help" element={<ContentPage />} />
          <Route path="/faq" element={<ContentPage />} />
          <Route path="/contact" element={<ContentPage />} />
          <Route path="/shipping" element={<ContentPage />} />
          <Route path="/returns" element={<ContentPage />} />
          <Route path="/privacy" element={<ContentPage />} />
          <Route path="/terms" element={<ContentPage />} />
                    <Route path="/about" element={<ContentPage />} />
          <Route path="/why-sajoda" element={<ContentPage />} />
          <Route path="/careers" element={<ContentPage />} />
          <Route path="/cookies" element={<ContentPage />} />
          <Route path="/warranty" element={<ContentPage />} />
          
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
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="discounts/new" element={<AdminDiscountForm />} />
            <Route path="shipping" element={<AdminComingSoon />} />
            <Route path="homepage" element={<AdminComingSoon />} />
            <Route path="reviews" element={<AdminComingSoon />} />
            <Route path="marketing" element={<AdminComingSoon />} />

            <Route path="analytics" element={<AdminComingSoon />} />
            <Route path="notifications" element={<AdminCommunications />} />
            <Route path="settings" element={<AdminComingSoon />} />
            <Route path="system-health" element={<AdminSystemHealth />} />

          </Route>
          <Route path="*" element={<NotFound />} />
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

      <Footer />

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
                              <p className="text-sm font-medium text-zinc-900 shrink-0">{formatPrice((item.price * item.quantity))}</p>
                            </div>
                            <p className="text-sm text-zinc-500 mt-1">{formatPrice(item.price)} each</p>
                            
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
                        <span className="font-semibold text-zinc-900">{formatPrice(cartTotal)} USD</span>
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
                    <span className="text-lg font-semibold text-zinc-900">{formatPrice(cartTotal)}</span>
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
      <MobileBottomNav />
      <PWAPrompt />
    </StoreContext.Provider>
  );
}

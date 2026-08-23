import React, { useEffect, useState } from 'react';
import { Home, Search, Heart, ShoppingBag, Grid } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const { cartItems, wishlistIds } = useStore();
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistIds.length;

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path.startsWith('/shop')) setActiveTab('shop');
    else if (path.startsWith('/search')) setActiveTab('search');
    else if (path.startsWith('/account/wishlist')) setActiveTab('wishlist');
    else if (path.startsWith('/cart')) setActiveTab('cart');
    else setActiveTab('');
  }, [location.pathname]);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'shop', icon: Grid, label: 'Shop', path: '/shop' },
    { id: 'search', icon: Search, label: 'Search', path: '/search' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', path: '/account/wishlist', badge: wishlistCount },
    { id: 'cart', icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount },
  ];

    if (location.pathname.startsWith('/checkout')) return null;

  const handleNavClick = (item: any) => {
    navigate(item.path);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <nav className="flex items-center justify-around h-[68px] px-2 relative bg-white">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="relative flex flex-col items-center justify-center w-full h-full text-zinc-500 transition-colors group tap-highlight-transparent"
              aria-label={item.label}
            >
              <div className={`relative flex items-center justify-center p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'text-primary-blue bg-blue-50/50' : 'text-zinc-500'}`}>
                <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-90'}`} strokeWidth={isActive ? 2.5 : 2} />
                
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-blue text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-[10px] font-medium mt-1 transition-all duration-300 ${isActive ? 'text-primary-blue translate-y-0 opacity-100' : 'text-zinc-500 translate-y-0.5 opacity-80'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

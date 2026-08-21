import React, { useEffect, useState } from 'react';
import { Home, Search, Heart, ShoppingBag, Grid } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MobileBottomNav({ cartCount }: { cartCount: number }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path.startsWith('/shop')) setActiveTab('shop');
    else if (path.startsWith('/categories') || path.startsWith('/search')) setActiveTab('search');
    else if (path.startsWith('/profile') || path.startsWith('/wishlist')) setActiveTab('wishlist');
    // Cart is handled via modal, but we can set it active if we had a dedicated page.
  }, [location.pathname]);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'shop', icon: Grid, label: 'Shop', path: '/shop' },
    { id: 'search', icon: Search, label: 'Search', path: '/categories' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', path: '/profile' },
    // Cart uses a button not a route directly usually, but let's wire it up
    { id: 'cart', icon: ShoppingBag, label: 'Cart', isCart: true },
  ];

  const handleNavClick = (item: any) => {
    if (item.isCart) {
      // Trigger cart open event. We can dispatch a custom event that Store.tsx listens to
      window.dispatchEvent(new CustomEvent('open-cart'));
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <nav className="flex items-center justify-around h-16 px-2 relative">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id && !item.isCart;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="relative flex flex-col items-center justify-center w-16 h-full text-zinc-500 hover:text-primary-blue transition-colors group"
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-primary-blue rounded-b-full shadow-[0_2px_8px_rgba(13,71,161,0.4)]" />
              )}
              
              <div className={`relative flex items-center justify-center p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 text-primary-blue' : 'text-zinc-500'}`}>
                <Icon className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-active:scale-95'}`} strokeWidth={isActive ? 2.5 : 2} />
                
                {item.isCart && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-blue text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              
              <span className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${isActive ? 'text-primary-blue' : 'text-zinc-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

#!/bin/bash
cat << 'INNER' > src/pages/Profile.tsx
import React, { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Package, Settings, Heart, CreditCard, ChevronRight } from 'lucide-react';
import { StoreContext } from '../StoreContext';

const Profile = () => {
  const { user, isDarkMode, handleLogout, products, wishlistIds } = useContext(StoreContext)!;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id || (p as any).cjSku || ''));

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar / Profile Card */}
          <div className="md:col-span-1 space-y-4">
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={32} />
                  )}
                </div>
                <h2 className="text-lg font-semibold mb-1">{user.displayName || 'Customer'}</h2>
                <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'} mb-6 break-all`}>{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors dark:bg-red-950/30 dark:hover:bg-red-900/40"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button className={`p-4 rounded-xl font-medium text-left transition-colors flex items-center justify-between ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-slate-800 shadow-sm border border-slate-200'}`}>
                <div className="flex items-center gap-3"><Package size={18} /> Orders</div>
                <ChevronRight size={16} />
              </button>
              <button className={`p-4 rounded-xl font-medium text-left transition-colors flex items-center justify-between ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-slate-800 shadow-sm border border-slate-200'}`}>
                <div className="flex items-center gap-3"><Settings size={18} /> Settings</div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 space-y-6">
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <Package className="text-blue-500" size={20} />
                 Recent Orders
               </h3>
               <div className="text-center py-12 border-2 border-dashed rounded-xl border-slate-200 dark:border-zinc-800">
                 <p className={`font-medium ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>No recent orders found</p>
                 <p className={`text-sm mt-1 mb-6 ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Looks like you haven't made a purchase yet.</p>
                 <Link to="/shop" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium transition-colors">
                   Start Shopping
                 </Link>
               </div>
            </div>

            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <Heart className="text-red-500" size={20} />
                 My Wishlist
               </h3>
               
               {wishlistedProducts.length === 0 ? (
                 <div className="text-center py-8">
                   <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Your wishlist is currently empty.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {wishlistedProducts.map(p => (
                     <div key={p.id || (p as any).cjSku} className={`flex items-center gap-4 p-4 rounded-xl border ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'} hover:shadow-md transition-shadow`}>
                        <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold line-clamp-1">{p.name}</p>
                          <p className="text-blue-500 font-bold">${p.price}</p>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
INNER

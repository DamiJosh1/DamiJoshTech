import React, { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Package, Settings, Heart, CreditCard, ChevronRight } from 'lucide-react';
import { StoreContext } from '../StoreContext';

const Profile = () => {
  const { user, isDarkMode, handleLogout } = useContext(StoreContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { icon: Package, label: 'My Orders', desc: 'Track, return, or buy things again' },
    { icon: Heart, label: 'Saved Items', desc: 'View your wishlist and saved for later' },
    { icon: CreditCard, label: 'Payment Methods', desc: 'Manage your saved payment options' },
    { icon: Settings, label: 'Account Settings', desc: 'Password, email, and personal info' },
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar / Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={40} />
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-1">{user.displayName || 'Shopper'}</h2>
                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'} mb-6`}>{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors dark:bg-red-950/30 dark:hover:bg-red-900/40"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to="#"
                    className={`group p-6 rounded-2xl border ${
                      isDarkMode 
                        ? 'bg-zinc-900/50 border-white/10 hover:border-purple-500/50 hover:bg-zinc-900' 
                        : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-md'
                    } transition-all duration-300 flex items-start gap-4`}
                  >
                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-zinc-800 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 group-hover:text-purple-500 transition-colors">{item.label}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>{item.desc}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 mt-1 ${isDarkMode ? 'text-zinc-600 group-hover:text-purple-400' : 'text-slate-300 group-hover:text-purple-500'} transition-colors`} />
                  </Link>
                );
              })}
            </div>
            
            <div className={`mt-8 p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
               <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
               <div className="text-center py-8">
                 <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-400'}`}>
                    <Package size={32} />
                 </div>
                 <p className={`font-medium ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>No recent orders found</p>
                 <p className={`text-sm mt-1 mb-6 ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Looks like you haven't made a purchase yet.</p>
                 <Link to="/shop" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-6 rounded-full font-medium transition-colors shadow-lg shadow-purple-500/20">
                   Start Shopping
                 </Link>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;

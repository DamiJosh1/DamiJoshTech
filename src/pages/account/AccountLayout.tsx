import React, { useEffect } from 'react';
import { useStore } from '../../StoreContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Heart, MapPin, Shield, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function AccountLayout() {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const navItems = [
    { name: 'Dashboard', path: '/account', icon: LayoutDashboard },
    { name: 'My Orders', path: '/account/orders', icon: Package },
    { name: 'Wishlist', path: '/account/wishlist', icon: Heart },
    { name: 'Profile', path: '/account/profile', icon: UserIcon },
    { name: 'Addresses', path: '/account/addresses', icon: MapPin },
    { name: 'Security', path: '/account/security', icon: Shield },
    { name: 'Notifications', path: '/account/notifications', icon: Bell },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-zinc-50 pt-6 pb-24 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm sticky top-28">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : getInitials(user.displayName)}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-zinc-900 truncate">{user.displayName || 'Customer'}</h2>
                <p className="text-sm text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/account' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="h-px bg-zinc-100 my-4" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

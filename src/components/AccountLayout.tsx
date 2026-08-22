import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { 
  LayoutDashboard, Package, Heart, MapPin, 
  User, ShieldCheck, Bell, LogOut, ChevronRight 
} from 'lucide-react';
import { useStore } from '../StoreContext';

export default function AccountLayout() {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !auth.currentUser) {
      // Not authenticated, redirect to login
      navigate('/login', { state: { from: location }, replace: true });
    } else if (user) {
      // Fetch user profile
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        } catch (e) {
          console.error("Error fetching profile", e);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, navigate, location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems = [
    { name: 'Overview', path: '/account', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { name: 'Orders', path: '/account/orders', icon: <Package className="w-5 h-5" /> },
    { name: 'Wishlist', path: '/account/wishlist', icon: <Heart className="w-5 h-5" /> },
    { name: 'Addresses', path: '/account/addresses', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Profile', path: '/account/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Notifications', path: '/account/notifications', icon: <Bell className="w-5 h-5" /> },
    { name: 'Security', path: '/account/security', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Top Nav */}
          <div className="w-full lg:w-64 shrink-0">
            {/* User Greeting (Mobile mainly, but visible on desktop too) */}
            <div className="mb-8">
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                {profileData?.firstName ? `Hi, ${profileData.firstName}` : 'My Account'}
              </h1>
              <p className="text-sm text-zinc-500 font-medium">{user?.email}</p>
            </div>

            {/* Navigation Menu */}
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition-colors
                    ${isActive 
                      ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' 
                      : 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                    }
                  `}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              
              <div className="hidden lg:block w-full h-px bg-zinc-200 my-4"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-error hover:bg-error/10 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-sm border border-zinc-100">
              <Outlet context={{ profileData }} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useStore } from '../../StoreContext';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, 
  Menu, X, Bell, Search, BarChart3, Globe, Shield, Activity, 
  MessageSquare, Tag, Truck
} from 'lucide-react';

export default function AdminLayout() {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Desktop sidebar expanded state

  useEffect(() => {
    const checkAdmin = async () => {
      if (!auth.currentUser) {
        setIsAdmin(false);
        navigate('/admin/login', { replace: true });
        return;
      }
      
      try {
        const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          // Check if they are the hardcoded master admin
          if (auth.currentUser.email === 'damijosh12@gmail.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            navigate('/', { replace: true }); // Redirect normal users away
          }
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setIsAdmin(false);
        navigate('/', { replace: true });
      }
    };

    checkAdmin();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tag className="w-5 h-5" /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users className="w-5 h-5" /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Activity className="w-5 h-5" /> },
    { name: 'CJdropshipping', path: '/admin/cjdropshipping', icon: <Globe className="w-5 h-5" /> },
    { name: 'Discounts', path: '/admin/discounts', icon: <Tag className="w-5 h-5" /> },
    { name: 'Shipping', path: '/admin/shipping', icon: <Truck className="w-5 h-5" /> },
    { name: 'Homepage', path: '/admin/homepage', icon: <Globe className="w-5 h-5" /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Marketing', path: '/admin/marketing', icon: <Activity className="w-5 h-5" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (isAdmin === false) {
    return null; // Should redirect
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-zinc-950 text-white
          transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'lg:w-64' : 'lg:w-20'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <Shield className="w-6 h-6 text-indigo-400 shrink-0" />
            <span className={`font-black text-xl tracking-tight whitespace-nowrap transition-opacity duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0'}`}>
              SAJODA
            </span>
          </div>
          <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <nav className="px-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors group relative
                  ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}
                `}
                title={!isExpanded ? item.name : undefined}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="shrink-0">{item.icon}</div>
                <span className={`whitespace-nowrap transition-opacity duration-300 ${!isExpanded && 'lg:opacity-0 lg:hidden'}`}>
                  {item.name}
                </span>
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="hidden lg:block absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800 shrink-0">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors
              ${!isExpanded && 'lg:justify-center'}
            `}
            title={!isExpanded ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${!isExpanded && 'lg:opacity-0 lg:hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-zinc-500 hover:text-zinc-900"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button 
              className="hidden lg:block text-zinc-500 hover:text-zinc-900"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center bg-zinc-100 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm font-medium w-full text-zinc-900 placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 border border-indigo-200">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
    </div>
  );
}

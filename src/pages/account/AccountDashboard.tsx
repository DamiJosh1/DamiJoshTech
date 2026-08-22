import React, { useEffect, useState } from 'react';
import { useStore } from '../../StoreContext';
import { Package, Heart, MapPin, Shield, Bell, ArrowRight, User as UserIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AccountDashboard() {
  const { user, products, wishlistIds } = useStore();
  const navigate = useNavigate();
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchRecentOrder = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
          orders.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
          setRecentOrder(orders[0]);
        }
      } catch (err) {
        console.error('Error fetching recent order:', err);
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchRecentOrder();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">WELCOME BACK, {user.displayName?.split(' ')[0]?.toUpperCase() || 'GUEST'}</h1>
        <p className="text-zinc-500 mt-2 font-medium">Manage your orders, profile, and preferences here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/account/orders" className="group bg-white p-6 rounded-2xl border border-zinc-200 hover:border-zinc-900 transition-colors shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-zinc-900" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">My Orders</h3>
          <p className="text-sm text-zinc-500">Track, return, or buy things again</p>
          <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
        </Link>
        
        <Link to="/account/wishlist" className="group bg-white p-6 rounded-2xl border border-zinc-200 hover:border-zinc-900 transition-colors shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 text-zinc-900" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">Wishlist ({wishlistIds.length})</h3>
          <p className="text-sm text-zinc-500">Your saved items for later</p>
          <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link to="/account/profile" className="group bg-white p-6 rounded-2xl border border-zinc-200 hover:border-zinc-900 transition-colors shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UserIcon className="w-6 h-6 text-zinc-900" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">Profile</h3>
          <p className="text-sm text-zinc-500">Edit login, name, and mobile number</p>
          <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link to="/account/addresses" className="group bg-white p-6 rounded-2xl border border-zinc-200 hover:border-zinc-900 transition-colors shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6 text-zinc-900" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">Addresses</h3>
          <p className="text-sm text-zinc-500">Edit addresses for orders</p>
          <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link to="/account/security" className="group bg-white p-6 rounded-2xl border border-zinc-200 hover:border-zinc-900 transition-colors shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-zinc-900" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">Security</h3>
          <p className="text-sm text-zinc-500">Update your password</p>
          <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link to="/account/notifications" className="group bg-white p-6 rounded-2xl border border-zinc-200 hover:border-zinc-900 transition-colors shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bell className="w-6 h-6 text-zinc-900" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">Notifications</h3>
          <p className="text-sm text-zinc-500">Updates on orders and account</p>
          <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2"><Package className="w-5 h-5"/> Recent Order</h2>
        {loadingOrder ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-200 rounded"></div>
                <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : recentOrder ? (
          <div className="border border-zinc-100 rounded-xl p-4 bg-zinc-50 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Order #{recentOrder.orderNumber}</p>
              <p className="text-xs text-zinc-500 mt-1">Placed on {recentOrder.createdAt?.toDate().toLocaleDateString()}</p>
              <p className="text-sm font-bold text-zinc-900 mt-2">${recentOrder.total?.toFixed(2)}</p>
              <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-3">
                {recentOrder.status}
              </div>
            </div>
            <Link to={`/account/orders/${recentOrder.id}`} className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-colors">
              VIEW ORDER
            </Link>
          </div>
        ) : (
          <div className="text-zinc-500 text-sm">
            You haven't placed any orders yet. <Link to="/shop" className="text-primary-blue font-bold hover:underline">Start shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
}

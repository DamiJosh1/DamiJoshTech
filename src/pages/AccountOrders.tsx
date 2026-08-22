import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../StoreContext';
import { Package, ArrowRight, ChevronRight, Clock, Search } from 'lucide-react';

export default function AccountOrders() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'), 
          where('customerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        let fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedOrders.sort((a: any, b: any) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' || (order.status || 'Processing') === filter;
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-black text-zinc-900 mb-2">Order History</h2>
      <p className="text-zinc-500 font-medium mb-8">View and track your past orders.</p>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide shrink-0">
          {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                filter === f ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Search order #"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors text-sm font-medium"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-zinc-50 rounded-[1.5rem] border border-zinc-200">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No orders found</h3>
          <p className="text-zinc-500 mb-6">Your order history is currently empty for this filter.</p>
          <Link to="/shop" className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white border border-zinc-200 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg hover:border-zinc-300 transition-all">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-zinc-900">{order.orderNumber}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-success/10 text-success' :
                    order.status === 'Cancelled' ? 'bg-error/10 text-error' :
                    'bg-zinc-100 text-zinc-600'
                  }`}>
                    {order.status || 'Processing'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                  <span>{new Date(order.createdAt?.toMillis() || Date.now()).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>${(order.calculatedTotal || 0).toFixed(2)}</span>
                  <span>•</span>
                  <span>{order.cartSnapshot?.length || 0} items</span>
                </div>
              </div>
              
              <Link 
                to={`/account/orders/${order.id}`}
                className="w-full md:w-auto text-center bg-zinc-50 hover:bg-zinc-100 text-zinc-900 px-6 py-3 rounded-xl font-bold border border-zinc-200 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
              >
                View Order
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

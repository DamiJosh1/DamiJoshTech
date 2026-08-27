import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle2, 
  ArrowRight, Search, Plus, Filter, Activity, Clock, Bot, Bell, Shield, Zap
} from 'lucide-react';
import { collection, query, getDocs, limit, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const ordersSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5)));
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        let revenue = 0;
        const allOrdersSnapshot = await getDocs(collection(db, 'orders'));
        allOrdersSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status !== 'cancelled' && data.status !== 'refunded') {
            revenue += (data.total || 0);
          }
        });

        const productsSnapshot = await getDocs(collection(db, 'products'));
        
        setStats({
          totalRevenue: revenue,
          totalOrders: allOrdersSnapshot.size,
          totalProducts: productsSnapshot.size,
          totalCustomers: new Set(allOrdersSnapshot.docs.map(d => d.data().customerEmail)).size
        });
        
        setRecentOrders(ordersData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* COMMAND CENTER HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">GOOD MORNING, ADMIN</h1>
          <p className="text-sm text-zinc-500 font-medium">SAJODA ELECTRONICS • COMMERCE OPERATING SYSTEM</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM HEALTHY
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 text-xs font-bold">
            <Bot className="w-3 h-3" />
            AI ONLINE
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Link to="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 whitespace-nowrap transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
        <Link to="/admin/cjdropshipping" className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 whitespace-nowrap transition-colors">
          <Activity className="w-4 h-4" /> Import from CJ
        </Link>
        <Link to="/admin/orders" className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 whitespace-nowrap transition-colors">
          <ShoppingCart className="w-4 h-4" /> View Orders
        </Link>
        <Link to="/admin/ai" className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 whitespace-nowrap transition-colors">
          <Bot className="w-4 h-4" /> Open AI
        </Link>
        <Link to="/admin/finance" className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 whitespace-nowrap transition-colors">
          <DollarSign className="w-4 h-4" /> View Finance
        </Link>
      </div>

      {/* BUSINESS METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Gross Revenue</h3>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Total Orders</h3>
            <ShoppingCart className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Products</h3>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Customers</h3>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{stats.totalCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MY WORK QUEUE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" /> My Work
              </h3>
            </div>
            <div className="divide-y divide-zinc-100">
               <div className="p-4 flex items-start gap-3 hover:bg-zinc-50 transition-colors">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                     <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-zinc-900">2 orders require attention</h4>
                        <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded uppercase">Medium</span>
                     </div>
                     <p className="text-sm text-zinc-500 mt-1">Order #1008 and #1009 have fulfillment delays.</p>
                     <div className="mt-3">
                        <Link to="/admin/orders" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View Orders &rarr;</Link>
                     </div>
                  </div>
               </div>
               
               <div className="p-4 flex items-start gap-3 hover:bg-zinc-50 transition-colors">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0 mt-0.5">
                     <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-zinc-900">AI has 2 recommendations awaiting approval</h4>
                        <span className="text-xs font-bold px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded uppercase">Low</span>
                     </div>
                     <p className="text-sm text-zinc-500 mt-1">Pricing Worker recommends adjusting prices for 2 products based on supplier cost changes.</p>
                     <div className="mt-3">
                        <Link to="/admin/ai/approvals" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Review Recommendations &rarr;</Link>
                     </div>
                  </div>
               </div>
               
               <div className="p-4 flex items-start gap-3 hover:bg-zinc-50 transition-colors">
                  <div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0 mt-0.5">
                     <Shield className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-zinc-900">No backup configured</h4>
                        <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded uppercase">High</span>
                     </div>
                     <p className="text-sm text-zinc-500 mt-1">Database backups are currently not configured. Data loss is possible.</p>
                     <div className="mt-3">
                        <Link to="/admin/security/backups" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Configure Backups &rarr;</Link>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
          {/* RECENT ORDERS */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-zinc-900">Recent Orders</h3>
              <Link to="/admin/orders" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-zinc-200 text-zinc-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Order</th>
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Total</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-indigo-600">
                        <Link to={`/admin/orders/${order.id}`}>#{order.id.slice(0, 8)}</Link>
                      </td>
                      <td className="px-6 py-4">{order.customerEmail || 'Guest'}</td>
                      <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-zinc-100 text-zinc-800'}
                        `}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && !loading && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No orders found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI BRIEF & ACTIVITY */}
        <div className="space-y-6">
          <div className="bg-indigo-900 rounded-xl border border-indigo-800 p-6 text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Bot className="w-24 h-24" />
            </div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
              <Zap className="w-5 h-5 text-indigo-400" /> Today's AI Business Brief
            </h3>
            <div className="space-y-4 relative z-10 text-indigo-100 text-sm">
               <p><strong className="text-white">What Happened:</strong> 3 new orders were processed successfully. Fulfillment sync is operating normally.</p>
               <p><strong className="text-white">What Needs Attention:</strong> 2 orders are awaiting tracking updates. Backup system is not configured.</p>
               <p><strong className="text-white">AI Recommendations:</strong> Review 2 pending price adjustments based on updated supplier costs.</p>
            </div>
            <Link to="/admin/ai" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-indigo-200 transition-colors relative z-10">
               Open AI Command Center <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center justify-between">
              Live AI Activity
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                 <div className="mt-0.5 text-zinc-400"><Clock className="w-4 h-4" /></div>
                 <div>
                    <p className="text-zinc-900 font-medium">Financial Analyst completed analysis.</p>
                    <p className="text-zinc-500 text-xs">2 minutes ago</p>
                 </div>
              </div>
              <div className="flex gap-3 text-sm">
                 <div className="mt-0.5 text-zinc-400"><Clock className="w-4 h-4" /></div>
                 <div>
                    <p className="text-zinc-900 font-medium">Order Worker detected a new paid order.</p>
                    <p className="text-zinc-500 text-xs">15 minutes ago</p>
                 </div>
              </div>
              <div className="flex gap-3 text-sm">
                 <div className="mt-0.5 text-zinc-400"><Clock className="w-4 h-4" /></div>
                 <div>
                    <p className="text-zinc-900 font-medium">Pricing Worker generated a recommendation.</p>
                    <p className="text-zinc-500 text-xs">1 hour ago</p>
                 </div>
              </div>
              <div className="flex gap-3 text-sm">
                 <div className="mt-0.5 text-zinc-400"><Clock className="w-4 h-4" /></div>
                 <div>
                    <p className="text-zinc-900 font-medium">Product Worker created a draft product.</p>
                    <p className="text-zinc-500 text-xs">3 hours ago</p>
                 </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100">
               <Link to="/admin/ai/tasks" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View all AI tasks</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

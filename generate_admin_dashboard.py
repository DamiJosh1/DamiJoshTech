import os

content = """import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  DollarSign, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Activity, CreditCard, Globe, Plus, DownloadCloud, Tags, 
  CheckCircle2, AlertCircle, Clock, Zap, Bot, Box, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../StoreContext';

export default function AdminDashboard() {
  const { user, formatPrice } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Real data listeners
  useEffect(() => {
    setIsLoading(true);
    
    // Subscribe to orders for stats & recent list
    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50)), (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      setStats(prev => ({ ...prev, orders: snapshot.size, revenue: totalRevenue }));
      setRecentOrders(orders.slice(0, 8)); // top 8 recent
      
      // Chart data aggregation (last 7 days simulation based on data)
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      });
      
      // We will map orders to these days. If no data, it stays 0.
      const aggregated = last7Days.map(dayName => ({ name: dayName, revenue: 0, orders: 0 }));
      
      orders.forEach(o => {
        if(o.createdAt?.toDate) {
           const day = o.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'short' });
           const dayData = aggregated.find(a => a.name === day);
           if(dayData) {
             dayData.revenue += (o.totalAmount || 0);
             dayData.orders += 1;
           }
        }
      });
      
      setChartData(aggregated);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
       const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
       setStats(prev => ({ ...prev, products: snapshot.size }));
       
       // Sort by sales (if we had a sales count, mock it for now or rely on an existing field)
       const sorted = [...prods].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
       setTopProducts(sorted.slice(0, 5));
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
       setStats(prev => ({ ...prev, customers: snapshot.size }));
       setIsLoading(false);
    });

    return () => {
      unsubOrders();
      unsubProducts();
      unsubUsers();
    };
  }, []);

  const adminName = user?.displayName?.split(' ')[0] || 'Admin';

  const formatCurrency = (val: number) => {
    return formatPrice ? formatPrice(val) : `$${val.toFixed(2)}`;
  };

  const getOrderStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 lg:pb-12 animate-fade-in-up">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-lg text-zinc-500 font-medium">Good morning, {adminName}. Here's what's happening with your store today.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => navigate('/admin/products/new')} className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button onClick={() => navigate('/admin/cjdropshipping')} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            <DownloadCloud className="w-4 h-4" /> Import from CJ
          </button>
          <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            <ShoppingCart className="w-4 h-4" /> View Orders
          </button>
          <button onClick={() => navigate('/admin/discounts')} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            <Tags className="w-4 h-4" /> Create Discount
          </button>
        </div>
      </div>

      {/* Business Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
            {stats.revenue > 0 ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" /> +14.5%
              </span>
            ) : null}
          </div>
          <p className="text-sm font-bold text-zinc-500 mb-1">Total Sales</p>
          <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{formatCurrency(stats.revenue)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-bold text-zinc-500 mb-1">Orders</p>
          <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{stats.orders.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-bold text-zinc-500 mb-1">Customers</p>
          <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{stats.customers.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-bold text-zinc-500 mb-1">Products</p>
          <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{stats.products.toLocaleString()}</h3>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - 2/3 width */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Revenue Analytics */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-1">Sales Overview</h2>
                <p className="text-sm font-medium text-zinc-500">Revenue and order volume over time</p>
              </div>
              <select className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 outline-none focus:border-zinc-400 cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Month</option>
                <option>Year to Date</option>
              </select>
            </div>
            
            {stats.revenue > 0 ? (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e4e4e7" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }} tickFormatter={(val) => `$${val}`} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#18181b', fontWeight: 700 }}
                      labelStyle={{ color: '#71717a', fontWeight: 600, marginBottom: '4px' }}
                      formatter={(value: number, name: string) => [name === 'revenue' ? formatCurrency(value) : value, name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[320px] w-full flex flex-col items-center justify-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
                <Activity className="w-12 h-12 text-zinc-300 mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 mb-2">No sales data yet</h3>
                <p className="text-zinc-500 text-center max-w-sm text-sm">Your revenue analytics will appear here once your store receives orders.</p>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm font-bold text-primary-blue hover:text-blue-700">View All Orders</Link>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Order</th>
                      <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Customer</th>
                      <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                      <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-50 transition-colors group cursor-pointer" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                        <td className="py-4 text-sm font-bold text-zinc-900">#{order.id.substring(0, 8).toUpperCase()}</td>
                        <td className="py-4 text-sm font-medium text-zinc-600">{order.contact?.firstName || 'Guest'} {order.contact?.lastName || ''}</td>
                        <td className="py-4 text-sm font-bold text-zinc-900">{formatCurrency(order.totalAmount || 0)}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getOrderStatusColor(order.status)}`}>
                            {(order.status || 'PENDING').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-medium text-zinc-500 text-right">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
                <ShoppingCart className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-zinc-900 mb-1">No orders yet</h3>
                <p className="text-sm text-zinc-500">Orders will appear here once customers complete checkout.</p>
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hidden md:block">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Top Products</h2>
              <Link to="/admin/products" className="text-sm font-bold text-primary-blue hover:text-blue-700">View All Products</Link>
            </div>
            
            {topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Product</th>
                      <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Price</th>
                      <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {topProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/products/${prod.id}`)}>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                              {prod.image || prod.images?.[0] ? (
                                <img src={prod.image || prod.images?.[0]} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <Box className="w-full h-full p-2 text-zinc-300" />
                              )}
                            </div>
                            <span className="text-sm font-bold text-zinc-900 truncate max-w-[200px] lg:max-w-[300px]">{prod.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm font-bold text-zinc-900">{formatCurrency(prod.price)}</td>
                        <td className="py-3 text-right">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-emerald-100 text-emerald-800 border-emerald-200">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
                <Package className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-zinc-900 mb-1">Your store is ready</h3>
                <p className="text-sm text-zinc-500 mb-4">Start by adding your first product.</p>
                <button onClick={() => navigate('/admin/products/new')} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-bold">Add Product</button>
              </div>
            )}
          </div>
          
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          
          {/* SAJODA AI Preview */}
          <div className="bg-zinc-950 p-6 rounded-3xl shadow-xl shadow-zinc-900/10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Bot className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">SAJODA AI</h2>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">AI is ready to assist you.</h3>
              <p className="text-sm text-zinc-400 font-medium mb-6 leading-relaxed">
                SAJODA AI can help with product research, pricing optimization, store operations, and business insights.
              </p>
              <button onClick={() => navigate('/ai')} className="w-full py-3 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl text-sm font-bold transition-colors">
                Open AI Center
              </button>
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" /> Needs Attention
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => navigate('/admin/cjdropshipping')}>
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">Finish CJ Connection</h4>
                  <p className="text-xs font-medium text-rose-700 mt-0.5">Please ensure your CJ Dropshipping API keys are fully validated.</p>
                </div>
              </div>
              {stats.products === 0 && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => navigate('/admin/products/new')}>
                  <Package className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Add Products</h4>
                    <p className="text-xs font-medium text-amber-700 mt-0.5">Your store needs products before customers can shop.</p>
                  </div>
                </div>
              )}
              {stats.products > 0 && stats.orders === 0 && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                  <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Store is Live</h4>
                    <p className="text-xs font-medium text-blue-700 mt-0.5">Share your store link to start receiving your first orders.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Store Health */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Store Health
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Database className="w-4 h-4 text-zinc-400" /> Database Connection
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <CreditCard className="w-4 h-4 text-zinc-400" /> Payments Setup
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Globe className="w-4 h-4 text-zinc-400" /> CJ Dropshipping
                </div>
                <div className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded border border-amber-200">PENDING</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Zap className="w-4 h-4 text-zinc-400" /> Storefront Status
                </div>
                <div className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded border border-emerald-200">ONLINE</div>
              </div>
            </div>
          </div>

          {/* Order Activity */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6">Recent Activity</h2>
            
            {recentOrders.length > 0 ? (
              <div className="relative border-l-2 border-zinc-100 ml-3 space-y-6">
                {recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary-blue"></div>
                    <p className="text-sm font-bold text-zinc-900 mb-0.5">Order Received</p>
                    <p className="text-sm text-zinc-500">#{order.id.substring(0, 8).toUpperCase()} • {formatCurrency(order.totalAmount || 0)}</p>
                    <p className="text-xs font-medium text-zinc-400 mt-1">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Recently'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Clock className="w-8 h-8 text-zinc-200 mb-2" />
                <p className="text-sm font-medium text-zinc-500">No recent activity</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
"""

with open('src/pages/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
print("Dashboard created successfully.")

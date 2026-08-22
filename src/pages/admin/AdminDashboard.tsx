import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  DollarSign, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Activity, CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Orders
        const ordersSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        let revenue = 0;
        orders.forEach((o: any) => {
          revenue += o.totalAmount || 0;
        });

        // Fetch Products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        
        // Fetch Users
        const usersSnapshot = await getDocs(collection(db, 'users'));

        // Generate Chart Data (Mocking dates based on real data would require complex grouping, 
        // doing a simple grouping by the last few orders for demo or generating a timeline if they have timestamps)
        
        // Simple grouped data for the chart based on actual orders
        const recentOrdersForChart = orders.slice(0, 30).reverse();
        const generatedChartData = recentOrdersForChart.map((o: any, index) => {
          const date = o.createdAt?.toDate ? o.createdAt.toDate() : new Date();
          return {
            name: `${date.getDate()}/${date.getMonth() + 1}`,
            revenue: o.totalAmount || 0,
            orders: 1
          };
        });

        // Aggregate by name
        const aggregatedChart = generatedChartData.reduce((acc: any[], curr: any) => {
          const existing = acc.find(item => item.name === curr.name);
          if (existing) {
            existing.revenue += curr.revenue;
            existing.orders += curr.orders;
          } else {
            acc.push({ ...curr });
          }
          return acc;
        }, []);
        
        // Fallback chart data if empty
        const finalChartData = aggregatedChart.length > 0 ? aggregatedChart : [
          { name: 'Mon', revenue: 0, orders: 0 },
          { name: 'Tue', revenue: 0, orders: 0 },
          { name: 'Wed', revenue: 0, orders: 0 },
          { name: 'Thu', revenue: 0, orders: 0 },
          { name: 'Fri', revenue: 0, orders: 0 },
          { name: 'Sat', revenue: 0, orders: 0 },
          { name: 'Sun', revenue: 0, orders: 0 },
        ];

        setChartData(finalChartData);

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalCustomers: usersSnapshot.size,
          totalProducts: productsSnapshot.size,
          recentOrders: orders.slice(0, 5)
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-500/10",
      trend: "+12.5%",
      isPositive: true
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingCart className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-500/10",
      trend: "+8.2%",
      isPositive: true
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-500/10",
      trend: "+24.1%",
      isPositive: true
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: <Package className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-500/10",
      trend: "0.0%",
      isPositive: true
    }
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">Monitor your store's performance and key metrics.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-zinc-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Revenue Overview</h2>
              <p className="text-sm text-zinc-500">Sales performance over time</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#18181b', fontWeight: 500 }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
              <div key={order.id} className="flex flex-col gap-2 pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900 truncate pr-4">{order.id.substring(0, 8).toUpperCase()}</span>
                  <span className="text-sm font-bold text-zinc-900 whitespace-nowrap">
                    ${(order.totalAmount || order.total || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 truncate max-w-[120px]">{order.customerEmail || order.contact?.email || 'Guest'}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Package className="w-10 h-10 text-zinc-300 mb-3" />
                <p className="text-sm font-medium text-zinc-900">No orders yet</p>
                <p className="text-xs text-zinc-500 mt-1">When customers place orders, they will appear here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

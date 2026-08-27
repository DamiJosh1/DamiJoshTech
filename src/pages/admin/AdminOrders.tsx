import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Package, Search, Filter, Eye, ChevronRight, Download, RefreshCw, 
  ShoppingCart, Clock, CheckCircle2, Truck, XCircle, AlertCircle, Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../StoreContext';

export default function AdminOrders() {
  const { user, formatPrice } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    failed: 0
  });

  const [activeTab, setActiveTab] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  const fetchOrders = () => {
    setIsLoading(true);
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setOrders(ordersData);
      
      const newStats = {
        total: ordersData.length,
        pending: ordersData.filter(o => o.status === 'pending').length,
        processing: ordersData.filter(o => o.status === 'processing').length,
        shipped: ordersData.filter(o => o.status === 'shipped').length,
        delivered: ordersData.filter(o => o.status === 'delivered').length,
        failed: ordersData.filter(o => o.status === 'failed' || o.status === 'cancelled').length
      };
      setStats(newStats);
      setIsLoading(false);
      setIsRefreshing(false);
    });
  };

  useEffect(() => {
    const unsub = fetchOrders();
    return () => unsub();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders(); // This just re-triggers listener initialization, but gives UX feedback
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.contact?.email || order.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.contact?.firstName || order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Pending') return matchesSearch && order.status === 'pending';
    if (activeTab === 'Processing') return matchesSearch && order.status === 'processing';
    if (activeTab === 'Shipped') return matchesSearch && order.status === 'shipped';
    if (activeTab === 'Delivered') return matchesSearch && order.status === 'delivered';
    if (activeTab === 'Attention') return matchesSearch && (order.status === 'failed' || order.status === 'cancelled');
    
    return matchesSearch;
  });

  const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  const getPaymentStyle = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failed': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'refunded': return 'bg-zinc-100 text-zinc-800 border-zinc-200';
      default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  const handleExport = () => {
    // Generate CSV
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Total', 'Payment Status', 'Order Status'];
    const csvContent = [
      headers.join(','),
      ...orders.map(o => [
        o.id,
        o.createdAt?.toDate ? o.createdAt.toDate().toISOString() : '',
        `"${o.contact?.firstName || ''} ${o.contact?.lastName || ''}"`,
        o.contact?.email || '',
        o.totalAmount || 0,
        o.paymentStatus || 'pending',
        o.status || 'pending'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sajoda_orders_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full pb-24 lg:pb-12 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-2">Orders</h1>
          <p className="text-lg text-zinc-500 font-medium">Manage customer orders, payments and fulfillment.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'TOTAL ORDERS', value: stats.total, icon: <Package className="w-4 h-4" />, color: 'text-zinc-900', bg: 'bg-zinc-100' },
          { label: 'PENDING PAYMENT', value: stats.pending, icon: <Clock className="w-4 h-4" />, color: 'text-amber-700', bg: 'bg-amber-100' },
          { label: 'PROCESSING', value: stats.processing, icon: <RefreshCw className="w-4 h-4" />, color: 'text-indigo-700', bg: 'bg-indigo-100' },
          { label: 'SHIPPED', value: stats.shipped, icon: <Truck className="w-4 h-4" />, color: 'text-blue-700', bg: 'bg-blue-100' },
          { label: 'DELIVERED', value: stats.delivered, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-700', bg: 'bg-emerald-100' },
          { label: 'FAILED / ATTENTION', value: stats.failed, icon: <AlertCircle className="w-4 h-4" />, color: 'text-rose-700', bg: 'bg-rose-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-0.5">{stat.value.toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm mb-6 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50/50">
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto snap-x hide-scrollbar">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Attention'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all snap-start ${
                  activeTab === tab 
                    ? 'bg-zinc-900 text-white shadow-sm' 
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:border-zinc-400 outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-16 bg-zinc-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : paginatedOrders.length > 0 ? (
            <>
              {/* Desktop Table */}
              <table className="w-full text-left border-collapse whitespace-nowrap hidden md:table">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Fulfillment</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50 transition-colors group cursor-pointer" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-zinc-900">#{order.id.substring(0, 8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-900">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                          <span className="text-xs text-zinc-500">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-[200px]">
                          <span className="text-sm font-bold text-zinc-900 truncate">{order.contact?.firstName || 'Guest'} {order.contact?.lastName || ''}</span>
                          <span className="text-xs text-zinc-500 truncate">{order.contact?.email || order.customerEmail || 'No email'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${getPaymentStyle(order.paymentStatus)}`}>
                          {order.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${getStatusStyle(order.status)}`}>
                          {order.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-zinc-900">{formatPrice ? formatPrice(order.totalAmount || 0) : `$${(order.totalAmount || 0).toFixed(2)}`}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-zinc-100">
                {paginatedOrders.map((order) => (
                  <div key={order.id} onClick={() => navigate(`/admin/orders/${order.id}`)} className="p-4 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-zinc-900">#{order.id.substring(0, 8).toUpperCase()}</span>
                      <span className="text-sm font-bold text-zinc-900">{formatPrice ? formatPrice(order.totalAmount || 0) : `$${(order.totalAmount || 0).toFixed(2)}`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-700">{order.contact?.firstName || 'Guest'} {order.contact?.lastName || ''}</span>
                        <span className="text-xs text-zinc-500">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getPaymentStyle(order.paymentStatus)}`}>
                          {order.paymentStatus || 'PENDING'}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusStyle(order.status)}`}>
                          {order.status || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-50/50">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-200 flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 mb-2 uppercase tracking-tight">No Orders Found</h3>
              <p className="text-zinc-500 max-w-sm mb-6 text-sm">
                {searchQuery || activeTab !== 'All' 
                  ? "Try adjusting your filters or search query to find what you're looking for."
                  : "Orders will appear here when customers complete checkout."}
              </p>
              {(searchQuery || activeTab !== 'All') ? (
                <button 
                  onClick={() => { setSearchQuery(''); setActiveTab('All'); setPage(1); }}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-sm"
                >
                  Clear Filters
                </button>
              ) : (
                <Link to="/shop" className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-sm">
                  View Store
                </Link>
              )}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <span className="text-sm font-medium text-zinc-500">
              Showing <span className="font-bold text-zinc-900">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-zinc-900">{Math.min(page * itemsPerPage, filteredOrders.length)}</span> of <span className="font-bold text-zinc-900">{filteredOrders.length}</span> orders
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

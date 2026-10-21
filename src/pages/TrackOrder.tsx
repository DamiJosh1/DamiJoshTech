import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../StoreContext';
import { 
  Search, Package, Truck, CheckCircle2, ChevronRight, 
  AlertCircle, Copy, Check, Calendar, Clock, MapPin, 
  ShieldCheck, RefreshCw, ArrowRight, ExternalLink 
} from 'lucide-react';

export default function TrackOrder() {
  const { formatPrice, user } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch recent orders if user is signed in
  useEffect(() => {
    if (!user) return;
    const fetchUserOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setRecentOrders(list);
      } catch (err) {
        console.warn('Could not load user recent orders:', err);
      }
    };
    fetchUserOrders();
  }, [user]);

  // If query parameter was passed in URL, auto search
  useEffect(() => {
    const qOrder = searchParams.get('order');
    if (qOrder) {
      lookupOrder(qOrder);
    }
  }, [searchParams]);

  const lookupOrder = async (targetOrderNum: string, targetEmail?: string) => {
    const cleanedNumber = targetOrderNum.trim();
    if (!cleanedNumber) return;

    setIsSearching(true);
    setError('');

    try {
      // Find order by exact match or normalized uppercase
      const q = query(collection(db, 'orders'), where('orderNumber', '==', cleanedNumber.toUpperCase()));
      let querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Try fallback with raw string
        const q2 = query(collection(db, 'orders'), where('orderNumber', '==', cleanedNumber));
        querySnapshot = await getDocs(q2);
      }

      if (querySnapshot.empty) {
        setError(`No order found matching "${cleanedNumber}". Please verify your order number.`);
        setOrder(null);
      } else {
        const foundOrder = querySnapshot.docs[0].data();
        const orderEmail = (
          foundOrder.contact?.email || 
          foundOrder.customerEmail || 
          foundOrder.shippingAddress?.email || 
          ''
        ).toLowerCase().trim();

        const inputEmail = (targetEmail || email || '').toLowerCase().trim();

        // If email was provided and does not match, notify user
        if (inputEmail && orderEmail && orderEmail !== inputEmail) {
          setError('The provided email does not match the order records. Please verify your email.');
          setOrder(null);
        } else {
          setOrder({ id: querySnapshot.docs[0].id, ...foundOrder });
        }
      }
    } catch (err: any) {
      console.error('Error tracking order:', err);
      setError('An error occurred while tracking your order. Please try again in a few moments.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;
    lookupOrder(orderNumber, email);
  };

  const copyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusIndex = (status?: string, fulfillmentStatus?: string) => {
    const current = (fulfillmentStatus || status || 'Processing').toLowerCase();
    if (current.includes('deliver')) return 5;
    if (current.includes('out for delivery')) return 4;
    if (current.includes('transit') || current.includes('ship')) return 3;
    if (current.includes('processing') || current.includes('submitted')) return 2;
    if (current.includes('confirm') || current.includes('paid')) return 1;
    return 0; // Placed
  };

  // Helper to calculate estimated delivery
  const getEstimatedDelivery = (orderData: any) => {
    if (!orderData) return null;
    const createdAtSeconds = orderData.createdAt?.seconds;
    const createdDate = createdAtSeconds ? new Date(createdAtSeconds * 1000) : new Date();
    
    // Add 3-5 business days
    const minDelivery = new Date(createdDate);
    minDelivery.setDate(createdDate.getDate() + 3);
    const maxDelivery = new Date(createdDate);
    maxDelivery.setDate(createdDate.getDate() + 5);

    const minStr = minDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const maxStr = maxDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Days remaining
    const diffTime = maxDelivery.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      range: `${minStr} – ${maxStr}`,
      daysRemaining: diffDays > 0 ? diffDays : 0,
      isDelivered: (orderData.status || '').toLowerCase().includes('deliver')
    };
  };

  const statusIdx = getStatusIndex(order?.status, order?.fulfillmentStatus);
  const estimated = getEstimatedDelivery(order);

  const trackingSteps = [
    { title: 'Order Placed', desc: 'Received & logged in system', step: 0 },
    { title: 'Payment Confirmed', desc: 'Secure payment verified', step: 1 },
    { title: 'Processing', desc: 'Packed at distribution hub', step: 2 },
    { title: 'In Transit', desc: 'Handed to courier dispatch', step: 3 },
    { title: 'Out for Delivery', desc: 'Courier on final route', step: 4 },
    { title: 'Delivered', desc: 'Successfully handed over', step: 5 }
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-50/70 pt-10 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Page Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-primary-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" /> Live Parcel Tracking
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-3">
            Track Your Shipment
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg mx-auto text-sm md:text-base">
            Know exactly when you will receive your goods with real-time status updates and delivery estimates.
          </p>
        </div>

        {/* Search Card */}
        {!order && (
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-900/5 border border-zinc-100">
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-3 text-sm font-semibold">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSearch} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Order Number <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required 
                    value={orderNumber} 
                    onChange={e => setOrderNumber(e.target.value)} 
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none uppercase font-mono font-bold text-zinc-900 transition-all text-sm" 
                    placeholder="e.g. SAJ-20261021-ABCD" 
                  />
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    Found in your order confirmation email or SMS.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <input 
                    type="email"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none text-zinc-900 transition-all text-sm" 
                    placeholder="your@email.com" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSearching}
                  className="mt-2 w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-zinc-900/10 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Tracking Parcel...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Track Goods
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Access to Recent Orders for Logged-In User */}
            {user && recentOrders.length > 0 && (
              <div className="mt-8 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Your Recent Orders
                </h3>
                <div className="space-y-2">
                  {recentOrders.map(ro => (
                    <div 
                      key={ro.id} 
                      onClick={() => {
                        setOrderNumber(ro.orderNumber);
                        lookupOrder(ro.orderNumber, user.email || '');
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer transition-all"
                    >
                      <div>
                        <span className="font-mono font-bold text-xs text-zinc-900 block">{ro.orderNumber}</span>
                        <span className="text-[11px] text-zinc-500 font-medium">{ro.items?.length || 1} item(s) • {ro.status || 'Processing'}</span>
                      </div>
                      <span className="text-xs font-bold text-primary-blue flex items-center gap-1">
                        Track <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Result View */}
        {order && (
          <div className="bg-white rounded-3xl shadow-xl shadow-zinc-900/5 overflow-hidden border border-zinc-100 animate-slide-up">
            
            {/* Top Banner */}
            <div className="bg-zinc-900 text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Shipment Status</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {order.status || 'In Transit'}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black font-mono tracking-tight text-white">
                  {order.orderNumber}
                </h2>
              </div>

              {/* Estimated Delivery Card */}
              {estimated && (
                <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-blue/30 text-blue-300 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 block">
                      {estimated.isDelivered ? 'Delivery Completed' : 'Estimated Delivery Window'}
                    </span>
                    <span className="text-base font-black text-white block">
                      {estimated.range}
                    </span>
                    {!estimated.isDelivered && estimated.daysRemaining > 0 && (
                      <span className="text-xs text-emerald-400 font-semibold block">
                        Arriving in approximately {estimated.daysRemaining} days
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-12">
              
              {/* Left Timeline Section */}
              <div className="w-full lg:w-2/3">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-extrabold text-zinc-900">Delivery Journey</h3>
                    <p className="text-xs text-zinc-500 font-medium">Step-by-step progress from warehouse dispatch to your doorstep.</p>
                  </div>
                  <button 
                    onClick={() => lookupOrder(order.orderNumber, email)}
                    className="p-2 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                    title="Refresh status"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Timeline */}
                <div className="relative pl-6 md:pl-0 space-y-6 md:space-y-0">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
                    {trackingSteps.map((stepItem, idx) => {
                      const isCompleted = statusIdx >= stepItem.step;
                      const isCurrent = statusIdx === stepItem.step;

                      return (
                        <div key={idx} className="flex md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-2 relative">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-4 border-white transition-all shadow-md shrink-0 ${
                            isCompleted 
                              ? 'bg-zinc-900 text-white' 
                              : 'bg-zinc-100 text-zinc-400'
                          } ${isCurrent ? 'ring-4 ring-blue-500/30 scale-105' : ''}`}>
                            {isCompleted ? (
                              <Check className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <span className="text-xs font-bold">{idx + 1}</span>
                            )}
                          </div>
                          <div>
                            <span className={`block text-xs font-bold ${isCompleted ? 'text-zinc-900' : 'text-zinc-400'}`}>
                              {stepItem.title}
                            </span>
                            <span className="block text-[11px] text-zinc-500">
                              {stepItem.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Carrier & Tracking Info Box */}
                <div className="mt-10 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-zinc-900 flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-primary-blue" /> Dispatch & Carrier Information
                    </h4>
                    <span className="text-xs text-zinc-500 font-medium">
                      Carrier: <strong className="text-zinc-900">{order.carrier || 'Express Direct Courier'}</strong>
                    </span>
                  </div>

                  {order.trackingNumber ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200">
                      <div>
                        <span className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-0.5">
                          Waybill / Tracking Code
                        </span>
                        <span className="block text-lg font-black font-mono text-zinc-900">
                          {order.trackingNumber}
                        </span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={copyTracking} 
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 text-zinc-800"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Copied' : 'Copy Code'}
                        </button>
                        <a 
                          href={order.carrierUrl || `https://t.17track.net/en#nums=${order.trackingNumber}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          Track on Courier <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-xl border border-zinc-200/80 flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-800 mb-0.5">Tracking code generating</p>
                        <p className="text-xs text-zinc-500">
                          Your package has been booked with our courier service. The live tracking code usually generates within 12-24 hours after warehouse dispatch.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Delivery Guarantee Badge */}
                  <div className="mt-4 pt-4 border-t border-zinc-200/60 flex items-center gap-2 text-xs text-zinc-600 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected by Sajoda SafeDelivery Guarantee. Free replacement if package is lost or damaged in transit.</span>
                  </div>
                </div>

              </div>

              {/* Right Order Summary & Address Sidebar */}
              <div className="w-full lg:w-1/3 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-zinc-100 pt-8 lg:pt-0 lg:pl-8">
                
                {/* Destination */}
                <div>
                  <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary-blue" /> Delivery Address
                  </h3>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70 text-xs text-zinc-600 leading-relaxed font-medium">
                    <span className="font-bold text-zinc-900 block mb-1 text-sm">
                      {order.customerName || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Valued Customer'}
                    </span>
                    {order.shippingAddress?.address || order.shippingAddress?.street || 'Customer Delivery Address'}<br />
                    {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                    {order.shippingAddress?.state && `${order.shippingAddress.state} `}
                    {order.shippingAddress?.zip || order.shippingAddress?.postalCode || ''}<br />
                    {order.shippingAddress?.country || 'Nigeria'}
                    {order.customerPhone && (
                      <span className="block mt-2 font-mono text-zinc-500">Tel: {order.customerPhone}</span>
                    )}
                  </div>
                </div>

                {/* Items in this parcel */}
                <div>
                  <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-primary-blue" /> Items In This Shipment
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {(order.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
                        <div className="pr-2">
                          <span className="font-bold text-zinc-900 block line-clamp-1">{item.name}</span>
                          <span className="text-zinc-500 font-medium">Qty: {item.quantity}</span>
                        </div>
                        <span className="font-bold text-zinc-900 font-mono shrink-0">
                          {formatPrice((item.price || item.unitPrice || 0) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-zinc-900">{formatPrice(order.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-600">
                    <span>Delivery Fee</span>
                    <span className="font-mono font-bold text-zinc-900">
                      {(order.shippingCost || 0) === 0 ? 'Free' : formatPrice(order.shippingCost || 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200/80 flex justify-between items-center text-sm font-black text-zinc-900">
                    <span>Total Paid</span>
                    <span className="font-mono text-base text-primary-blue">
                      {formatPrice(order.totalAmount || order.total || order.subtotal || 0)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setOrder(null)} 
                  className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Track Another Order
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

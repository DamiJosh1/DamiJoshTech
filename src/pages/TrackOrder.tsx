import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Package, Truck, CheckCircle2, ChevronRight, AlertCircle, Copy, Check } from 'lucide-react';

export default function TrackOrder() {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const q = query(collection(db, 'orders'), where('orderNumber', '==', orderNumber));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('No order found with that order number.');
        setOrder(null);
      } else {
        const foundOrder = querySnapshot.docs[0].data();
        if (foundOrder.contact?.email?.toLowerCase() !== email.toLowerCase()) {
          setError('Email does not match the order records.');
          setOrder(null);
        } else {
          setOrder(foundOrder);
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while tracking your order. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const copyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['Pending Payment', 'Processing', 'Submitted to CJ', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];
    const idx = statuses.indexOf(status);
    return idx === -1 ? 1 : idx; // Default to Processing if unknown
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 pt-8 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">Track Your Order</h1>
          <p className="text-zinc-500 font-medium">Enter your order number and email to see the latest updates.</p>
        </div>

        {!order ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-zinc-900/5">
            {error && (
              <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSearch} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Order Number</label>
                <input 
                  required 
                  value={orderNumber} 
                  onChange={e => setOrderNumber(e.target.value)} 
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none uppercase" 
                  placeholder="SAJ-12345678" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email Address</label>
                <input 
                  required 
                  type="email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" 
                  placeholder="your@email.com" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSearching}
                className={`mt-2 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isSearching ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/20 active:scale-[0.98]'
                }`}
              >
                <Search className="w-5 h-5" />
                {isSearching ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-zinc-900/5 overflow-hidden animate-slide-up">
            <div className="bg-zinc-900 text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="block text-sm font-semibold text-zinc-400 mb-1">Order Number</span>
                <span className="block text-2xl font-black">{order.orderNumber}</span>
              </div>
              <div className="text-left md:text-right">
                <span className="block text-sm font-semibold text-zinc-400 mb-1">Order Date</span>
                <span className="block font-medium">
                  {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-12">
              {/* Timeline */}
              <div className="w-full lg:w-2/3">
                <h3 className="text-xl font-extrabold text-zinc-900 mb-8">Delivery Status</h3>
                
                <div className="relative pl-8 md:pl-0">
                  {/* Desktop Horizontal Progress Line */}
                  <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-1 bg-zinc-100 -z-10 rounded-full" />
                  <div 
                    className="hidden md:block absolute top-6 left-[10%] h-1 bg-zinc-900 -z-10 rounded-full transition-all duration-1000" 
                    style={{ width: `${(Math.min(getStatusIndex(order.fulfillmentStatus), 6) / 6) * 80}%` }}
                  />

                  {/* Mobile Vertical Progress Line */}
                  <div className="md:hidden absolute top-4 bottom-4 left-3 w-1 bg-zinc-100 -z-10 rounded-full" />
                  <div 
                    className="md:hidden absolute top-4 left-3 w-1 bg-zinc-900 -z-10 rounded-full transition-all duration-1000" 
                    style={{ height: `${(Math.min(getStatusIndex(order.fulfillmentStatus), 6) / 6) * 100}%` }}
                  />

                  <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                    {[
                      { icon: <Package />, label: 'Placed', step: 0 },
                      { icon: <CheckCircle2 />, label: 'Confirmed', step: 1 },
                      { icon: <Package />, label: 'Processing', step: 2 },
                      { icon: <Truck />, label: 'Shipped', step: 3 },
                      { icon: <CheckCircle2 />, label: 'Delivered', step: 6 }
                    ].map((s, idx) => {
                      const isActive = getStatusIndex(order.fulfillmentStatus) >= s.step;
                      const isCurrent = getStatusIndex(order.fulfillmentStatus) === s.step;
                      return (
                        <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 shrink-0 ${
                            isActive ? 'bg-zinc-900 text-white shadow-md' : 'bg-zinc-100 text-zinc-400'
                          } ${isCurrent ? 'ring-4 ring-zinc-900/20' : ''}`}>
                            {React.cloneElement(s.icon as React.ReactElement, { className: "w-5 h-5" })}
                          </div>
                          <div className="text-left md:text-center">
                            <span className={`block text-sm font-bold ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>{s.label}</span>
                            {isCurrent && <span className="text-xs font-semibold text-primary-blue mt-1">Current</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-12 bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
                  <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Shipping Information
                  </h4>
                  {order.trackingNumber ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="block text-xs font-bold tracking-widest text-zinc-500 uppercase mb-1">Tracking Number ({order.carrier || 'Standard'})</span>
                        <span className="block text-xl font-black text-zinc-900">{order.trackingNumber}</span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={copyTracking} className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-900 text-white rounded-xl font-semibold text-sm transition-colors hover:bg-zinc-800">
                          Track on Carrier
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-600 font-medium">Tracking information is currently being updated. It usually takes 24-48 hours after processing to generate a tracking number.</p>
                  )}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="w-full lg:w-1/3 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-zinc-200 pt-8 lg:pt-0 lg:pl-8">
                <div>
                  <h3 className="font-bold text-zinc-900 mb-4">Delivery Address</h3>
                  <div className="text-sm text-zinc-600 leading-relaxed">
                    <span className="font-bold text-zinc-900 block mb-1">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</span>
                    {order.shippingAddress?.address}<br />
                    {order.shippingAddress?.apartment && <>{order.shippingAddress?.apartment}<br/></>}
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
                    {order.shippingAddress?.country}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-zinc-900 mb-4">Order Items</h3>
                  <div className="flex flex-col gap-3">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-zinc-600"><span className="font-semibold text-zinc-900">{item.quantity}x</span> {item.name}</span>
                        <span className="font-semibold text-zinc-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-zinc-600">Subtotal</span>
                    <span className="text-sm font-semibold text-zinc-900">${order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-zinc-600">Shipping</span>
                    <span className="text-sm font-semibold text-zinc-900">{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-zinc-600">Tax</span>
                    <span className="text-sm font-semibold text-zinc-900">${order.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Total</span>
                    <span className="text-xl font-black text-zinc-900">${order.total?.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={() => setOrder(null)} className="mt-4 w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold transition-colors">
                  Track Another Order
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

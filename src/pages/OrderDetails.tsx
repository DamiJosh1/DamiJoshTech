import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../StoreContext';
import { ChevronRight, ArrowLeft, Package, Truck, CheckCircle2, Copy, Check, Clock } from 'lucide-react';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user , formatPrice} = useStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        if (!orderId) return;
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().customerId === user.uid) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/account/orders');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  if (loading) {
    return <div className="w-full min-h-[60vh] flex items-center justify-center bg-zinc-50"><div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" /></div>;
  }

  if (!order) return null;

  const copyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['Pending Payment', 'Processing', 'Submitted to CJ', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];
    const idx = statuses.indexOf(status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="animate-fade-in-up">
      <div>
        
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
          <button onClick={() => navigate('/login')} className="hover:text-zinc-900">Account</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/account/orders')} className="hover:text-zinc-900">Orders</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-900 font-medium truncate max-w-[150px]">{order.orderNumber}</span>
        </div>

        <button onClick={() => navigate('/account/orders')} className="md:hidden flex items-center gap-2 text-sm font-semibold text-zinc-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">Order Details</h1>
            <p className="text-zinc-500 font-medium">Placed on {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Order#</span>
            <span className="text-lg font-bold text-zinc-900">{order.orderNumber}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-zinc-900/5 overflow-hidden animate-slide-up mb-8">
          
          {/* Status Banner */}
          <div className="bg-zinc-900 text-white p-6 md:p-8 flex items-center gap-4">
            {order.fulfillmentStatus === 'Delivered' ? (
              <CheckCircle2 className="w-8 h-8 text-success" />
            ) : order.fulfillmentStatus === 'Shipped' ? (
              <Truck className="w-8 h-8 text-primary-blue" />
            ) : (
              <Clock className="w-8 h-8 text-amber-500" />
            )}
            <div>
              <h2 className="text-xl font-bold">{order.fulfillmentStatus || 'Processing'}</h2>
              <p className="text-sm text-zinc-400 mt-1">
                {order.fulfillmentStatus === 'Delivered' ? 'This order has been delivered.' : 'We are currently processing your order.'}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-12">
            
            {/* Left Col - Timeline & Items */}
            <div className="w-full lg:w-2/3 flex flex-col gap-12">
              
              {/* Timeline */}
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-6">Delivery Timeline</h3>
                
                <div className="relative pl-8 md:pl-0">
                  <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-1 bg-zinc-100 -z-10 rounded-full" />
                  <div 
                    className="hidden md:block absolute top-6 left-[10%] h-1 bg-zinc-900 -z-10 rounded-full transition-all duration-1000" 
                    style={{ width: `${(Math.min(getStatusIndex(order.fulfillmentStatus), 6) / 6) * 80}%` }}
                  />
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
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shrink-0 ${
                            isActive ? 'bg-zinc-900 text-white shadow-md' : 'bg-zinc-100 text-zinc-400'
                          } ${isCurrent ? 'ring-4 ring-zinc-900/20' : ''}`}>
                            {React.cloneElement(s.icon as React.ReactElement, { className: "w-5 h-5" })}
                          </div>
                          <div className="text-left md:text-center">
                            <span className={`block text-sm font-bold ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>{s.label}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="mt-8 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-6">Items Ordered</h3>
                <div className="flex flex-col gap-4">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                        <Package className="w-8 h-8 text-zinc-300" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-zinc-900">{item.name}</h4>
                        <span className="text-xs text-zinc-500 font-medium">Qty: {item.quantity}</span>
                      </div>
                      <span className="text-sm font-bold text-zinc-900">{formatPrice((item.price * item.quantity))}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col - Details */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8 border-t lg:border-t-0 lg:border-l border-zinc-200 pt-8 lg:pt-0 lg:pl-8">
              
              <div>
                <h3 className="font-bold text-zinc-900 mb-4">Delivery Address</h3>
                <div className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <span className="font-bold text-zinc-900 block mb-1">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</span>
                  {order.shippingAddress?.address}<br />
                  {order.shippingAddress?.apartment && <>{order.shippingAddress?.apartment}<br/></>}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
                  {order.shippingAddress?.country}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 mb-4">Contact</h3>
                <div className="text-sm text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <span className="block mb-1">{order.contact?.email}</span>
                  <span className="block">{order.contact?.phone}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 mb-4">Summary</h3>
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-zinc-600">Subtotal</span>
                    <span className="text-sm font-semibold text-zinc-900">{formatPrice(order.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-zinc-600">Shipping</span>
                    <span className="text-sm font-semibold text-zinc-900">{order.shippingCost === 0 ? 'Free' : `${formatPrice(order.shippingCost || 0)}`}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-100">
                    <span className="text-sm text-zinc-600">Tax</span>
                    <span className="text-sm font-semibold text-zinc-900">{formatPrice(order.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Total</span>
                    <span className="text-xl font-black text-zinc-900">{formatPrice(order.total || 0)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

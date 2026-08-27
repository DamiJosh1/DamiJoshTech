import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useStore } from '../../StoreContext';
import { 
  ArrowLeft, Package, CreditCard, Truck, User, 
  MapPin, Clock, ExternalLink, MessageSquare, AlertTriangle, 
  ChevronRight, RefreshCw, Box
} from 'lucide-react';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice, user } = useStore();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState('');
  
  useEffect(() => {
    if (!id) return;
    
    const unsub = onSnapshot(doc(db, 'orders', id), (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        setOrder(null);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-zinc-300 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h3 className="text-xl font-black text-zinc-900 mb-2 uppercase tracking-tight">Order Not Found</h3>
        <p className="text-zinc-500 max-w-sm mb-6 text-sm">
          That order may have been deleted, archived, or the link may be invalid.
        </p>
        <button onClick={() => navigate('/admin/orders')} className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-sm">
          Back to Orders
        </button>
      </div>
    );
  }

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

  const updateStatus = async (newStatus: string) => {
    if (!id || isUpdating) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'orders', id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        timeline: arrayUnion({
          event: `Status updated to ${newStatus.toUpperCase()}`,
          timestamp: new Date(),
          actor: auth.currentUser?.email || 'Admin'
        })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const addNote = async () => {
    if (!id || !note.trim() || isUpdating) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'orders', id), {
        internalNotes: arrayUnion({
          text: note.trim(),
          timestamp: new Date(),
          author: auth.currentUser?.email || 'Admin'
        })
      });
      setNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full pb-24 lg:pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Order #{order.id.substring(0,8).toUpperCase()}</h1>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${getStatusStyle(order.status)}`}>
                {order.status || 'PENDING'}
              </span>
              <span className="text-sm font-medium text-zinc-500">
                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : ''}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              disabled={isUpdating}
              value={order.status || 'pending'}
              onChange={(e) => updateStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 outline-none focus:border-zinc-400 cursor-pointer disabled:opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Items, Customer, Shipping */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-zinc-900" />
                <h2 className="text-lg font-black text-zinc-900 tracking-tight">ORDER ITEMS</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {(order.items || []).map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 border border-zinc-100 rounded-2xl bg-zinc-50/30">
                    {item.image ? (
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-zinc-300" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-center">
                      <Link to={`/admin/products/${item.productId}`} className="text-sm font-bold text-zinc-900 hover:text-primary-blue transition-colors w-fit">
                        {item.name}
                      </Link>
                      {item.variant && <span className="text-xs text-zinc-500 font-medium mt-0.5">{item.variant}</span>}
                      {item.sku && <span className="text-xs text-zinc-400 font-medium mt-0.5">SKU: {item.sku}</span>}
                    </div>
                    <div className="flex flex-col items-end justify-center text-right">
                      <span className="text-sm font-bold text-zinc-900">{formatPrice ? formatPrice(item.price) : `$${item.price?.toFixed(2)}`}</span>
                      <span className="text-xs text-zinc-500 font-medium">Qty: {item.quantity}</span>
                      <span className="text-sm font-black text-zinc-900 mt-1">{formatPrice ? formatPrice(item.price * item.quantity) : `$${(item.price * item.quantity).toFixed(2)}`}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-zinc-100 pt-6">
                <div className="flex flex-col gap-2 w-full max-w-sm ml-auto">
                  <div className="flex justify-between text-sm font-medium text-zinc-600">
                    <span>Subtotal</span>
                    <span>{formatPrice ? formatPrice(order.subtotal || order.totalAmount) : `$${(order.subtotal || order.totalAmount || 0).toFixed(2)}`}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm font-medium text-emerald-600">
                      <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                      <span>-{formatPrice ? formatPrice(order.discountAmount) : `$${order.discountAmount.toFixed(2)}`}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium text-zinc-600">
                    <span>Shipping</span>
                    <span>{formatPrice ? formatPrice(order.shippingCost || 0) : `$${(order.shippingCost || 0).toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-zinc-600 mb-2">
                    <span>Tax</span>
                    <span>{formatPrice ? formatPrice(order.tax || 0) : `$${(order.tax || 0).toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-zinc-900 border-t border-zinc-200 pt-3">
                    <span>Total</span>
                    <span>{formatPrice ? formatPrice(order.totalAmount || 0) : `$${(order.totalAmount || 0).toFixed(2)}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-zinc-900" />
                  <h2 className="text-lg font-black text-zinc-900 tracking-tight">CUSTOMER</h2>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Name</span>
                  <span className="text-sm font-bold text-zinc-900">{order.contact?.firstName || 'Guest'} {order.contact?.lastName || ''}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</span>
                  <span className="text-sm font-medium text-zinc-900">{order.contact?.email || order.customerEmail || 'No email'}</span>
                </div>
                {order.contact?.phone && (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Phone</span>
                    <span className="text-sm font-medium text-zinc-900">{order.contact.phone}</span>
                  </div>
                )}
                {order.customerId && (
                  <div className="mt-2">
                    <Link to={`/admin/customers/${order.customerId}`} className="text-xs font-bold text-primary-blue hover:underline">
                      View Customer Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-zinc-900" />
                  <h2 className="text-lg font-black text-zinc-900 tracking-tight">SHIPPING</h2>
                </div>
              </div>
              <div className="p-5">
                {order.shipping ? (
                  <div className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
                    <span className="font-bold text-zinc-900">{order.shipping.firstName} {order.shipping.lastName}</span>
                    <span>{order.shipping.address1}</span>
                    {order.shipping.address2 && <span>{order.shipping.address2}</span>}
                    <span>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</span>
                    <span>{order.shipping.country}</span>
                    {order.shipping.phone && <span className="mt-2 text-zinc-500">{order.shipping.phone}</span>}
                  </div>
                ) : (
                  <span className="text-sm text-zinc-500">No shipping information available.</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Payment, Fulfillment, Timeline */}
        <div className="flex flex-col gap-6">
          
          {/* Payment */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-zinc-900" />
                <h2 className="text-lg font-black text-zinc-900 tracking-tight">PAYMENT</h2>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">Status</span>
                <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border bg-emerald-100 text-emerald-800 border-emerald-200">
                  {order.paymentStatus || 'PAID'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">Method</span>
                <span className="text-sm font-bold text-zinc-900">{order.paymentMethod || 'Stripe'}</span>
              </div>
              {order.paymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-500">Reference</span>
                  <span className="text-xs font-mono font-medium text-zinc-900 bg-zinc-100 px-2 py-1 rounded">{order.paymentId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fulfillment */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-zinc-900" />
                <h2 className="text-lg font-black text-zinc-900 tracking-tight">FULFILLMENT</h2>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">Supplier</span>
                <span className="text-sm font-bold text-zinc-900">CJ Dropshipping</span>
              </div>
              
              {order.cjOrderId ? (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">CJ Order ID</span>
                    <span className="text-sm font-mono font-medium text-zinc-900 bg-zinc-100 px-2 py-1 rounded w-fit">{order.cjOrderId}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tracking</span>
                      <a href={`https://t.17track.net/en#nums=${order.trackingNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-primary-blue hover:underline w-fit">
                        {order.trackingNumber} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-xl border border-zinc-200 border-dashed text-center">
                  <Box className="w-6 h-6 text-zinc-400 mb-2" />
                  <span className="text-sm font-medium text-zinc-600 mb-3">Not yet submitted to CJ</span>
                  <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold shadow-sm">
                    Submit to CJ
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-zinc-900" />
                <h2 className="text-lg font-black text-zinc-900 tracking-tight">INTERNAL NOTES</h2>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col gap-4 bg-zinc-50/30 max-h-64 overflow-y-auto">
              {(order.internalNotes || []).length > 0 ? (
                (order.internalNotes || []).map((n: any, i: number) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                    <p className="text-sm text-zinc-700 font-medium mb-2">{n.text}</p>
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <span>{n.author}</span>
                      <span>{n.timestamp?.toDate ? n.timestamp.toDate().toLocaleString() : ''}</span>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-sm text-zinc-500 italic text-center py-4">No internal notes.</span>
              )}
            </div>
            
            <div className="p-4 border-t border-zinc-100 bg-white">
              <div className="flex flex-col gap-2">
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a private note..."
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 resize-none h-20"
                />
                <button 
                  onClick={addNote}
                  disabled={!note.trim() || isUpdating}
                  className="w-full px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-sm disabled:opacity-50"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

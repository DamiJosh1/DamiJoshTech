import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Truck, Calendar } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-zinc-50 flex items-center justify-center p-6 py-12 md:py-24">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-zinc-900/5 overflow-hidden">
        
        {/* Header */}
        <div className="bg-zinc-900 text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Package className="w-32 h-32" />
          </div>
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Order Confirmed</h1>
          <p className="text-zinc-400 font-medium text-lg">Thank you for your purchase.</p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 mb-8 text-center">
            <span className="block text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Order Number</span>
            <span className="block text-2xl font-black text-zinc-900">{orderNumber}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-zinc-700" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Shipping Status</h4>
                <p className="text-sm text-zinc-600">Processing order. We will notify you when it ships.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-zinc-700" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Estimated Delivery</h4>
                <p className="text-sm text-zinc-600">Standard Delivery (7-15 business days)</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500 mb-10">
            We've sent a confirmation email with your order details and a link to track its progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/track-order')}
              className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
            >
              Track Order
            </button>
            <button 
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

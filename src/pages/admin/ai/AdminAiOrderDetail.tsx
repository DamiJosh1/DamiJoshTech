import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Package, Check, ShoppingCart, Truck, CreditCard } from 'lucide-react';

export default function AdminAiOrderDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/admin/ai/orders" className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Order Intelligence Detail</h2>
          <p className="text-sm text-zinc-500">Order {id || '#SAJ-10482'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-100">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-zinc-900">AI Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-emerald-900">Healthy Order</h4>
                  <p className="text-sm text-emerald-700 mt-1">Payment is confirmed and the order has been shipped. Tracking received an update 8 hours ago.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-6">Order Timeline</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div className="w-px h-full bg-zinc-200 my-2"></div>
                </div>
                <div className="pt-1 pb-4">
                  <h4 className="font-medium text-zinc-900">Order Created</h4>
                  <p className="text-sm text-zinc-500">Customer placed order</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="w-px h-full bg-zinc-200 my-2"></div>
                </div>
                <div className="pt-1 pb-4">
                  <h4 className="font-medium text-zinc-900">Payment Confirmed</h4>
                  <p className="text-sm text-zinc-500">Payment processed successfully</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="w-px h-full bg-zinc-200 my-2"></div>
                </div>
                <div className="pt-1 pb-4">
                  <h4 className="font-medium text-zinc-900">Fulfillment Requested</h4>
                  <p className="text-sm text-zinc-500">Sent to CJ Dropshipping</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="pt-1">
                  <h4 className="font-medium text-zinc-500">Delivery</h4>
                  <p className="text-sm text-zinc-400">Pending tracking updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">Recommended Actions</h3>
            <p className="text-sm text-zinc-500 mb-4">No immediate action required for this order.</p>
            <div className="space-y-2">
              <button className="w-full py-2 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors">
                MONITOR SHIPPING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

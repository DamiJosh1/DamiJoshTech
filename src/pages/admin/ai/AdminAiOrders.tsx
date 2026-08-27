import React from 'react';
import { ShoppingBag, AlertTriangle, Package, Truck, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminAiOrders() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Order Operations</h2>
          <p className="text-sm text-zinc-500">Monitor orders, fulfillment and delivery without manually checking every order.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/ai/issues" className="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> VIEW ISSUES
          </Link>
        </div>
      </div>
      
      {/* Order Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-zinc-500">HEALTHY</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 mt-auto">142</span>
          <span className="text-xs text-zinc-500 mt-1">Orders proceeding normally</span>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-zinc-500">ATTENTION</span>
            <Info className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 mt-auto">12</span>
          <span className="text-xs text-zinc-500 mt-1">Action may be required soon</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-zinc-500">DELAYED</span>
            <Truck className="w-5 h-5 text-orange-500" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 mt-auto">5</span>
          <span className="text-xs text-zinc-500 mt-1">Fulfillment or shipping delayed</span>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-zinc-500">CRITICAL</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 mt-auto">2</span>
          <span className="text-xs text-zinc-500 mt-1">Immediate intervention required</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <ShoppingBag className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Active Order Monitoring</h3>
        <p className="mb-4">SAJODA AI is actively monitoring your orders. No critical issues detected right now.</p>
      </div>
    </div>
  );
}

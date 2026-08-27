import React from 'react';
import { Truck, Activity, PackageX, PackageSearch, Settings } from 'lucide-react';

export default function AdminAiSuppliers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Supplier Intelligence</h2>
          <p className="text-sm text-zinc-500">Monitor supplier inventory, pricing changes, and reliability metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Price Changes</h3>
              <p className="text-sm text-zinc-500">Detected supplier price updates</p>
            </div>
          </div>
          <div className="text-center py-6 text-zinc-400 text-sm border-t border-zinc-100">
            No recent changes detected
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <PackageX className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Inventory Alerts</h3>
              <p className="text-sm text-zinc-500">Low stock or out of stock items</p>
            </div>
          </div>
          <div className="text-center py-6 text-zinc-400 text-sm border-t border-zinc-100">
            All monitored products in stock
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Shipping Updates</h3>
              <p className="text-sm text-zinc-500">Changes to shipping methods or costs</p>
            </div>
          </div>
          <div className="text-center py-6 text-zinc-400 text-sm border-t border-zinc-100">
            No shipping changes detected
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50">
          <h3 className="font-medium text-zinc-900 flex items-center gap-2">
            <PackageSearch className="w-4 h-4 text-zinc-500" />
            Supplier Change Log
          </h3>
        </div>
        <div className="p-12 text-center text-zinc-500">
          <p>No supplier changes logged yet.</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Truck, Activity, PackageX, PackageSearch, Settings, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminAiSuppliers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Supplier Intelligence & Sourcing</h2>
          <p className="text-sm text-zinc-500">Monitor supplier inventory, domestic sourcing hubs, and scout seller accounts.</p>
        </div>
        <Link
          to="/admin/products?scout=account"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold shadow-md hover:opacity-95 transition-all self-start md:self-auto cursor-pointer"
        >
          <Users className="w-4 h-4 text-white" />
          Harvest Seller Accounts
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Social & Vendor Account Harvester Feature Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-zinc-900 to-black text-white p-6 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
              New: Competitor & Social Vendor Harvester
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            Turn Any Vendor's Public Catalog Into SAJODA Inventory
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Give your AI any Instagram merchant handle, TikTok shop profile, or Computer Village dealer handle (e.g. <span className="font-mono text-indigo-300">@gadgethub_lagos</span>, <span className="font-mono text-indigo-300">@alaba_direct_deals</span>). AI identifies their top-selling electronics, sources wholesale pricing from domestic hubs, enforces your guaranteed <strong>₦10,000+ profit commission</strong>, generates 4-angle photo galleries, and enables 1-click batch publishing.
          </p>
          <div className="pt-2">
            <Link
              to="/admin/products?scout=account"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-black text-xs hover:bg-zinc-100 transition-colors shadow-lg cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              Launch Vendor Account Harvester
            </Link>
          </div>
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

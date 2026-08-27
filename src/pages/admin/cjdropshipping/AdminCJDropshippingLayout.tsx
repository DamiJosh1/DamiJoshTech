import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Globe, Package, ShoppingCart, RefreshCw, FileText } from 'lucide-react';

export default function AdminCJDropshippingLayout() {
  const tabs = [
    { name: 'Dashboard', path: '/admin/cjdropshipping', icon: <Globe className="w-4 h-4" />, end: true },
    { name: 'Products', path: '/admin/cjdropshipping/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Fulfillment', path: '/admin/cjdropshipping/orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { name: 'Sync Center', path: '/admin/cjdropshipping/sync', icon: <RefreshCw className="w-4 h-4" /> },
    { name: 'Logs', path: '/admin/cjdropshipping/logs', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">CJ Dropshipping</h1>
          <p className="text-zinc-500">Manage supplier products, synchronization and fulfillment.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-zinc-200">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) => `
                flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                ${isActive ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}
              `}
            >
              {tab.icon}
              {tab.name}
            </NavLink>
          ))}
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

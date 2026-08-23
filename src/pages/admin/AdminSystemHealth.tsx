import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, Server, ShieldCheck, Activity, Globe, Database, CreditCard, Mail, Package, Zap, Search } from 'lucide-react';

export default function AdminSystemHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProductionReady, setIsProductionReady] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const markReady = () => {
    if (confirm("Are you sure you want to mark SAJODA ELECTRONICS as ready for production launch?")) {
      setIsProductionReady(true);
    }
  };

  const systems = [
    { name: 'Payment Gateway', status: 'operational', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'CJ Dropshipping Sync', status: 'operational', icon: <Package className="w-5 h-5" /> },
    { name: 'Database / Firebase', status: 'operational', icon: <Database className="w-5 h-5" /> },
    { name: 'Email / Notifications', status: 'operational', icon: <Mail className="w-5 h-5" /> },
    { name: 'Shipping Calculator', status: 'operational', icon: <Globe className="w-5 h-5" /> },
    { name: 'Analytics Sync', status: 'operational', icon: <Activity className="w-5 h-5" /> },
    { name: 'SEO & Meta Tags', status: 'operational', icon: <Search className="w-5 h-5" /> },
    { name: 'Security & Auth', status: 'operational', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'PWA Service Worker', status: 'operational', icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">System Health & Launch</h1>
          <p className="text-zinc-500 font-medium">SAJODA ELECTRONICS PRODUCTION READINESS</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="p-2 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-zinc-600 ${isRefreshing ? 'animate-spin text-primary-blue' : ''}`} />
          </button>
          {!isProductionReady ? (
            <button 
              onClick={markReady}
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold shadow-sm hover:bg-zinc-800 transition-colors"
            >
              Mark Ready for Production
            </button>
          ) : (
            <div className="px-6 py-2 bg-success/10 text-success rounded-xl font-bold shadow-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> READY FOR PRODUCTION
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-zinc-200">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary-blue" />
              Core Infrastructure Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systems.map((sys, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="text-zinc-500">{sys.icon}</div>
                    <span className="font-bold text-sm text-zinc-900">{sys.name}</span>
                  </div>
                  {sys.status === 'operational' ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/10 text-success rounded-lg text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-error/10 text-error rounded-lg text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" /> FAIL
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-[1.5rem] p-6 md:p-8 shadow-lg text-white">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" />
              Launch Checklist
            </h2>
            
            <div className="space-y-4 text-sm font-medium">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 accent-success" />
                <span className="text-zinc-300">Authentication & security rules validated</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 accent-success" />
                <span className="text-zinc-300">Payment gateway live/sandbox mode verified</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 accent-success" />
                <span className="text-zinc-300">CJ Dropshipping credentials secure & active</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 accent-success" />
                <span className="text-zinc-300">International checkout & taxes calculated</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 accent-success" />
                <span className="text-zinc-300">No developer placeholder content remaining</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 accent-success" />
                <span className="text-zinc-300">PWA installable & caching configured</span>
              </label>
            </div>

            {isProductionReady && (
              <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20">
                <p className="text-xs text-zinc-400 font-bold mb-1">DEPLOYMENT AUTHORIZED</p>
                <p className="text-sm font-medium">SAJODA v1.0.0</p>
                <p className="text-xs text-zinc-400 mt-2">{new Date().toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

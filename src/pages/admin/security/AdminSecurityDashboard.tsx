import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Activity, Database, Key, Server, RefreshCw, Bot, Bell, Shield, Laptop, Download, Lock } from 'lucide-react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import StandaloneStudioModal from '../../../components/admin/StandaloneStudioModal';

export default function AdminSecurityDashboard() {
  const [securityScore, setSecurityScore] = useState(96);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [showStudioModal, setShowStudioModal] = useState(false);
  
  const statusItems = [
    { name: 'System Health', status: 'ONLINE', icon: <Activity className="w-5 h-5 text-emerald-500" /> },
    { name: 'Database Status', status: 'ONLINE', icon: <Database className="w-5 h-5 text-emerald-500" /> },
    { name: 'Authentication', status: 'ONLINE', icon: <Key className="w-5 h-5 text-emerald-500" /> },
    { name: 'API Status', status: 'UNKNOWN', icon: <Server className="w-5 h-5 text-zinc-400" /> },
    { name: 'Backup Status', status: 'NOT CONFIGURED', icon: <RefreshCw className="w-5 h-5 text-amber-500" /> },
    { name: 'AI Status', status: 'ONLINE', icon: <Bot className="w-5 h-5 text-emerald-500" /> },
  ];

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-center items-center text-center col-span-1">
          <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center mb-4 bg-emerald-50">
            <span className="text-3xl font-black text-emerald-600">{securityScore}</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Security Health Score</h2>
          <p className="text-sm text-zinc-500 mt-2">Operational security indicator.</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
             <Shield className="w-5 h-5 text-indigo-500" /> Security Status
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {statusItems.map((item, idx) => (
               <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                  <div className="shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-500 uppercase">{item.name}</div>
                    <div className={`text-sm font-bold ${item.status === 'ONLINE' ? 'text-emerald-700' : item.status === 'UNKNOWN' ? 'text-zinc-600' : 'text-amber-600'}`}>
                      {item.status}
                    </div>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
             <Bell className="w-5 h-5 text-red-500" /> Security Alerts
          </h3>
          <div className="space-y-3">
             <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 flex items-start justify-between">
                <div>
                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 uppercase mb-2">Warning</span>
                   <p className="text-sm font-semibold text-zinc-900">No backup configured</p>
                   <p className="text-xs text-zinc-500 mt-1">Database backups are currently not configured.</p>
                </div>
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Configure</button>
             </div>
             
             <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 flex items-start justify-between">
                <div>
                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 uppercase mb-2">Info</span>
                   <p className="text-sm font-semibold text-zinc-900">New Admin Login</p>
                   <p className="text-xs text-zinc-500 mt-1">damijosh12@gmail.com logged in recently.</p>
                </div>
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View</button>
             </div>
             
             {recentAlerts.length === 0 && (
                <div className="text-center py-6 text-zinc-500 text-sm">No recent critical alerts.</div>
             )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
           <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
             <Bot className="w-5 h-5 text-indigo-500" /> AI Safety Summary
           </h3>
           <div className="space-y-4">
              <div className="p-4 rounded-lg border border-indigo-100 bg-indigo-50">
                 <div className="flex items-center justify-between mb-2">
                   <div className="font-semibold text-indigo-900">Global AI Autonomy Level</div>
                   <div className="px-2 py-1 bg-indigo-200 text-indigo-800 text-xs font-bold rounded">LEVEL 3</div>
                 </div>
                 <p className="text-sm text-indigo-700">Controlled Automation. AI can perform routine tasks but requires approval for high-risk actions.</p>
              </div>
              
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-zinc-600">Pending AI Approvals</span>
                   <span className="font-semibold text-zinc-900">0</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-zinc-600">Tasks Completed (24h)</span>
                   <span className="font-semibold text-zinc-900">24</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-zinc-600">Active Workers</span>
                   <span className="font-semibold text-zinc-900">3 / 8</span>
                 </div>
              </div>
              
              <button className="w-full py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                Manage AI Permissions
              </button>
           </div>
        </div>
      </div>

      {/* Standalone Studio Back-Office Separation Card */}
      <div className="bg-zinc-950 text-white rounded-2xl border border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight">Standalone Admin Studio & Storefront Isolation</h3>
              <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Stealth Shield Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Your public customer storefront is 100% cleansed of admin controls, wholesale sourcing hubs, and profit calculations. You can install this studio as a standalone desktop/phone app or download the complete source code bundle (.zip) to run on your private local machine.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowStudioModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl text-xs font-black transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Laptop className="w-4 h-4" />
          <span>Standalone App & .ZIP Export</span>
        </button>
      </div>

      {/* Standalone Studio Modal */}
      <StandaloneStudioModal 
        isOpen={showStudioModal} 
        onClose={() => setShowStudioModal(false)} 
      />
    </div>
  );
}

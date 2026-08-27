import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, Users, ShieldAlert, CheckCircle2, TrendingUp, Bot } from 'lucide-react';

export default function AdminSupportDashboard() {
  const [metrics, setMetrics] = useState({
    openTickets: 3,
    unanswered: 1,
    aiHandled: 12,
    waitingAdmin: 2,
    escalated: 1,
    resolved: 45,
    avgResponseTime: '2h 15m',
    csat: '4.8/5.0'
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Open Tickets</h3>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{metrics.openTickets}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Waiting for Admin</h3>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{metrics.waitingAdmin}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Escalated</h3>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{metrics.escalated}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">AI Handled</h3>
            <Bot className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{metrics.aiHandled}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-zinc-900">Needs Attention</h3>
            </div>
            <div className="divide-y divide-zinc-100">
              <div className="p-4 hover:bg-zinc-50 transition-colors cursor-pointer">
                 <div className="flex items-start justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                     <div>
                       <div className="flex items-center gap-2">
                         <span className="font-semibold text-zinc-900 text-sm">Urgent Refund Request</span>
                         <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded uppercase">Escalated</span>
                       </div>
                       <p className="text-sm text-zinc-500 mt-1">Customer received wrong item. Order #1002.</p>
                     </div>
                   </div>
                   <span className="text-xs text-zinc-400">10m ago</span>
                 </div>
              </div>
              <div className="p-4 hover:bg-zinc-50 transition-colors cursor-pointer">
                 <div className="flex items-start justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                     <div>
                       <div className="flex items-center gap-2">
                         <span className="font-semibold text-zinc-900 text-sm">Shipping Delay</span>
                         <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase">Waiting Admin</span>
                       </div>
                       <p className="text-sm text-zinc-500 mt-1">Order #1008 hasn't updated tracking in 5 days.</p>
                     </div>
                   </div>
                   <span className="text-xs text-zinc-400">2h ago</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600">Avg Response Time</span>
                <span className="font-semibold text-zinc-900">{metrics.avgResponseTime}</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full w-[45%]"></div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-zinc-600">Resolved Today</span>
                <span className="font-semibold text-emerald-600">{metrics.resolved}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                <span className="text-sm text-zinc-600">CSAT Score</span>
                <span className="font-semibold text-zinc-900">{metrics.csat}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

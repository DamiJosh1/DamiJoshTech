import React from 'react';
import { Zap, Plus, AlertTriangle, Play, Pause, Edit2 } from 'lucide-react';

export default function AdminAiAutomations() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Automations</h2>
          <p className="text-sm text-zinc-500">Configure triggers, conditions, and automated background AI workflows.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 font-medium text-sm transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> CREATE AUTOMATION
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Automation Card 1 */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="font-bold text-zinc-900">Order Auto-Fulfill</h3>
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase">ACTIVE</span>
          </div>
          <div className="space-y-3 mb-6">
            <div>
              <p className="text-xs font-semibold text-zinc-500 mb-1">TRIGGER</p>
              <p className="text-sm text-zinc-900 bg-zinc-50 p-2 rounded border border-zinc-100">Payment Status = PAID</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 mb-1">WORKER & ACTION</p>
              <p className="text-sm text-zinc-900 bg-zinc-50 p-2 rounded border border-zinc-100">Order Ops → Sync to CJ</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 pt-4">
            <span>Last run: 10 mins ago</span>
            <div className="flex gap-1">
              <button className="p-1 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
              <button className="p-1 hover:text-amber-600"><Pause className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Automation Card 2 */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="font-bold text-zinc-900">Daily Trend Scan</h3>
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase">ACTIVE</span>
          </div>
          <div className="space-y-3 mb-6">
            <div>
              <p className="text-xs font-semibold text-zinc-500 mb-1">SCHEDULE</p>
              <p className="text-sm text-zinc-900 bg-zinc-50 p-2 rounded border border-zinc-100">Daily at 08:00 AM UTC</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 mb-1">WORKER & ACTION</p>
              <p className="text-sm text-zinc-900 bg-zinc-50 p-2 rounded border border-zinc-100">Trend Intel → Market Scan</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 pt-4">
            <span>Last run: Today 08:00</span>
            <div className="flex gap-1">
              <button className="p-1 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
              <button className="p-1 hover:text-amber-600"><Pause className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

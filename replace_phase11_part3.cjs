const fs = require('fs');

function writePage(name, content) {
    fs.writeFileSync(`src/pages/admin/ai/${name}.tsx`, content);
}

writePage('AdminAiMemory', `import React from 'react';
import { Brain, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function AdminAiMemory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Business Memory</h2>
          <p className="text-sm text-zinc-500">Define critical business rules, preferences, and operating guidelines for AI workers.</p>
        </div>
        <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 font-medium text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> CREATE BUSINESS RULE
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input 
          type="text"
          placeholder="Search rules..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rule Name</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-medium text-zinc-900">Minimum Margin Protection</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-zinc-600">Do not publish products with less than 20% estimated margin.</span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded uppercase">CRITICAL</span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">ACTIVE</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-zinc-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-medium text-zinc-900">Supplier Description Rewrite</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-zinc-600">Never publish supplier descriptions without rewriting them for SEO and tone.</span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase">HIGH</span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">ACTIVE</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-zinc-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-medium text-zinc-900">Brand Voice: Premium</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-zinc-600">Use a professional, premium, and concise tone in all generated content.</span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase">NORMAL</span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">ACTIVE</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-zinc-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`);

writePage('AdminAiAutomations', `import React from 'react';
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
`);

writePage('AdminAiPermissions', `import React from 'react';
import { Shield, Lock, Check } from 'lucide-react';

export default function AdminAiPermissions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Permissions & Safety Matrix</h2>
          <p className="text-sm text-zinc-500">Control exactly what AI workers are authorized to view, prepare, and execute.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Worker</th>
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action</th>
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Permission Level</th>
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Admin Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            <tr className="hover:bg-zinc-50">
              <td className="py-4 px-4 font-medium text-zinc-900">Product Builder</td>
              <td className="py-4 px-4 text-sm text-zinc-600">Create Product Draft</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">PREPARE</span></td>
              <td className="py-4 px-4"><span className="text-sm text-zinc-500 flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> NO APPROVAL REQ</span></td>
            </tr>
            <tr className="hover:bg-zinc-50">
              <td className="py-4 px-4 font-medium text-zinc-900">Product Builder</td>
              <td className="py-4 px-4 text-sm text-zinc-600">Publish Product to Store</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">EXECUTE</span></td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded flex items-center gap-1 w-max"><Lock className="w-3 h-3" /> REQUIRED</span></td>
            </tr>
            <tr className="hover:bg-zinc-50">
              <td className="py-4 px-4 font-medium text-zinc-900">Order Operations</td>
              <td className="py-4 px-4 text-sm text-zinc-600">Monitor Orders</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-zinc-100 text-zinc-700 text-xs font-medium rounded">READ ONLY</span></td>
              <td className="py-4 px-4"><span className="text-sm text-zinc-500 flex items-center gap-1"><Check className="w-4 h-4 text-emerald-500" /> NO APPROVAL REQ</span></td>
            </tr>
            <tr className="hover:bg-zinc-50">
              <td className="py-4 px-4 font-medium text-zinc-900">Order Operations</td>
              <td className="py-4 px-4 text-sm text-zinc-600">Fulfill Order via CJ</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">AUTOMATIC</span></td>
              <td className="py-4 px-4"><span className="text-sm text-emerald-600 font-medium flex items-center gap-1">AUTO (VIA AUTOMATION)</span></td>
            </tr>
            <tr className="hover:bg-zinc-50">
              <td className="py-4 px-4 font-medium text-zinc-900">Order Operations</td>
              <td className="py-4 px-4 text-sm text-zinc-600">Issue Customer Refund</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">EXECUTE</span></td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded flex items-center gap-1 w-max"><Lock className="w-3 h-3" /> REQUIRED (CRITICAL)</span></td>
            </tr>
            <tr className="hover:bg-zinc-50">
              <td className="py-4 px-4 font-medium text-zinc-900">Marketing Worker</td>
              <td className="py-4 px-4 text-sm text-zinc-600">Launch Paid Ad Campaign</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">EXECUTE</span></td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded flex items-center gap-1 w-max"><Lock className="w-3 h-3" /> REQUIRED (CRITICAL)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

import React from 'react';
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

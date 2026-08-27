import React from 'react';
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

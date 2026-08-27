import React, { useState } from 'react';
import { DollarSign, Search, AlertCircle, BarChart2, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminAiPricing() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Pricing Intelligence</h2>
          <p className="text-sm text-zinc-500">Understand what your products should cost before you publish them.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-zinc-600">Products Analyzed</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-zinc-600">Needing Review</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm font-medium text-zinc-600">Low Margin</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-zinc-600">Healthy Margin</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">0</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Supplier Cost</th>
                <th className="px-6 py-3 font-medium">Est. Shipping</th>
                <th className="px-6 py-3 font-medium">Current Price</th>
                <th className="px-6 py-3 font-medium">Est. Profit</th>
                <th className="px-6 py-3 font-medium">Margin</th>
                <th className="px-6 py-3 font-medium">AI Recommendation</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center">
                    <DollarSign className="w-8 h-8 text-zinc-300 mb-2" />
                    <p>No products analyzed yet.</p>
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

import React from 'react';
import { BarChart2, Calculator, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminAiProfit() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Profit Analysis</h2>
          <p className="text-sm text-zinc-500">Detailed breakdown of estimated margins and actual product profitability.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-zinc-600">Avg Est. Margin</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">0%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
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
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-zinc-600" />
            </div>
            <span className="text-sm font-medium text-zinc-600">Missing Costs</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-zinc-200 text-center text-zinc-500 py-12">
          <Calculator className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
          <h3 className="font-medium text-zinc-900 mb-2">Profit Calculator</h3>
          <p className="text-sm">Select a product to simulate pricing and margins.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-zinc-200 text-center text-zinc-500 py-12">
          <TrendingUp className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
          <h3 className="font-medium text-zinc-900 mb-2">Price Scenarios</h3>
          <p className="text-sm">Analyze minimum viable price and target margins.</p>
        </div>
      </div>
    </div>
  );
}

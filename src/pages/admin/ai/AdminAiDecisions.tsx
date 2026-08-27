import React from 'react';
import { Brain, CheckCircle, AlertTriangle, XCircle, Eye } from 'lucide-react';

export default function AdminAiDecisions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Product Decision Engine</h2>
          <p className="text-sm text-zinc-500">AI recommendations for selling, reviewing, avoiding, or watching products.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-zinc-900">SELL</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-4">Strong opportunity with healthy margins and stable supplier.</p>
          <div className="text-2xl font-bold text-zinc-900">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-bold text-zinc-900">REVIEW</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-4">Opportunity exists but requires admin verification of constraints.</p>
          <div className="text-2xl font-bold text-zinc-900">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-zinc-900">AVOID</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-4">Negative margin, unavailable shipping, or missing information.</p>
          <div className="text-2xl font-bold text-zinc-900">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-zinc-900">WATCH</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-4">Potential future opportunity. Monitoring for supplier changes.</p>
          <div className="text-2xl font-bold text-zinc-900">0</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50">
          <h3 className="font-medium text-zinc-900 flex items-center gap-2">
            <Brain className="w-4 h-4 text-zinc-500" />
            Recent Decisions
          </h3>
        </div>
        <div className="p-12 text-center text-zinc-500">
          <p>No product decisions generated yet.</p>
        </div>
      </div>
    </div>
  );
}

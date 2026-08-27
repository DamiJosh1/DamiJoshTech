import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AdminAiMarketingAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Marketing Analytics</h2>
          <p className="text-sm text-zinc-500">Track campaign performance, conversion rates, and revenue attribution.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <BarChart3 className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Not Connected</h3>
        <p className="mb-4">Marketing data is unavailable. Connect advertising platforms to view analytics.</p>
      </div>
    </div>
  );
}

import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function AdminAiGrowth() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Growth Center</h2>
          <p className="text-sm text-zinc-500">Discover revenue-driving opportunities based on store data.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <TrendingUp className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Growth Opportunities</h3>
        <p className="mb-4">AI will surface high-margin products with low traffic and other growth signals here.</p>
      </div>
    </div>
  );
}

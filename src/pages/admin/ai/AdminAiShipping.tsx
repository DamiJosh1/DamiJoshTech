import React from 'react';
import { Truck } from 'lucide-react';

export default function AdminAiShipping() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Shipping Intelligence</h2>
          <p className="text-sm text-zinc-500">Track shipments and detect potential delays proactively.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <Truck className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Shipping Monitor</h3>
        <p className="mb-4">All shipments are currently on schedule.</p>
      </div>
    </div>
  );
}

import React from 'react';
import { Crosshair } from 'lucide-react';

export default function AdminAiCompetitors() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Competitor Intelligence</h2>
          <p className="text-sm text-zinc-500">Understand the market without copying competitors.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <Crosshair className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">No Competitors Tracked</h3>
        <p className="mb-4">Add a competitor URL to analyze their public pricing, positioning, and features.</p>
      </div>
    </div>
  );
}

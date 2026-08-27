import React from 'react';
import { Megaphone } from 'lucide-react';

export default function AdminAiCampaigns() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Campaign Builder</h2>
          <p className="text-sm text-zinc-500">Prepare marketing campaigns across multiple channels.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <Megaphone className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">No Active Campaigns</h3>
        <p className="mb-4">Start a new campaign draft and let AI prepare the objective, targeting, and content.</p>
      </div>
    </div>
  );
}

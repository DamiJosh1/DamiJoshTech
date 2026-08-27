import React from 'react';
import { Send, Clock } from 'lucide-react';

export default function AdminAiPublishing() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Publishing Queue</h2>
          <p className="text-sm text-zinc-500">Monitor approved products queued for storefront publishing.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="p-8 text-center text-zinc-500">
          <Clock className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
          <h3 className="font-medium text-zinc-900 mb-2">Publishing Queue Empty</h3>
          <p className="mb-4">Approved product drafts will appear here while they are being pushed to the live storefront.</p>
        </div>
      </div>
    </div>
  );
}

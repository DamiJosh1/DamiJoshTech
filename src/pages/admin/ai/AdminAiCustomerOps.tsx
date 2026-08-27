import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function AdminAiCustomerOps() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Customer Operations</h2>
          <p className="text-sm text-zinc-500">Review AI-prepared communications and customer order context.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <MessageSquare className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Message Drafts</h3>
        <p className="mb-4">No customer communications currently require review.</p>
      </div>
    </div>
  );
}

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AdminAiIssues() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Issue Center</h2>
          <p className="text-sm text-zinc-500">Central hub for operational problems detected by AI.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <AlertTriangle className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">No Active Issues</h3>
        <p className="mb-4">SAJODA AI has not detected any critical issues with orders, payments, or fulfillment.</p>
      </div>
    </div>
  );
}

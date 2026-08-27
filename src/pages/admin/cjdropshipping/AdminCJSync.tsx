import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function AdminCJSync() {
  return (
    <div className="py-12 text-center text-zinc-500">
      <RefreshCw className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
      <h2 className="text-xl font-bold text-zinc-900 mb-2">Sync Center</h2>
      <p>Synchronization operations will appear here.</p>
    </div>
  );
}

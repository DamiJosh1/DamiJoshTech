import React from 'react';
import { FileText } from 'lucide-react';

export default function AdminCJLogs() {
  return (
    <div className="py-12 text-center text-zinc-500">
      <FileText className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
      <h2 className="text-xl font-bold text-zinc-900 mb-2">Integration Logs</h2>
      <p>Synchronization and API logs will appear here.</p>
    </div>
  );
}

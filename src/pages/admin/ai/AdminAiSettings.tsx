import React from 'react';
import { Settings } from 'lucide-react';

export default function AdminAiSettings() {
  return (
    <div className="py-12 text-center text-zinc-500">
      <Settings className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
      <h2 className="text-xl font-bold text-zinc-900 mb-2">AI Configuration</h2>
      <p>AI automation and setting limits will appear here.</p>
    </div>
  );
}

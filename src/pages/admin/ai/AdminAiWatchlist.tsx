import React from 'react';
import { Eye } from 'lucide-react';

export default function AdminAiWatchlist() {
  return (
    <div className="py-12 text-center text-zinc-500">
      <Eye className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
      <h2 className="text-xl font-bold text-zinc-900 mb-2">AI Watchlist</h2>
      <p>Your product watchlist is empty.</p>
    </div>
  );
}

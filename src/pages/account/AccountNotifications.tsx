import React from 'react';
import { Bell } from 'lucide-react';

export default function AccountNotifications() {
  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h1 className="text-2xl font-black text-zinc-900 mb-6">Notifications</h1>
      
      <div className="bg-white rounded-2xl border border-zinc-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
          <Bell className="w-8 h-8 text-zinc-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">No new notifications</h2>
        <p className="text-zinc-500 max-w-md">You're all caught up! When you have new orders, alerts, or messages, they will appear here.</p>
      </div>
    </div>
  );
}

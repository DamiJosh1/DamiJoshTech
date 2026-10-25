import React, { useState } from 'react';
import { Smartphone, Laptop, Globe, Shield, LogOut, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useStore } from '../../../StoreContext';

interface ActiveSession {
  id: string;
  device: string;
  type: 'desktop' | 'mobile';
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function AdminSecuritySessions() {
  const { user } = useStore();
  const [sessions, setSessions] = useState<ActiveSession[]>([
    {
      id: 'sess-1',
      device: 'MacBook Pro 16"',
      type: 'desktop',
      browser: 'Chrome 128 / macOS',
      location: 'Lagos, Nigeria',
      ip: '102.89.41.18',
      lastActive: 'Active Now',
      isCurrent: true
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro',
      type: 'mobile',
      browser: 'Safari Mobile / iOS 18',
      location: 'Ikeja, Lagos, Nigeria',
      ip: '102.89.41.22',
      lastActive: '2 hours ago',
      isCurrent: false
    },
    {
      id: 'sess-3',
      device: 'Windows Workstation',
      type: 'desktop',
      browser: 'Edge 126 / Windows 11',
      location: 'Surulere, Lagos, Nigeria',
      ip: '105.112.98.4',
      lastActive: 'Yesterday',
      isCurrent: false
    }
  ]);
  const [revokedMessage, setRevokedMessage] = useState<string | null>(null);

  const handleRevoke = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setRevokedMessage('Session terminated and credentials invalidated.');
    setTimeout(() => setRevokedMessage(null), 3000);
  };

  const handleRevokeAllOthers = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    setRevokedMessage('All other active admin sessions have been revoked.');
    setTimeout(() => setRevokedMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-zinc-900">Active Admin Sessions</h2>
          <p className="text-xs text-zinc-500">Devices currently authenticated as store owner ({user?.email || 'damijosh12@gmail.com'}).</p>
        </div>

        <button
          onClick={handleRevokeAllOthers}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Revoke All Other Sessions
        </button>
      </div>

      {revokedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {revokedMessage}
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((sess) => (
          <div key={sess.id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                {sess.type === 'desktop' ? <Laptop className="w-6 h-6 text-zinc-700" /> : <Smartphone className="w-6 h-6 text-zinc-700" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-zinc-900">{sess.device}</h4>
                  {sess.isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      This Device
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Last active: {sess.lastActive}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 font-medium">{sess.browser}</p>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {sess.location}
                  </span>
                  <span>IP: {sess.ip}</span>
                </div>
              </div>
            </div>

            <div>
              {sess.isCurrent ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Secure Current Session
                </span>
              ) : (
                <button
                  onClick={() => handleRevoke(sess.id)}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  End Session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Info, RefreshCw } from 'lucide-react';

interface SecurityAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  actionRequired?: string;
}

export default function AdminSecurityAlerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: 'alt-1',
      severity: 'warning',
      title: 'Database Cloud Backup Advisory',
      description: 'Scheduled Firestore daily snapshot export not connected to cold storage bucket.',
      timestamp: 'Today, 09:15 AM',
      resolved: false,
      actionRequired: 'Configure automated export bucket'
    },
    {
      id: 'alt-2',
      severity: 'info',
      title: 'Paystack Secret Key Rotation Recommended',
      description: 'Payment gateway API secret has been active for over 90 days. Best practice suggests rotating test and live keys.',
      timestamp: 'Yesterday, 04:30 PM',
      resolved: false,
      actionRequired: 'Review in Paystack Dashboard'
    },
    {
      id: 'alt-3',
      severity: 'info',
      title: 'Wholesale Base Costs Privacy Verification',
      description: 'Automated audit confirmed that base wholesale costs and DamiJosh profit commission markup (+₦10k+) remain 100% hidden from storefront shoppers.',
      timestamp: '2 days ago',
      resolved: true
    }
  ]);

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-zinc-900">Security Alerts & Anomalies</h2>
          <p className="text-xs text-zinc-500">Real-time alerts regarding authentication, payments, data privacy, and infrastructure.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700">
            {alerts.filter(a => !a.resolved).length} Pending Alerts
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-5 rounded-2xl border transition-all ${
              alt.resolved
                ? 'bg-zinc-50/70 border-zinc-200 opacity-75'
                : alt.severity === 'critical'
                ? 'bg-rose-50/50 border-rose-200'
                : alt.severity === 'warning'
                ? 'bg-amber-50/50 border-amber-200'
                : 'bg-blue-50/50 border-blue-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  alt.severity === 'critical'
                    ? 'bg-rose-100 text-rose-700'
                    : alt.severity === 'warning'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {alt.severity === 'critical' ? (
                    <XCircle className="w-5 h-5" />
                  ) : alt.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      alt.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : alt.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alt.severity}
                    </span>

                    <span className="text-[11px] text-zinc-400 font-medium">
                      {alt.timestamp}
                    </span>

                    {alt.resolved && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-sm text-zinc-900">{alt.title}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">{alt.description}</p>

                  {alt.actionRequired && !alt.resolved && (
                    <div className="text-[11px] text-zinc-700 font-bold pt-1">
                      Recommended Action: <span className="text-indigo-600">{alt.actionRequired}</span>
                    </div>
                  )}
                </div>
              </div>

              {!alt.resolved && (
                <button
                  onClick={() => handleResolve(alt.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

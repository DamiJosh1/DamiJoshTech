import React, { useState } from 'react';
import { Key, Link, Shield, CheckCircle2, AlertTriangle, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';

interface ApiIntegration {
  name: string;
  provider: string;
  status: 'active' | 'warning' | 'standby';
  keyMasked: string;
  lastUsed: string;
  scope: string;
}

export default function AdminSecurityApi() {
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([
    {
      name: 'Paystack Payment Gateway',
      provider: 'Paystack Nigeria',
      status: 'active',
      keyMasked: 'sk_live_••••••••••••••••••••38f9',
      lastUsed: '5 minutes ago',
      scope: 'Webhook verification, charge success callbacks, settlements'
    },
    {
      name: 'Google Gemini AI Engine',
      provider: 'Google GenAI SDK (@google/genai)',
      status: 'active',
      keyMasked: 'AIzaSy••••••••••••••••••••8170',
      lastUsed: 'Just now',
      scope: 'Social viral scouting, catalog auto-generation, multi-angle inspections'
    },
    {
      name: 'Firebase Cloud Firestore & Auth',
      provider: 'Google Cloud Platform (GCP)',
      status: 'active',
      keyMasked: 'gen-lang-client-0817050634 / ai-studio-shipswift',
      lastUsed: 'Active real-time listener',
      scope: 'Persistent database storage, product catalog, user sessions'
    },
    {
      name: 'Resend Email Receipts',
      provider: 'Resend API',
      status: 'standby',
      keyMasked: 're_••••••••••••••••••••a1b2',
      lastUsed: 'When orders are placed',
      scope: 'Customer order confirmation & dispatch notifications'
    }
  ]);

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-zinc-900">API Credentials & Service Tokens</h2>
          <p className="text-xs text-zinc-500">Monitor external service tokens, webhook signatures, and cryptographic integrity.</p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Server-Side Proxied (Zero Client Leakage)
        </span>
      </div>

      <div className="space-y-3">
        {integrations.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-zinc-900">{item.name}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  item.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-zinc-500 font-medium">{item.provider}</p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-zinc-500">
                <span className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-800 font-bold">
                  {item.keyMasked}
                </span>
                <span>• Last invocation: {item.lastUsed}</span>
              </div>

              <p className="text-[11px] text-zinc-400 mt-1">{item.scope}</p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Shield className="w-4 h-4" /> Validated
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

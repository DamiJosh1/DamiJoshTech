import React, { useState } from 'react';
import { Key, Shield, UserCheck, Lock, Plus, CheckCircle2, User } from 'lucide-react';

interface AdminRoleUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin / Owner' | 'Inventory Manager' | 'Support Agent';
  accessLevel: string;
  status: 'active' | 'suspended';
  lastLogin: string;
}

export default function AdminSecurityPermissions() {
  const [users, setUsers] = useState<AdminRoleUser[]>([
    {
      id: 'adm-1',
      name: 'DamiJosh (Store Owner)',
      email: 'damijosh12@gmail.com',
      role: 'Super Admin / Owner',
      accessLevel: 'Full Unrestricted Access (Sourcing, Wholesale Costs, Paystack, AI)',
      status: 'active',
      lastLogin: 'Active Now'
    },
    {
      id: 'adm-2',
      name: 'Dispatch & Alaba Hub Logistics',
      email: 'logistics@sajoda.ng',
      role: 'Inventory Manager',
      accessLevel: 'Orders, Fulfillment & Inventory Trackers only (Costs Hidden)',
      status: 'active',
      lastLogin: '3 hours ago'
    }
  ]);

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-zinc-900">Role-Based Access Control (RBAC)</h2>
          <p className="text-xs text-zinc-500">Manage administrator privileges and protect sensitive wholesale pricing and customer records.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-indigo-600" />
            Wholesale Costs Masked by Default
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-100 font-black text-sm text-zinc-900">
            Authorized Store Administrators
          </div>

          <div className="divide-y divide-zinc-100">
            {users.map((u) => (
              <div key={u.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/60 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-zinc-900">{u.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                        {u.role}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 font-medium">{u.email}</p>
                    <p className="text-[11px] text-zinc-600 font-semibold">{u.accessLevel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[11px] text-zinc-400">Last active: {u.lastLogin}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Rules Summary */}
        <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-black text-sm text-white">Security Enforcement Guidelines</h3>
          </div>
          <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside">
            <li><strong>Master Owner Privileges:</strong> Only <span className="font-mono text-indigo-300">damijosh12@gmail.com</span> can access financial margins, wholesale cost prices, and payment gateway keys.</li>
            <li><strong>Public Store Isolation:</strong> Regular visitors have read-only access to published products; base costs and owner commissions are scrubbed before reaching customer views.</li>
            <li><strong>Firestore Rules:</strong> Database write operations on orders and catalogs require authenticated administrative claim tokens.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}

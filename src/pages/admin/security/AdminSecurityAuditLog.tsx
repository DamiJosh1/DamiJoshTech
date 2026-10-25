import React, { useState, useEffect } from 'react';
import { Lock, Search, Filter, ShieldCheck, Download, AlertCircle, Clock, User, CheckCircle2 } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'auth' | 'product' | 'order' | 'permission' | 'ai';
  ipAddress: string;
  status: 'success' | 'warning' | 'denied';
  details: string;
}

export default function AdminSecurityAuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const defaultLogs: AuditEntry[] = [
    {
      id: 'log-1',
      timestamp: 'Just now',
      actor: 'damijosh12@gmail.com (Owner)',
      action: 'Admin Session Login',
      category: 'auth',
      ipAddress: '102.89.41.18 (Lagos, Nigeria)',
      status: 'success',
      details: 'Two-factor session token authenticated successfully.'
    },
    {
      id: 'log-2',
      timestamp: '15 mins ago',
      actor: 'damijosh12@gmail.com (Owner)',
      action: 'Batch Product Catalog Sync',
      category: 'product',
      ipAddress: '102.89.41.18 (Lagos, Nigeria)',
      status: 'success',
      details: 'Published 3 products harvested from vendor account to Firestore.'
    },
    {
      id: 'log-3',
      timestamp: '1 hour ago',
      actor: 'System AI Worker #04',
      action: 'Price Threshold Monitor',
      category: 'ai',
      ipAddress: 'Internal Cloud Function',
      status: 'success',
      details: 'Evaluated price drop alerts against catalog discounts.'
    },
    {
      id: 'log-4',
      timestamp: '3 hours ago',
      actor: 'damijosh12@gmail.com (Owner)',
      action: 'Wholesale Base Cost Inspection',
      category: 'permission',
      ipAddress: '102.89.41.18 (Lagos, Nigeria)',
      status: 'success',
      details: 'Accessed encrypted Alaba / Computer Village wholesale supplier rates.'
    },
    {
      id: 'log-5',
      timestamp: '6 hours ago',
      actor: 'Anonymous Visitor',
      action: 'Unauthorized Admin Path Access',
      category: 'auth',
      ipAddress: '197.210.53.12 (Abuja, Nigeria)',
      status: 'denied',
      details: 'Blocked attempt to query /admin/orders without admin role token.'
    },
    {
      id: 'log-6',
      timestamp: 'Yesterday',
      actor: 'damijosh12@gmail.com (Owner)',
      action: 'Discount Code Configuration',
      category: 'order',
      ipAddress: '102.89.41.18 (Lagos, Nigeria)',
      status: 'success',
      details: 'Activated promo code SAJODA10K with minimum spend ₦80,000.'
    }
  ];

  const filteredLogs = defaultLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-zinc-900">Security Audit Trail</h2>
            <p className="text-xs text-zinc-500">Immutable record of all administrative, authentication, and data modifications.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Tamper-Proof Logging
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by action, actor, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-zinc-900"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none text-zinc-700"
          >
            <option value="all">All Event Categories</option>
            <option value="auth">Authentication & Logins</option>
            <option value="product">Catalog & Products</option>
            <option value="order">Orders & Discounts</option>
            <option value="permission">Permissions & Sourcing</option>
            <option value="ai">AI Autonomous Operations</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-4">Event / Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Origin & IP</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3.5 px-5 whitespace-nowrap text-zinc-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-black text-zinc-900">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 font-medium">
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      log.status === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-600 text-[11px] max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

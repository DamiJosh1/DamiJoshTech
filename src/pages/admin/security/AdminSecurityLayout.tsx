import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Shield, Activity, Users, Lock, Key, Link, Database, HardDrive, RefreshCw, Bot, Bell } from 'lucide-react';

export default function AdminSecurityLayout() {
  const tabs = [
    { name: 'Overview', path: '/admin/security', icon: <Shield className="w-4 h-4" />, end: true },
    { name: 'Alerts', path: '/admin/security/alerts', icon: <Bell className="w-4 h-4" /> },
    { name: 'Activity', path: '/admin/security/activity', icon: <Activity className="w-4 h-4" /> },
    { name: 'Sessions', path: '/admin/security/sessions', icon: <Users className="w-4 h-4" /> },
    { name: 'Audit Log', path: '/admin/security/audit-log', icon: <Lock className="w-4 h-4" /> },
    { name: 'Permissions', path: '/admin/security/permissions', icon: <Key className="w-4 h-4" /> },
    { name: 'API Security', path: '/admin/security/api', icon: <Link className="w-4 h-4" /> },
    { name: 'System Health', path: '/admin/security/system-health', icon: <Database className="w-4 h-4" /> },
    { name: 'Backups', path: '/admin/security/backups', icon: <HardDrive className="w-4 h-4" /> },
    { name: 'Recovery', path: '/admin/security/recovery', icon: <RefreshCw className="w-4 h-4" /> },
    { name: 'AI Safety', path: '/admin/security/ai-safety', icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">SAJODA SECURITY CENTER</h1>
          <p className="text-sm text-zinc-500">Protect your store, data, integrations and AI operations.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide border-b border-zinc-200">
        {tabs.map(tab => (
          <NavLink
            key={tab.name}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) => `
              flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors
              ${isActive 
                ? 'bg-white text-indigo-600 border-t border-l border-r border-zinc-200 -mb-[1px]' 
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 border border-transparent'}
            `}
          >
            {tab.icon}
            {tab.name}
          </NavLink>
        ))}
      </div>

      <div className="bg-transparent rounded-xl">
        <Outlet />
      </div>
    </div>
  );
}

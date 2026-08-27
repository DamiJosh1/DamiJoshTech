import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { MessageSquare, Inbox, Ticket, Users, Bot, FileText, Zap, BarChart3, Search, Settings } from 'lucide-react';

export default function AdminSupportLayout() {
  const { pathname } = useLocation();

  const tabs = [
    { name: 'Overview', path: '/admin/support', icon: <MessageSquare className="w-4 h-4" />, end: true },
    { name: 'Inbox', path: '/admin/support/inbox', icon: <Inbox className="w-4 h-4" /> },
    { name: 'Tickets', path: '/admin/support/tickets', icon: <Ticket className="w-4 h-4" /> },
    { name: 'Customers', path: '/admin/support/customers', icon: <Users className="w-4 h-4" /> },
    { name: 'AI Support', path: '/admin/support/ai', icon: <Bot className="w-4 h-4" /> },
    { name: 'Macros', path: '/admin/support/macros', icon: <FileText className="w-4 h-4" /> },
    { name: 'Automation', path: '/admin/support/automation', icon: <Zap className="w-4 h-4" /> },
    { name: 'Analytics', path: '/admin/support/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">SAJODA SUPPORT CENTER</h1>
          <p className="text-sm text-zinc-500">Manage customer conversations, orders and support operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search support..."
              className="pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-50">
            <Settings className="w-4 h-4" />
          </button>
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

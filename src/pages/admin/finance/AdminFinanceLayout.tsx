import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Activity, DollarSign, TrendingUp, CreditCard, ShoppingCart, RefreshCcw, Send, FileText, Bot, Settings, Calendar } from 'lucide-react';

export default function AdminFinanceLayout() {
  const tabs = [
    { name: 'Overview', path: '/admin/finance', icon: <Activity className="w-4 h-4" />, end: true },
    { name: 'Revenue', path: '/admin/finance/revenue', icon: <DollarSign className="w-4 h-4" /> },
    { name: 'Profit', path: '/admin/finance/profit', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Expenses', path: '/admin/finance/expenses', icon: <CreditCard className="w-4 h-4" /> },
    { name: 'Costs', path: '/admin/finance/costs', icon: <ShoppingCart className="w-4 h-4" /> },
    { name: 'Refunds', path: '/admin/finance/refunds', icon: <RefreshCcw className="w-4 h-4" /> },
    { name: 'Payouts', path: '/admin/finance/payouts', icon: <Send className="w-4 h-4" /> },
    { name: 'Reports', path: '/admin/finance/reports', icon: <FileText className="w-4 h-4" /> },
    { name: 'AI Analyst', path: '/admin/finance/ai', icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">SAJODA FINANCE</h1>
          <p className="text-sm text-zinc-500">Understand revenue, costs, profit and business performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <select className="pl-9 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
              <option>Today</option>
              <option>Yesterday</option>
              <option>7 Days</option>
              <option selected>30 Days</option>
              <option>90 Days</option>
              <option>12 Months</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
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

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Cpu, ShieldCheck } from 'lucide-react';
import { 
  Bot, CheckSquare, Search, TrendingUp, Map, CheckCircle, Activity, 
  Settings, DollarSign, BarChart2, Truck, Brain, Eye, FileText, 
  PenTool, FileEdit, Send, ShoppingBag, Package, MapPin, 
  AlertTriangle, MessageSquare, Target, Globe, Crosshair, 
  Megaphone, BarChart3, Users, Zap, Shield
} from 'lucide-react';

export default function AdminAiLayout() {
    const tabs = [
    { name: 'Command Center', path: '/admin/ai', icon: <Bot className="w-4 h-4" />, end: true },
    { name: 'Tasks', path: '/admin/ai/tasks', icon: <Activity className="w-4 h-4" /> },
    { name: 'Approvals', path: '/admin/ai/approvals', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Products', path: '/admin/ai/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Trends', path: '/admin/ai/trends', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Markets', path: '/admin/ai/markets', icon: <Globe className="w-4 h-4" /> },
    { name: 'Marketing', path: '/admin/ai/marketing', icon: <Zap className="w-4 h-4" /> },
    { name: 'Support', path: '/admin/ai/support', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Business', path: '/admin/ai/business', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Workers', path: '/admin/ai/workers', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Settings', path: '/admin/ai/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-600" /> 
            SAJODA AI WORKER
          </h1>
          <p className="text-zinc-500">Your intelligent commerce operations assistant.</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-zinc-200">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                ${isActive ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}
              `}
            >
              {tab.icon}
              {tab.name}
            </NavLink>
          ))}
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

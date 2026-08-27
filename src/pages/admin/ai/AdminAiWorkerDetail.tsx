import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bot, Pause, Settings, Activity, CheckCircle, AlertTriangle, List } from 'lucide-react';

export default function AdminAiWorkerDetail() {
  const { id } = useParams();

  // Mock data for worker
  const workerName = id === 'discovery' ? 'Product Discovery' : 
                     id === 'builder' ? 'Product Builder' : 
                     id === 'orders' ? 'Order Operations' : 
                     'Worker ' + id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/admin/ai/workers" className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            {workerName}
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full tracking-wider">ONLINE</span>
          </h2>
          <p className="text-sm text-zinc-500">Worker ID: {id}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-medium text-sm hover:bg-amber-100 transition-colors flex items-center gap-2">
            <Pause className="w-4 h-4" /> PAUSE
          </button>
          <button className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium text-sm transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" /> CONFIGURE
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Tasks */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <List className="w-5 h-5 text-indigo-500" /> 
                Recent Tasks
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Scan AliExpress for trending electronics</p>
                    <p className="text-xs text-zinc-500">Completed in 45s</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-zinc-500">10 mins ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Check competitor pricing for SKU WE-001</p>
                    <p className="text-xs text-red-600">Failed: API Timeout</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-zinc-500">1 hour ago</span>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-500" /> 
              Capabilities & Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-zinc-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-zinc-900">Search CJ Dropshipping</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">PREPARE</span>
                </div>
                <p className="text-xs text-zinc-500">Find products and add them to the import queue.</p>
              </div>
              <div className="p-4 border border-zinc-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-zinc-900">Create Product Drafts</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">APPROVAL REQ</span>
                </div>
                <p className="text-xs text-zinc-500">Generate SEO titles, descriptions and set pricing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">Worker Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-500">Success Rate</span>
                  <span className="font-bold text-zinc-900">98.2%</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98.2%' }}></div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Tasks Today</span>
                <span className="font-bold text-zinc-900">42</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Avg Duration</span>
                <span className="font-bold text-zinc-900">12.5s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Cost (Est)</span>
                <span className="font-bold text-zinc-900">$0.45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

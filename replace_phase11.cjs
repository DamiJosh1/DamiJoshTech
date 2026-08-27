const fs = require('fs');

function writePage(name, content) {
    fs.writeFileSync(`src/pages/admin/ai/${name}.tsx`, content);
}

writePage('AdminAiDashboard', `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, CheckCircle2, AlertCircle, Clock, Zap, Shield, 
  Activity, CheckSquare, Search, FileEdit, Truck, TrendingUp, AlertTriangle
} from 'lucide-react';

export default function AdminAiDashboard() {
  const [globalStatus, setGlobalStatus] = useState('ONLINE'); // ONLINE, ASSISTED, MONITOR ONLY

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">SAJODA AI COMMAND CENTER</h1>
          <p className="text-zinc-500">Your intelligent operations layer for products, orders, marketing and growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg">
            <span className="text-xs font-semibold text-zinc-500">GLOBAL AI MODE:</span>
            <select 
              value={globalStatus}
              onChange={(e) => setGlobalStatus(e.target.value)}
              className="text-sm font-bold text-emerald-600 bg-transparent focus:outline-none"
            >
              <option value="MONITOR ONLY">MONITOR ONLY</option>
              <option value="ASSISTED">ASSISTED</option>
              <option value="APPROVAL REQUIRED">APPROVAL REQUIRED</option>
              <option value="ONLINE">ONLINE (AUTO)</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            EMERGENCY STOP
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">ACTIVE WORKERS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-zinc-900">8</p>
            <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">RUNNING TASKS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-zinc-900">3</p>
            <Activity className="w-4 h-4 text-blue-500 mb-1.5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">PENDING APPROVALS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-zinc-900">12</p>
            <Shield className="w-4 h-4 text-amber-500 mb-1.5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">COMPLETED TASKS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-zinc-900">145</p>
            <CheckSquare className="w-4 h-4 text-zinc-400 mb-1.5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">FAILED TASKS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-red-600">2</p>
            <AlertCircle className="w-4 h-4 text-red-400 mb-1.5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">AUTOMATIONS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-zinc-900">5</p>
            <Zap className="w-4 h-4 text-indigo-500 mb-1.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - What should I do */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 text-white shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-300" />
              WHAT SHOULD I DO NOW?
            </h3>
            <div className="space-y-3">
              <Link to="/admin/ai/approvals" className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Review 12 Pending Approvals</h4>
                    <p className="text-sm text-purple-200 mt-1">AI has prepared 12 product drafts and 1 pricing adjustment that require your approval before execution.</p>
                  </div>
                </div>
              </Link>
              <Link to="/admin/ai/issues" className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Address 2 Fulfillment Failures</h4>
                    <p className="text-sm text-purple-200 mt-1">The Fulfillment Monitor worker encountered errors with supplier sync on 2 recent orders.</p>
                  </div>
                </div>
              </Link>
              <Link to="/admin/ai/trends" className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Review New Trend Alert</h4>
                    <p className="text-sm text-purple-200 mt-1">Trend Intelligence has detected a spike in "Smart Kitchen" accessories with high margin potential.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-zinc-400" /> 
              SAJODA AI DAILY BRIEF
            </h3>
            <div className="space-y-4">
              <div className="pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-sm text-zinc-900">ORDERS & SHIPPING</span>
                </div>
                <p className="text-sm text-zinc-600">Processed 42 orders automatically today. 38 successfully synced to CJ Dropshipping. 4 flagged for manual review due to missing address data. 15 tracking numbers updated.</p>
              </div>
              <div className="pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-sm text-zinc-900">PRODUCTS</span>
                </div>
                <p className="text-sm text-zinc-600">Product Discovery scanned 1,200 supplier items. Found 12 matching your minimum margin rule (>20%). 8 drafts prepared and waiting in the Approval Queue.</p>
              </div>
              <div className="pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-sm text-zinc-900">MARKETING</span>
                </div>
                <p className="text-sm text-zinc-600">Automated "Summer Tech" campaign generated. SEO descriptions updated for 24 products based on new keyword volume.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Status & Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
              SYSTEM HEALTH
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">AI Core Engine</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">CJ Integration</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">Store Database</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">Marketing APIs</span>
                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-xs font-bold rounded">NOT CONFIGURED</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
              RUN HEALTH CHECK
            </button>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-zinc-400" /> 
                LIVE ACTIVITY
              </h3>
              <Link to="/admin/ai/activity" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">Order Worker</p>
                  <p className="text-xs text-zinc-500">Syncing order #1042 to supplier.</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Just now</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">Product Builder</p>
                  <p className="text-xs text-zinc-500">Requested approval to publish 3 products.</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">5 mins ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">Trend Intelligence</p>
                  <p className="text-xs text-zinc-500">Completed daily market scan.</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">14 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

writePage('AdminAiWorkers', `import React from 'react';
import { Bot, Pause, Settings, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const WORKERS = [
  { id: 'discovery', name: 'Product Discovery', status: 'ONLINE', task: 'Idle', completed: 42, failed: 0 },
  { id: 'builder', name: 'Product Builder', status: 'ONLINE', task: 'Drafting items', completed: 18, failed: 1 },
  { id: 'pricing', name: 'Pricing Intelligence', status: 'ONLINE', task: 'Idle', completed: 120, failed: 0 },
  { id: 'orders', name: 'Order Operations', status: 'ONLINE', task: 'Monitoring 142 orders', completed: 85, failed: 2 },
  { id: 'fulfillment', name: 'Fulfillment Monitor', status: 'ONLINE', task: 'Idle', completed: 64, failed: 0 },
  { id: 'shipping', name: 'Shipping Monitor', status: 'ONLINE', task: 'Tracking 54 shipments', completed: 210, failed: 0 },
  { id: 'marketing', name: 'Marketing Worker', status: 'PAUSED', task: 'Paused by admin', completed: 12, failed: 0 },
  { id: 'trends', name: 'Trend Intelligence', status: 'WORKING', task: 'Scanning US market', completed: 34, failed: 0 },
];

export default function AdminAiWorkers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Workers</h2>
          <p className="text-sm text-zinc-500">Manage and orchestrate SAJODA AI operational units.</p>
        </div>
        <button className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors flex items-center gap-2">
          <Pause className="w-4 h-4" /> PAUSE ALL
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {WORKERS.map(worker => (
          <div key={worker.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <span className={\`px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wider \${
                worker.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700' : 
                worker.status === 'WORKING' ? 'bg-blue-50 text-blue-700' :
                'bg-amber-50 text-amber-700'
              }\`}>
                {worker.status}
              </span>
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">{worker.name}</h3>
            <p className="text-xs text-zinc-500 mb-4 flex-1">Current: {worker.task}</p>
            
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-4 px-2 py-2 bg-zinc-50 rounded-lg">
              <span className="font-medium text-emerald-600">{worker.completed} Done</span>
              {worker.failed > 0 ? (
                <span className="font-medium text-red-600">{worker.failed} Failed</span>
              ) : (
                <span>0 Failed</span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-100">
              <Link to={\`/admin/ai/workers/\${worker.id}\`} className="flex-1 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded text-center transition-colors">
                OPEN
              </Link>
              {worker.status === 'PAUSED' ? (
                <button className="p-1.5 text-zinc-400 hover:text-emerald-600 transition-colors" title="Resume Worker">
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button className="p-1.5 text-zinc-400 hover:text-amber-600 transition-colors" title="Pause Worker">
                  <Pause className="w-4 h-4" />
                </button>
              )}
              <button className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

writePage('AdminAiTasks', `import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminAiTasks() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Tasks</h2>
          <p className="text-sm text-zinc-500">Monitor all queued, active, and completed AI operations.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search tasks by ID, product, or worker..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Task</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Worker</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Started</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Duration</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-sm text-zinc-900">PRODUCT_IMPORT</div>
                  <div className="text-xs text-zinc-500">CJ_12948120</div>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-700">Product Builder</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded">WAITING_APPROVAL</span>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-600">10 mins ago</td>
                <td className="py-3 px-4 text-sm text-zinc-600">45s</td>
                <td className="py-3 px-4 text-right">
                  <Link to="/admin/ai/task/TASK-912" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View</Link>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-sm text-zinc-900">ORDER_SYNC</div>
                  <div className="text-xs text-zinc-500">Order #1042</div>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-700">Order Operations</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">COMPLETED</span>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-600">1 hour ago</td>
                <td className="py-3 px-4 text-sm text-zinc-600">2s</td>
                <td className="py-3 px-4 text-right">
                  <Link to="/admin/ai/task/TASK-911" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View</Link>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-sm text-zinc-900">MARKET_RESEARCH</div>
                  <div className="text-xs text-zinc-500">UK Smart Home</div>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-700">Trend Intelligence</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">RUNNING</span>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-600">Just now</td>
                <td className="py-3 px-4 text-sm text-zinc-600">-</td>
                <td className="py-3 px-4 text-right">
                  <Link to="/admin/ai/task/TASK-910" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View</Link>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-sm text-zinc-900">PRICE_ANALYSIS</div>
                  <div className="text-xs text-zinc-500">LED Desk Lamp</div>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-700">Pricing Intelligence</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">FAILED</span>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-600">2 hours ago</td>
                <td className="py-3 px-4 text-sm text-zinc-600">12s</td>
                <td className="py-3 px-4 text-right">
                  <Link to="/admin/ai/task/TASK-909" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`);

writePage('AdminAiApprovals', `import React from 'react';
import { Shield, Check, X, Eye } from 'lucide-react';

export default function AdminAiApprovals() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Approval Queue</h2>
          <p className="text-sm text-zinc-500">Review and authorize sensitive actions prepared by AI workers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Approval Card 1 */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider">High Priority</span>
                <span className="text-sm text-zinc-500">Product Builder</span>
                <span className="text-sm text-zinc-300">•</span>
                <span className="text-sm text-zinc-500">10 mins ago</span>
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-1">PUBLISH PRODUCT</h3>
              <p className="text-sm font-medium text-zinc-700 mb-3">Smart Ergonomic Office Chair</p>
              
              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100 mb-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">AI DECISION SUMMARY</p>
                <p className="text-sm text-zinc-700"><span className="font-medium text-zinc-900">What AI Found:</span> High demand signal in EU market. Supplier margin is 45%.</p>
                <p className="text-sm text-zinc-700"><span className="font-medium text-zinc-900">Action:</span> Draft created, SEO tags applied, price set to $199.99.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 md:w-32 justify-center shrink-0">
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> APPROVE
              </button>
              <button className="w-full py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                <Eye className="w-4 h-4" /> REVIEW
              </button>
              <button className="w-full py-2 bg-white hover:bg-red-50 border border-zinc-200 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                <X className="w-4 h-4" /> REJECT
              </button>
            </div>
          </div>
        </div>

        {/* Approval Card 2 */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase tracking-wider">Normal</span>
                <span className="text-sm text-zinc-500">Pricing Intelligence</span>
                <span className="text-sm text-zinc-300">•</span>
                <span className="text-sm text-zinc-500">2 hours ago</span>
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-1">CHANGE PRICE</h3>
              <p className="text-sm font-medium text-zinc-700 mb-3">Wireless Earbuds Pro (SKU: WE-001)</p>
              
              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100 mb-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">AI DECISION SUMMARY</p>
                <p className="text-sm text-zinc-700"><span className="font-medium text-zinc-900">What AI Found:</span> Supplier price increased by $2.00.</p>
                <p className="text-sm text-zinc-700"><span className="font-medium text-zinc-900">Action:</span> Recommend increasing retail price from $49.99 to $54.99 to protect margin.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 md:w-32 justify-center shrink-0">
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> APPROVE
              </button>
              <button className="w-full py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                <Eye className="w-4 h-4" /> REVIEW
              </button>
              <button className="w-full py-2 bg-white hover:bg-red-50 border border-zinc-200 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                <X className="w-4 h-4" /> REJECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

writePage('AdminAiActivity', `import React from 'react';
import { Activity, Clock } from 'lucide-react';

export default function AdminAiActivity() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Activity Stream</h2>
          <p className="text-sm text-zinc-500">Live timeline of all AI actions, decisions, and system events.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="relative border-l border-zinc-200 ml-3 space-y-8 pb-4">
          
          <div className="relative pl-6">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white"></div>
            <div>
              <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Just now • Order Operations</p>
              <p className="text-sm font-medium text-zinc-900">Synced Order #1042 to CJ Dropshipping successfully.</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-amber-500 rounded-full ring-4 ring-white"></div>
            <div>
              <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 10 mins ago • Product Builder</p>
              <p className="text-sm font-medium text-zinc-900">Created draft for "Smart Ergonomic Chair" and requested approval.</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-white"></div>
            <div>
              <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 45 mins ago • Product Discovery</p>
              <p className="text-sm font-medium text-zinc-900">Completed daily scan of "Electronics" category. Found 3 opportunities.</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-red-500 rounded-full ring-4 ring-white"></div>
            <div>
              <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 hours ago • Pricing Intelligence</p>
              <p className="text-sm font-medium text-zinc-900">Failed to analyze competitor pricing for SKU WE-001 (Timeout).</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-zinc-300 rounded-full ring-4 ring-white"></div>
            <div>
              <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 5 hours ago • System</p>
              <p className="text-sm font-medium text-zinc-900">Admin activated GLOBAL AI MODE: ONLINE (AUTO).</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
`);

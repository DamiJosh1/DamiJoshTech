const fs = require('fs');

function writePage(name, content) {
    fs.writeFileSync(`src/pages/admin/ai/${name}.tsx`, content);
}

writePage('AdminAiMarketing', `import React from 'react';
import { Target, TrendingUp, BarChart2 } from 'lucide-react';

export default function AdminAiMarketing() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Marketing Center</h2>
          <p className="text-sm text-zinc-500">Discover opportunities, create campaigns and understand what is driving growth.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-zinc-500">Active Campaigns</span>
          <span className="text-2xl font-bold text-zinc-900 mt-2">UNKNOWN</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-zinc-500">Marketing Spend</span>
          <span className="text-2xl font-bold text-zinc-900 mt-2">UNKNOWN</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-zinc-500">Revenue Attributed</span>
          <span className="text-2xl font-bold text-zinc-900 mt-2">UNKNOWN</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-zinc-500">Conversion Rate</span>
          <span className="text-2xl font-bold text-zinc-900 mt-2">UNKNOWN</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" /> TODAY'S GROWTH BRIEF
        </h3>
        <div className="space-y-3">
          <p className="text-sm text-zinc-700 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
            "Your Smart Living category is receiving increased interest."
          </p>
          <p className="text-sm text-zinc-700 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
            "Two products have strong margin and growing demand signals."
          </p>
          <p className="text-sm text-zinc-700 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
            "One campaign is underperforming."
          </p>
        </div>
      </div>
    </div>
  );
}
`);

writePage('AdminAiMarketResearch', `import React from 'react';
import { Globe } from 'lucide-react';

export default function AdminAiMarketResearch() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Market Research</h2>
          <p className="text-sm text-zinc-500">Analyze product and category opportunities across different countries.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <Globe className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Insufficient Market Data</h3>
        <p className="mb-4">Select a product and country to begin market research analysis.</p>
      </div>
    </div>
  );
}
`);

writePage('AdminAiCompetitors', `import React from 'react';
import { Crosshair } from 'lucide-react';

export default function AdminAiCompetitors() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Competitor Intelligence</h2>
          <p className="text-sm text-zinc-500">Understand the market without copying competitors.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <Crosshair className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">No Competitors Tracked</h3>
        <p className="mb-4">Add a competitor URL to analyze their public pricing, positioning, and features.</p>
      </div>
    </div>
  );
}
`);

writePage('AdminAiCampaigns', `import React from 'react';
import { Megaphone } from 'lucide-react';

export default function AdminAiCampaigns() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Campaign Builder</h2>
          <p className="text-sm text-zinc-500">Prepare marketing campaigns across multiple channels.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <Megaphone className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">No Active Campaigns</h3>
        <p className="mb-4">Start a new campaign draft and let AI prepare the objective, targeting, and content.</p>
      </div>
    </div>
  );
}
`);

writePage('AdminAiMarketingAnalytics', `import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AdminAiMarketingAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Marketing Analytics</h2>
          <p className="text-sm text-zinc-500">Track campaign performance, conversion rates, and revenue attribution.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <BarChart3 className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Not Connected</h3>
        <p className="mb-4">Marketing data is unavailable. Connect advertising platforms to view analytics.</p>
      </div>
    </div>
  );
}
`);

writePage('AdminAiGrowth', `import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function AdminAiGrowth() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Growth Center</h2>
          <p className="text-sm text-zinc-500">Discover revenue-driving opportunities based on store data.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <TrendingUp className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Growth Opportunities</h3>
        <p className="mb-4">AI will surface high-margin products with low traffic and other growth signals here.</p>
      </div>
    </div>
  );
}
`);

writePage('AdminAiWorkers', `import React from 'react';
import { Bot, Play, Pause, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const WORKERS = [
  { id: 'discovery', name: 'Product Discovery', status: 'ONLINE', task: 'Idle' },
  { id: 'builder', name: 'Product Builder', status: 'ONLINE', task: 'Idle' },
  { id: 'pricing', name: 'Pricing Intelligence', status: 'ONLINE', task: 'Idle' },
  { id: 'orders', name: 'Order Operations', status: 'ONLINE', task: 'Monitoring 142 orders' },
  { id: 'fulfillment', name: 'Fulfillment Monitor', status: 'ONLINE', task: 'Idle' },
  { id: 'shipping', name: 'Shipping Monitor', status: 'ONLINE', task: 'Tracking 54 shipments' },
  { id: 'marketing', name: 'Marketing Worker', status: 'ONLINE', task: 'Idle' },
  { id: 'trends', name: 'Trend Intelligence', status: 'ONLINE', task: 'Scanning...' },
];

export default function AdminAiWorkers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Workers</h2>
          <p className="text-sm text-zinc-500">Manage and orchestrate SAJODA AI operational units.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {WORKERS.map(worker => (
          <div key={worker.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full tracking-wider">
                {worker.status}
              </span>
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">{worker.name}</h3>
            <p className="text-xs text-zinc-500 mb-4 flex-1">Current: {worker.task}</p>
            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-100">
              <Link to={\`/admin/ai/workers/\${worker.id}\`} className="flex-1 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded text-center transition-colors">
                OPEN
              </Link>
              <button className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors" title="Pause Worker">
                <Pause className="w-4 h-4" />
              </button>
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

writePage('AdminAiWorkerDetail', `import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bot, Pause, Settings, Activity } from 'lucide-react';

export default function AdminAiWorkerDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/admin/ai/workers" className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            Worker Intelligence Detail
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full tracking-wider">ONLINE</span>
          </h2>
          <p className="text-sm text-zinc-500">Worker: {id}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1.5 border border-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-50 font-medium text-xs transition-colors flex items-center gap-2">
            <Pause className="w-3.5 h-3.5" /> PAUSE
          </button>
          <button className="px-3 py-1.5 border border-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-50 font-medium text-xs transition-colors flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" /> SETTINGS
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <Activity className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Recent Activity</h3>
        <p className="mb-4">This worker is currently idle and has no recent task executions to display.</p>
      </div>
    </div>
  );
}
`);

writePage('AdminAiMemory', `import React from 'react';
import { Brain, Plus } from 'lucide-react';

export default function AdminAiMemory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Business Memory</h2>
          <p className="text-sm text-zinc-500">Define critical business rules, preferences, and operating guidelines for AI.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> CREATE BUSINESS RULE
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rule Name</th>
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</th>
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            <tr>
              <td className="py-4 px-4">
                <span className="font-medium text-zinc-900">Minimum Margin Protection</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-zinc-600">Do not publish products with less than 20% estimated margin.</span>
              </td>
              <td className="py-4 px-4">
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">CRITICAL</span>
              </td>
              <td className="py-4 px-4">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">ACTIVE</span>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-4">
                <span className="font-medium text-zinc-900">Supplier Description Rewrite</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-zinc-600">Never publish supplier descriptions without rewriting them.</span>
              </td>
              <td className="py-4 px-4">
                <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded">HIGH</span>
              </td>
              <td className="py-4 px-4">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">ACTIVE</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

writePage('AdminAiAutomations', `import React from 'react';
import { Zap, Plus, AlertTriangle } from 'lucide-react';

export default function AdminAiAutomations() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Automations</h2>
          <p className="text-sm text-zinc-500">Configure triggers, conditions, and automated background AI workflows.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> PAUSE ALL
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> CREATE AUTOMATION
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <Zap className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">No Automations Configured</h3>
        <p className="mb-4">Create automated rules to let AI monitor operations and trigger actions automatically.</p>
      </div>
    </div>
  );
}
`);

writePage('AdminAiPermissions', `import React from 'react';
import { Shield, Lock } from 'lucide-react';

export default function AdminAiPermissions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Permissions & Safety</h2>
          <p className="text-sm text-zinc-500">Control what AI is authorized to view, prepare, and execute.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Worker / Action</th>
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Permission Level</th>
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Admin Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            <tr>
              <td className="py-4 px-4 font-medium text-zinc-900">Product Worker: Create Draft</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">PREPARE</span></td>
              <td className="py-4 px-4"><span className="text-sm text-zinc-500">NO APPROVAL REQUIRED</span></td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium text-zinc-900">Product Worker: Publish Product</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">EXECUTE</span></td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded flex items-center gap-1 w-max"><Lock className="w-3 h-3" /> YES</span></td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium text-zinc-900">Order Worker: Monitor Orders</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-zinc-100 text-zinc-700 text-xs font-medium rounded">READ ONLY</span></td>
              <td className="py-4 px-4"><span className="text-sm text-zinc-500">NO APPROVAL REQUIRED</span></td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium text-zinc-900">Order Worker: Fulfill Order</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">EXECUTE</span></td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded flex items-center gap-1 w-max"><Lock className="w-3 h-3" /> YES</span></td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-medium text-zinc-900">Marketing Worker: Launch Paid Ad</td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">EXECUTE</span></td>
              <td className="py-4 px-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded flex items-center gap-1 w-max"><Lock className="w-3 h-3" /> YES</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

writePage('AdminAiTaskDetail', `import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Clock } from 'lucide-react';

export default function AdminAiTaskDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/admin/ai/tasks" className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            Task Intelligence Detail
            <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-[10px] font-bold rounded-full tracking-wider">COMPLETED</span>
          </h2>
          <p className="text-sm text-zinc-500">Task: {id}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <CheckSquare className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Task Details</h3>
        <p className="mb-4">Task execution log and outputs will appear here.</p>
      </div>
    </div>
  );
}
`);

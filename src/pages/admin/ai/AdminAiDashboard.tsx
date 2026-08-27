import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, CheckCircle2, AlertCircle, Clock, Zap, Shield, 
  Activity, CheckSquare, Search, Truck, TrendingUp, AlertTriangle
} from 'lucide-react';
import { AIOrchestrator, AIWorker, AITask, AIApproval } from '../../../services/aiOrchestrator';

export default function AdminAiDashboard() {
  const [globalStatus, setGlobalStatus] = useState('ONLINE');
  const [workers, setWorkers] = useState<AIWorker[]>([]);
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [approvals, setApprovals] = useState<AIApproval[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const unsub1 = AIOrchestrator.subscribeToWorkers(setWorkers);
    const unsub2 = AIOrchestrator.subscribeToTasks(setTasks);
    const unsub3 = AIOrchestrator.subscribeToApprovals(setApprovals);
    const unsub4 = AIOrchestrator.subscribeToActivity(setActivities);
    
    return () => {
        unsub1();
        unsub2();
        unsub3();
        unsub4();
    }
  }, []);

  const handleModeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const mode = e.target.value;
      setGlobalStatus(mode);
      await AIOrchestrator.setGlobalMode(mode);
  }

  const activeWorkersCount = workers.filter(w => w.status === 'ONLINE' || w.status === 'WORKING').length;
  const runningTasksCount = tasks.filter(t => t.status === 'RUNNING').length;
  const completedTasksCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const failedTasksCount = tasks.filter(t => t.status === 'FAILED').length;

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
              onChange={handleModeChange}
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
            <p className="text-2xl font-bold text-zinc-900">{activeWorkersCount}</p>
            <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">RUNNING TASKS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-zinc-900">{runningTasksCount}</p>
            <Activity className="w-4 h-4 text-blue-500 mb-1.5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">PENDING APPROVALS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-zinc-900">{approvals.length}</p>
            <Shield className="w-4 h-4 text-amber-500 mb-1.5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">COMPLETED TASKS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-zinc-900">{completedTasksCount}</p>
            <CheckSquare className="w-4 h-4 text-zinc-400 mb-1.5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-zinc-500 mb-1">FAILED TASKS</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-red-600">{failedTasksCount}</p>
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
              {approvals.length > 0 && (
              <Link to="/admin/ai/approvals" className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Review {approvals.length} Pending Approvals</h4>
                    <p className="text-sm text-purple-200 mt-1">AI has prepared actions that require your approval before execution.</p>
                  </div>
                </div>
              </Link>
              )}
              {failedTasksCount > 0 && (
              <Link to="/admin/ai/tasks" className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Address {failedTasksCount} Failures</h4>
                    <p className="text-sm text-purple-200 mt-1">Some background workers encountered errors.</p>
                  </div>
                </div>
              </Link>
              )}
              <Link to="/admin/ai/trends" className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                    !
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Review New Trend Alert</h4>
                    <p className="text-sm text-purple-200 mt-1">Trend Intelligence has detected a spike in "Smart Kitchen" accessories.</p>
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
                <p className="text-sm text-zinc-600">Product Discovery scanned 1,200 supplier items. Found 12 matching your minimum margin rule (&gt;20%). 8 drafts prepared and waiting in the Approval Queue.</p>
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
              {activities.slice(0, 4).map((act, i) => (
              <div key={act.id || i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    act.color === 'blue' ? 'bg-blue-500' :
                    act.color === 'emerald' ? 'bg-emerald-500' :
                    act.color === 'amber' ? 'bg-amber-500' :
                    act.color === 'red' ? 'bg-red-500' :
                    'bg-zinc-300'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{act.workerId}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2">{act.message}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                      {act.createdAt?.seconds ? new Date(act.createdAt.seconds * 1000).toLocaleTimeString() : 'Just now'}
                  </p>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const fs = require('fs');

function writePage(name, content) {
    fs.writeFileSync(`src/pages/admin/ai/${name}.tsx`, content);
}

writePage('AdminAiWorkers', `import React, { useEffect, useState } from 'react';
import { Bot, Pause, Settings, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIOrchestrator, AIWorker } from '../../../services/aiOrchestrator';

export default function AdminAiWorkers() {
  const [workers, setWorkers] = useState<AIWorker[]>([]);

  useEffect(() => {
    const unsubscribe = AIOrchestrator.subscribeToWorkers(setWorkers);
    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (worker: AIWorker) => {
    const newStatus = worker.status === 'PAUSED' ? 'ONLINE' : 'PAUSED';
    await AIOrchestrator.updateWorkerStatus(worker.id, newStatus, worker.currentTask);
  };

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
        {workers.length === 0 && (
            <div className="col-span-full py-8 text-center text-zinc-500">
                Loading workers...
            </div>
        )}
        {workers.map(worker => (
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
            <p className="text-xs text-zinc-500 mb-4 flex-1">Current: {worker.currentTask}</p>
            
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-4 px-2 py-2 bg-zinc-50 rounded-lg">
              <span className="font-medium text-emerald-600">{worker.completedTasks} Done</span>
              {worker.failedTasks > 0 ? (
                <span className="font-medium text-red-600">{worker.failedTasks} Failed</span>
              ) : (
                <span>0 Failed</span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-100">
              <Link to={\`/admin/ai/workers/\${worker.id}\`} className="flex-1 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded text-center transition-colors">
                OPEN
              </Link>
              {worker.status === 'PAUSED' ? (
                <button onClick={() => handleToggleStatus(worker)} className="p-1.5 text-zinc-400 hover:text-emerald-600 transition-colors" title="Resume Worker">
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => handleToggleStatus(worker)} className="p-1.5 text-zinc-400 hover:text-amber-600 transition-colors" title="Pause Worker">
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

writePage('AdminAiApprovals', `import React, { useEffect, useState } from 'react';
import { Shield, Check, X, Eye, Loader2 } from 'lucide-react';
import { AIOrchestrator, AIApproval } from '../../../services/aiOrchestrator';

export default function AdminAiApprovals() {
  const [approvals, setApprovals] = useState<AIApproval[]>([]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = AIOrchestrator.subscribeToApprovals(setApprovals);
    return () => unsubscribe();
  }, []);

  const handleProcess = async (approval: AIApproval, approved: boolean) => {
    setLoadingIds(prev => new Set(prev).add(approval.id));
    try {
        await AIOrchestrator.processApproval(approval.id, approval.taskId, approved);
    } catch(e) {
        console.error(e);
    } finally {
        setLoadingIds(prev => {
            const next = new Set(prev);
            next.delete(approval.id);
            return next;
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Approval Queue</h2>
          <p className="text-sm text-zinc-500">Review and authorize sensitive actions prepared by AI workers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {approvals.length === 0 && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-12 text-center text-zinc-500">
                <Shield className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 mb-1">Queue is empty</h3>
                <p>There are no pending approvals required.</p>
            </div>
        )}
        
        {approvals.map(approval => (
        <div key={approval.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={\`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider \${
                    approval.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    approval.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                }\`}>
                    {approval.priority}
                </span>
                <span className="text-sm text-zinc-500">{approval.workerId}</span>
                <span className="text-sm text-zinc-300">•</span>
                <span className="text-sm text-zinc-500">
                    {approval.createdAt?.seconds ? new Date(approval.createdAt.seconds * 1000).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-1">{approval.action}</h3>
              <p className="text-sm font-medium text-zinc-700 mb-3">{approval.resourceName}</p>
              
              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100 mb-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">AI DECISION SUMMARY</p>
                <p className="text-sm text-zinc-700"><span className="font-medium text-zinc-900">Reasoning:</span> {approval.reason}</p>
                <p className="text-sm text-zinc-700"><span className="font-medium text-zinc-900">Impact:</span> {approval.impact}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 md:w-32 justify-center shrink-0">
              <button 
                onClick={() => handleProcess(approval, true)}
                disabled={loadingIds.has(approval.id)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
                {loadingIds.has(approval.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> APPROVE</>}
              </button>
              <button className="w-full py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                <Eye className="w-4 h-4" /> REVIEW
              </button>
              <button 
                onClick={() => handleProcess(approval, false)}
                disabled={loadingIds.has(approval.id)}
                className="w-full py-2 bg-white hover:bg-red-50 border border-zinc-200 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
                {loadingIds.has(approval.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4" /> REJECT</>}
              </button>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
`);

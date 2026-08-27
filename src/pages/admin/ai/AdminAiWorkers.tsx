import React, { useEffect, useState } from 'react';
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
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wider ${
                worker.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700' : 
                worker.status === 'WORKING' ? 'bg-blue-50 text-blue-700' :
                'bg-amber-50 text-amber-700'
              }`}>
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
              <Link to={`/admin/ai/workers/${worker.id}`} className="flex-1 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded text-center transition-colors">
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

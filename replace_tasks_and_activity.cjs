const fs = require('fs');

function writePage(name, content) {
    fs.writeFileSync(`src/pages/admin/ai/${name}.tsx`, content);
}

writePage('AdminAiTasks', `import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIOrchestrator, AITask } from '../../../services/aiOrchestrator';

export default function AdminAiTasks() {
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AIOrchestrator.subscribeToTasks((data) => {
        setTasks(data);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
                <th className="py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2"/>Loading tasks...</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500">No tasks found.</td></tr>
              ) : tasks.map(task => (
                <tr key={task.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-sm text-zinc-900">{task.type}</div>
                    <div className="text-xs text-zinc-500">{task.id}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-700">{task.workerId}</td>
                  <td className="py-3 px-4">
                    <span className={\`px-2 py-1 text-xs font-medium rounded \${
                        task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                        task.status === 'FAILED' ? 'bg-red-50 text-red-700' :
                        task.status === 'WAITING_APPROVAL' ? 'bg-amber-50 text-amber-700' :
                        task.status === 'RUNNING' ? 'bg-blue-50 text-blue-700' :
                        'bg-zinc-100 text-zinc-700'
                    }\`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-600">
                    {task.createdAt?.seconds ? new Date(task.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link to={\`/admin/ai/tasks/\${task.id}\`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`);

writePage('AdminAiActivity', `import React, { useEffect, useState } from 'react';
import { Activity, Clock } from 'lucide-react';
import { AIOrchestrator } from '../../../services/aiOrchestrator';

export default function AdminAiActivity() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = AIOrchestrator.subscribeToActivity(setActivities);
    return () => unsubscribe();
  }, []);

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
          
          {activities.length === 0 ? (
             <div className="pl-6 text-sm text-zinc-500">No recent activity.</div>
          ) : activities.map((act, i) => (
          <div key={act.id || i} className="relative pl-6">
            <div className={\`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-white \${
                act.color === 'blue' ? 'bg-blue-500' :
                act.color === 'emerald' ? 'bg-emerald-500' :
                act.color === 'amber' ? 'bg-amber-500' :
                act.color === 'red' ? 'bg-red-500' :
                'bg-zinc-300'
            }\`}></div>
            <div>
              <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 
                {act.createdAt?.seconds ? new Date(act.createdAt.seconds * 1000).toLocaleString() : 'Just now'} • {act.workerId}
              </p>
              <p className="text-sm font-medium text-zinc-900">{act.message}</p>
            </div>
          </div>
          ))}

        </div>
      </div>
    </div>
  );
}
`);

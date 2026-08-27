import React, { useEffect, useState } from 'react';
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
            <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${
                act.color === 'blue' ? 'bg-blue-500' :
                act.color === 'emerald' ? 'bg-emerald-500' :
                act.color === 'amber' ? 'bg-amber-500' :
                act.color === 'red' ? 'bg-red-500' :
                'bg-zinc-300'
            }`}></div>
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

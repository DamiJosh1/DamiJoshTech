import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Code, Clock, User, Shield, Target } from 'lucide-react';

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
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full tracking-wider">COMPLETED</span>
          </h2>
          <p className="text-sm text-zinc-500">Task: {id}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Task Result
            </h3>
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
              <p className="text-sm text-zinc-700 font-medium mb-2">Successfully imported and drafted CJ Product: Smart LED Desk Lamp.</p>
              <ul className="text-sm text-zinc-600 list-disc list-inside space-y-1">
                <li>Analyzed supplier description and generated SEO-optimized content.</li>
                <li>Calculated optimal retail price ($49.99) based on 30% margin rule.</li>
                <li>Created draft product in database.</li>
                <li>Sent to Approval Queue for admin review.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-zinc-400" />
              Execution Logs
            </h3>
            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
              <div>[10:14:02] Task started by Product Builder worker.</div>
              <div>[10:14:02] Loading CJ Dropshipping API credentials.</div>
              <div>[10:14:03] Fetching product data for CJ_12948120.</div>
              <div>[10:14:05] Product data received. Images: 5, Variants: 2.</div>
              <div>[10:14:05] Calling Gemini API for content generation...</div>
              <div>[10:14:12] Content generated successfully.</div>
              <div>[10:14:12] Applying business rule: "Minimum 20% Margin".</div>
              <div>[10:14:12] Price calculated: $49.99 (Margin: 32%).</div>
              <div>[10:14:13] Saving draft to database.</div>
              <div>[10:14:14] Draft saved. Creating approval request.</div>
              <div className="text-emerald-400">[10:14:14] Task completed successfully.</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">Task Details</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Worker</span>
                <span className="text-sm font-medium text-zinc-900 flex items-center gap-1"><User className="w-4 h-4 text-zinc-400" /> Product Builder</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Trigger</span>
                <span className="text-sm font-medium text-zinc-900">Manual (Admin)</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Started</span>
                <span className="text-sm font-medium text-zinc-900 flex items-center gap-1"><Clock className="w-4 h-4 text-zinc-400" /> 2026-08-26 10:14:02</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Duration</span>
                <span className="text-sm font-medium text-zinc-900">12.4 seconds</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Permissions Used</span>
                <span className="text-sm font-medium text-zinc-900 flex items-center gap-1"><Shield className="w-4 h-4 text-emerald-500" /> PREPARE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

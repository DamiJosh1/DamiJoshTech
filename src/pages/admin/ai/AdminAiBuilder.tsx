import React from 'react';
import { PenTool, FileText, Send, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminAiBuilder() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Product Builder</h2>
          <p className="text-sm text-zinc-500">Turn approved product opportunities into storefront-ready products.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/ai/drafts" className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium text-sm transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" /> VIEW AI DRAFTS
          </Link>
          <Link to="/admin/ai/publishing" className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium text-sm transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" /> VIEW PUBLISHING QUEUE
          </Link>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> CREATE PRODUCT
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <PenTool className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Ready to Build</h3>
        <p className="mb-4">Select a product source to start generating content, pricing, and SEO automatically.</p>
        <button className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors">
          IMPORT FROM CJ
        </button>
      </div>
    </div>
  );
}

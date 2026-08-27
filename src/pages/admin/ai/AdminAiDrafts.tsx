import React from 'react';
import { FileEdit, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminAiDrafts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Product Drafts</h2>
          <p className="text-sm text-zinc-500">Review and manage products being prepared by AI.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/ai/builder" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors">
            NEW DRAFT
          </Link>
        </div>
      </div>
      
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search drafts..." 
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        
        <div className="p-8 text-center text-zinc-500">
          <FileEdit className="w-10 h-10 mx-auto text-zinc-300 mb-3" />
          <h3 className="font-medium text-zinc-900 mb-1">No drafts found</h3>
          <p className="text-sm">Start building a new product to see it here.</p>
        </div>
      </div>
    </div>
  );
}

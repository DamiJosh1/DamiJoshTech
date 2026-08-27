import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

export default function AdminAiContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Content Studio</h2>
          <p className="text-sm text-zinc-500">Manage AI-generated product content, descriptions, and FAQs.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
        <FileText className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-medium text-zinc-900 mb-2">Content Studio</h3>
        <p className="mb-4">Bulk generate content, review AI suggestions, and manage your content library.</p>
      </div>
    </div>
  );
}

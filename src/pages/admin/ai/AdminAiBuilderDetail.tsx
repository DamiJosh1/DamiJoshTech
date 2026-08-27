import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Check, ChevronRight, Save, Send } from 'lucide-react';

const STEPS = [
  'SOURCE', 'PRODUCT INFO', 'CONTENT', 'IMAGES', 'VARIANTS', 
  'PRICING', 'SEO', 'SHIPPING', 'REVIEW', 'PUBLISH'
];

export default function AdminAiBuilderDetail() {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] -mx-6 -my-6 bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/admin/ai/builder" className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-zinc-900 flex items-center gap-2">
              Product Builder Workspace
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">DRAFT</span>
            </h1>
            <p className="text-xs text-zinc-500">Working on draft {id || '#10482'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500 mr-2">Unsaved changes</span>
          <button className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium text-sm transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> SAVE
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" /> READY FOR REVIEW
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Steps */}
        <div className="w-64 bg-white border-r border-zinc-200 overflow-y-auto shrink-0 p-4">
          <div className="space-y-1">
            {STEPS.map((step, idx) => (
              <button
                key={step}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  activeStep === idx 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    activeStep === idx ? 'bg-indigo-200 text-indigo-800' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {step}
                </span>
                {idx < activeStep && <Check className="w-4 h-4 text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Editor/Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6">{STEPS[activeStep]}</h2>
            
            <div className="space-y-6">
              {/* Placeholder content based on step */}
              {activeStep === 2 && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-zinc-700">Product Title</label>
                      <button className="text-indigo-600 text-xs font-medium flex items-center gap-1 hover:text-indigo-700">
                        <Sparkles className="w-3 h-3" /> GENERATE TITLE
                      </button>
                    </div>
                    <input type="text" className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter title..." defaultValue="Smart Wireless Lamp" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-zinc-700">Description</label>
                      <button className="text-indigo-600 text-xs font-medium flex items-center gap-1 hover:text-indigo-700">
                        <Sparkles className="w-3 h-3" /> GENERATE DESCRIPTION
                      </button>
                    </div>
                    <textarea rows={6} className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter description..."></textarea>
                  </div>
                </>
              )}
              {activeStep !== 2 && (
                <div className="py-12 text-center text-zinc-500">
                  <p>Content for {STEPS[activeStep]} would appear here.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-200 flex justify-end">
              <button 
                onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 font-medium text-sm transition-colors flex items-center gap-2"
              >
                NEXT STEP <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Assistant */}
        <div className="w-80 bg-white border-l border-zinc-200 overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b border-zinc-200 bg-indigo-50/50">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> SAJODA AI ASSISTANT
            </h3>
            <p className="text-xs text-zinc-500 mt-1">AI suggestions and validations.</p>
          </div>
          
          <div className="flex-1 p-4 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs font-bold text-zinc-700">TITLE WARNING</span>
              </div>
              <p className="text-sm text-zinc-600 mb-3">The current title is a bit generic. Consider adding the primary material or benefit.</p>
              <button className="w-full py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium hover:bg-indigo-100 transition-colors">
                Improve Title
              </button>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-zinc-700">IMAGE CHECK</span>
              </div>
              <p className="text-sm text-zinc-600">All 5 images meet quality guidelines and are properly sized.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

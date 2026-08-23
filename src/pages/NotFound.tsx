import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12 text-center bg-zinc-50">
      <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-8">
        <Logo className="h-6 opacity-20" variant="icon" />
      </div>
      
      <h1 className="text-8xl md:text-9xl font-black text-zinc-900 tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-4">Page not found</h2>
      
      <p className="text-zinc-500 max-w-md mx-auto mb-10 text-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button 
          onClick={() => navigate(-1)}
          className="px-8 py-4 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-zinc-900/20"
        >
          <Home className="w-5 h-5" /> Home Page
        </button>
        <button 
          onClick={() => navigate('/shop')}
          className="px-8 py-4 bg-primary-blue hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Search className="w-5 h-5" /> Explore Shop
        </button>
      </div>
    </div>
  );
}

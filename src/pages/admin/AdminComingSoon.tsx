import React from 'react';
import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function AdminComingSoon() {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const featureName = pathParts[pathParts.length - 1] || 'Feature';
  
  const formattedName = featureName.charAt(0).toUpperCase() + featureName.slice(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl border border-zinc-200 shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
        <Construction className="w-8 h-8 text-indigo-600" />
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">{formattedName} Management</h1>
      <p className="text-zinc-500 max-w-md">
        This module is currently under development. It will be available in the next phase of the SAJODA Admin Platform rollout.
      </p>
    </div>
  );
}

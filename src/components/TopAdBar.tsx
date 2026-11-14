import React, { useState, useEffect } from 'react';
import { ExternalLink, X, Sparkles } from 'lucide-react';
import { getMonetizationConfig, recordAdClick, MonetizationConfig } from '../services/monetizationService';

export const TopAdBar: React.FC = () => {
  const [config, setConfig] = useState<MonetizationConfig>(getMonetizationConfig());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setConfig(getMonetizationConfig());
    window.addEventListener('sajoda_monetization_updated', handleUpdate);
    return () => window.removeEventListener('sajoda_monetization_updated', handleUpdate);
  }, []);

  if (!config.enabled || !config.topBarAdEnabled || dismissed || !config.topBarAdText) {
    return null;
  }

  const handleClick = () => {
    recordAdClick('top-bar-ad', config.topBarAdSponsor || 'Top Sponsor', 50);
    if (config.topBarAdLink) {
      window.open(config.topBarAdLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative bg-zinc-900 border-b border-zinc-800 text-white text-xs py-2 px-4 transition-colors z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div 
          onClick={handleClick}
          className="flex-1 flex items-center justify-center gap-2 cursor-pointer hover:underline text-center text-[11px] md:text-xs"
        >
          <span className="hidden sm:inline-flex items-center gap-1 bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            {config.topBarAdSponsor || 'Partner'}
          </span>
          <span className="text-zinc-200 font-medium">
            {config.topBarAdText}
          </span>
          <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0 inline" />
        </div>

        <button 
          onClick={() => setDismissed(true)}
          className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
          title="Dismiss ad"
          aria-label="Dismiss ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

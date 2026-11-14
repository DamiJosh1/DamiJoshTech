import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { getMonetizationConfig, recordAdClick, recordAdImpression, MonetizationConfig } from '../services/monetizationService';

interface AdBannerProps {
  slotType?: 'horizontal' | 'compact' | 'sidebar';
  className?: string;
  slotIndex?: number;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotType = 'horizontal',
  className = '',
  slotIndex = 0,
}) => {
  const [config, setConfig] = useState<MonetizationConfig>(getMonetizationConfig());
  const [adSenseError, setAdSenseError] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setConfig(getMonetizationConfig());
    window.addEventListener('sajoda_monetization_updated', handleUpdate);
    return () => window.removeEventListener('sajoda_monetization_updated', handleUpdate);
  }, []);

  useEffect(() => {
    recordAdImpression();
  }, []);

  if (!config.enabled) return null;

  // 1. If Google AdSense is active and has a publisher ID
  if (config.googleAdSenseId && !adSenseError) {
    return (
      <div className={`w-full my-6 overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 text-center ${className}`}>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-2">
          <span>Advertisement</span>
          <span>Google AdSense</span>
        </div>
        <div className="min-h-[100px] flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '90px' }}
            data-ad-client={config.googleAdSenseId}
            data-ad-slot={config.googleAdSenseSlotHome || '1234567890'}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // 2. Custom Sponsored Partner Banner (High-yield CPC / Direct Deal)
  if (!config.customBannersEnabled || config.customBanners.length === 0) return null;

  const banner = config.customBanners[slotIndex % config.customBanners.length];
  if (!banner) return null;

  const handleClick = () => {
    recordAdClick(banner.id, banner.sponsorName, banner.cpcRate);
    window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
  };

  if (slotType === 'compact') {
    return (
      <div 
        onClick={handleClick}
        className={`group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white shadow-sm border border-zinc-800 hover:border-zinc-700 transition-all ${className}`}
      >
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
          <span className="flex items-center gap-1 text-primary-blue font-semibold">
            <Sparkles className="w-3 h-3 text-cyan-400" /> {banner.badgeText || 'Sponsored Deal'}
          </span>
          <span className="text-zinc-500">Ad</span>
        </div>
        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {banner.title}
        </h4>
        <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
          {banner.subtitle}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
          <span>Learn more</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className={`group cursor-pointer my-8 relative overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-xl border border-zinc-800 hover:border-zinc-700 transition-all ${className}`}
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.imageUrl} 
          alt={banner.title} 
          className="w-full h-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent" />
      </div>

      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {banner.badgeText || 'Sponsored Partner'}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              by {banner.sponsorName}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
            {banner.title}
          </h3>
          <p className="text-xs md:text-sm text-zinc-300 mt-2 leading-relaxed">
            {banner.subtitle}
          </p>
        </div>

        <div className="shrink-0 flex items-center">
          <button 
            type="button"
            className="w-full md:w-auto px-5 py-3 bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg group-hover:shadow-cyan-500/20 transition-all active:scale-95"
          >
            <span>Explore Partner Deal</span>
            <ExternalLink className="w-4 h-4 text-zinc-900" />
          </button>
        </div>
      </div>
    </div>
  );
};

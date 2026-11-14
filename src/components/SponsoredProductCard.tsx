import React from 'react';
import { ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { recordAdClick, recordAdImpression } from '../services/monetizationService';

interface SponsoredProductCardProps {
  banner: {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    linkUrl: string;
    sponsorName: string;
    badgeText: string;
    cpcRate: number;
  };
}

export const SponsoredProductCard: React.FC<SponsoredProductCardProps> = ({ banner }) => {
  React.useEffect(() => {
    recordAdImpression();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordAdClick(banner.id, banner.sponsorName, banner.cpcRate);
    window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative flex flex-col justify-between rounded-2xl bg-zinc-950 text-white overflow-hidden border border-zinc-800 hover:border-cyan-500/50 shadow-md transition-all duration-300 cursor-pointer h-full"
    >
      {/* Top Banner Tag */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          {banner.badgeText || 'Sponsored Deal'}
        </span>
        <span className="text-[10px] uppercase font-bold text-zinc-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md">
          Ad
        </span>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-zinc-900">
        <img 
          src={banner.imageUrl} 
          alt={banner.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
            {banner.sponsorName}
          </p>
          <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5 group-hover:text-cyan-300 transition-colors">
            {banner.title}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
            {banner.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="w-full py-2.5 px-3 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
        >
          <span>Check Deal</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-900" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl md:rounded-[32px] overflow-hidden border border-zinc-100 hover:border-zinc-200 transition-all duration-500 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] bg-zinc-100" />
      
      {/* Content Skeleton */}
      <div className="p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-16 bg-zinc-200 rounded-full" />
          <div className="h-3 w-12 bg-zinc-200 rounded-full" />
        </div>
        
        {/* Title */}
        <div className="h-5 w-3/4 bg-zinc-200 rounded-full mb-2" />
        <div className="h-5 w-1/2 bg-zinc-200 rounded-full mb-4" />
        
        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-50">
          <div className="h-6 w-20 bg-zinc-200 rounded-full" />
          <div className="w-10 h-10 bg-zinc-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'fullscreen';
  label?: string;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

/**
 * Human-designed, minimalist high-end loader.
 * No neon gradients, no AI glow, no robotic spinning or bouncing dots.
 * Pure, timeless craftsmanship: sleek hairline track, subtle rotation, and crisp editorial typography.
 */
export default function LoadingSpinner({
  size = 'md',
  label,
  theme = 'light',
  className = '',
}: LoadingSpinnerProps) {
  const isDark = theme === 'dark';

  const sizeClasses = {
    xs: 'w-3.5 h-3.5 border-[1.5px]',
    sm: 'w-4 h-4 border-[1.5px]',
    md: 'w-6 h-6 border-2',
    lg: 'w-9 h-9 border-[2px]',
  };

  const spinner = (
    <div className={`relative flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Hairline precision circular track */}
      <div
        className={`rounded-full animate-spin ${
          size === 'fullscreen' ? 'w-8 h-8 border-2' : sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md
        } ${
          isDark
            ? 'border-zinc-800 border-t-white'
            : 'border-zinc-200 border-t-zinc-900'
        }`}
        style={{
          animationDuration: '0.75s',
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {label && (
        <span
          className={`text-[11px] font-medium tracking-wider uppercase transition-opacity ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div
        className={`w-full min-h-[60vh] flex flex-col items-center justify-center px-4 transition-colors ${
          isDark ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
        } ${className}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-7 h-7 rounded-full border-[2px] animate-spin ${
              isDark ? 'border-zinc-800 border-t-white' : 'border-zinc-200 border-t-zinc-900'
            }`}
            style={{
              animationDuration: '0.75s',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          {label ? (
            <p className={`text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {label}
            </p>
          ) : (
            <span className={`text-[10px] font-bold tracking-[0.25em] uppercase ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
              SAJODA
            </span>
          )}
        </div>
      </div>
    );
  }

  return spinner;
}

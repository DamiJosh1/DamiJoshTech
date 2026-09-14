import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';

export default function Preloader({ isDarkMode }: { isDarkMode: boolean }) {
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fallback maximum timeout to ensure preloader dismisses even if video doesn't end or fails
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const handleVideoEnded = () => {
    setLoading(false);
  };

  if (!loading) return null;

  return (
    <div
      id="app-preloader"
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${
        !loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${isDarkMode ? 'bg-zinc-950' : 'bg-slate-50'}`}
    >
      {!videoError ? (
        <div className="relative flex flex-col items-center justify-center w-full max-w-sm px-6">
          <video
            ref={videoRef}
            src="/videos/pre.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            onError={() => setVideoError(true)}
            className="w-full max-h-72 object-contain rounded-2xl shadow-lg"
          />
        </div>
      ) : (
        /* Fallback animated logo if video is still being uploaded */
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-blue-500/20 rounded-full animate-ping"></div>
            <div
              className="absolute w-24 h-24 border-4 border-blue-500/30 rounded-full animate-spin-slow"
              style={{ animationDuration: '3s' }}
            ></div>
          </div>

          <div className="relative z-10 w-20 h-20 bg-transparent flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] rounded-full animate-pulse">
            <Logo variant="icon" className="h-10" />
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="flex gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce"
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


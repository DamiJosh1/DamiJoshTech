import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';

export default function Preloader({ isDarkMode }: { isDarkMode: boolean }) {
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // When video is present, do NOT cut off early. Allow the entire video to play to completion.
    // If the video encounters an error or takes exceptionally long (e.g. > 30s), provide a safety fallback.
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 30000);

    // Show a subtle skip button after 3 seconds in case user wants to enter immediately
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(skipTimer);
    };
  }, []);

  // When the video ends naturally, dismiss preloader
  const handleVideoEnded = () => {
    setLoading(false);
  };

  if (!loading) return null;

  return (
    <div
      id="app-preloader"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-700 ${
        !loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {!videoError ? (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
          {/* 9:16 Fullscreen Video Player */}
          <div className="relative w-full h-full max-w-[56.25vh] max-h-screen aspect-[9/16] flex items-center justify-center">
            <video
              ref={videoRef}
              src="/videos/pre.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              onError={() => {
                // If video fails to load or hasn't finished uploading yet, fallback gracefully
                setVideoError(true);
              }}
              className="w-full h-full object-cover sm:object-contain shadow-2xl"
            />
          </div>

          {/* Skip option in case user wants to bypass */}
          {canSkip && (
            <button
              onClick={() => setLoading(false)}
              className="absolute top-6 right-6 z-20 px-4 py-2 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10 shadow-lg cursor-pointer"
            >
              Skip Intro &rarr;
            </button>
          )}
        </div>
      ) : (
        /* Fallback animated logo if pre.mp4 is not yet in /public/videos */
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


import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share, PlusSquare, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function PWAPrompt() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Only show banner if not already installed as standalone
    if (isInstalled) return;

    const hasDismissed = sessionStorage.getItem('sajoda_pwa_dismissed');
    if (!hasDismissed) {
      // Delay showing briefly so user sees the store first
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        setTimeout(() => setShowBanner(false), 2500);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Standard browser instructions
      alert('To install SAJODA: tap your browser menu (⋮) and select "Install App" or "Add to Home Screen".');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('sajoda_pwa_dismissed', 'true');
  };

  // If already running standalone, do not show install banners
  if (isInstalled) {
    return isOffline ? (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-zinc-900 text-white text-xs font-bold py-2 text-center shadow-md">
        Offline Mode — You are browsing cached products
      </div>
    ) : null;
  }

  return (
    <>
      {/* Offline Status Indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-zinc-900 text-white text-xs font-bold py-2 text-center shadow-md pt-safe">
          Offline Mode — Showing cached catalogue
        </div>
      )}

      {/* Install App Floating Banner */}
      {showBanner && !installedSuccess && (
        <div className="fixed bottom-[84px] md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-[90] bg-white border border-zinc-200/90 shadow-2xl rounded-2xl p-4 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3.5 pr-2">
            <div className="w-12 h-12 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-center shrink-0 shadow-xs overflow-hidden p-1">
              <img 
                src="/pwa-192x192.png" 
                alt="SAJODA" 
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Smartphone className="w-6 h-6 text-zinc-900 hidden" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-900">
                Install SAJODA App
              </p>
              <p className="text-[11px] text-zinc-500 line-clamp-1">
                Faster loading, instant orders & offline access on your phone
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={handleInstallClick}
              className="px-3.5 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button 
              onClick={handleDismiss}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Installed Confirmation Toast */}
      {installedSuccess && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[95] bg-zinc-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>SAJODA App installed successfully!</span>
        </div>
      )}

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-100 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/pwa-192x192.png" alt="SAJODA" className="w-10 h-10 rounded-xl object-contain border border-zinc-200/80 shadow-xs" />
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base">Install on iPhone / iPad</h3>
                  <p className="text-xs text-zinc-500">Add to your home screen</p>
                </div>
              </div>
              <button 
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 my-5">
              <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  1
                </div>
                <div className="text-xs text-zinc-700 leading-relaxed">
                  Tap the <strong className="text-zinc-900 font-semibold inline-flex items-center gap-1 mx-1"><Share className="w-3.5 h-3.5 inline" /> Share</strong> button in Safari's bottom toolbar.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <div className="text-xs text-zinc-700 leading-relaxed">
                  Scroll down the options list and tap <strong className="text-zinc-900 font-semibold inline-flex items-center gap-1 mx-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  3
                </div>
                <div className="text-xs text-zinc-700 leading-relaxed">
                  Tap <strong className="text-zinc-900 font-semibold">Add</strong> in top-right. SAJODA will open seamlessly like an app from your home screen!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}

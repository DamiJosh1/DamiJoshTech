import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const hasDismissed = localStorage.getItem('sajoda_pwa_dismissed');
      if (!hasDismissed) {
        // Delay showing to not be annoying immediately
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('sajoda_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-zinc-900 text-white text-xs font-bold py-2 text-center shadow-md pt-safe animate-slide-down">
          YOU'RE OFFLINE
        </div>
      )}

      {/* Install App Banner */}
      {showPrompt && (
        <div className="fixed bottom-[80px] lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-96 z-[90] bg-white border border-zinc-200 shadow-2xl rounded-2xl p-4 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-primary-blue" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900">SHOP SAJODA LIKE AN APP.</p>
              <p className="text-xs text-zinc-500 mt-0.5">Install for a faster experience.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleInstall}
              className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-colors"
            >
              INSTALL
            </button>
            <button 
              onClick={handleDismiss}
              className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

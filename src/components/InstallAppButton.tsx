import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppButtonProps {
  className?: string;
  variant?: 'nav' | 'menu' | 'full';
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({ 
  className = '', 
  variant = 'nav' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed and running standalone, don't show
  if (isInstalled) return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      alert('To install SAJODA on your phone: tap your browser menu (⋮) and select "Install App" or "Add to Home screen".');
    }
  };

  return (
    <>
      {variant === 'nav' && (
        <button
          onClick={handleClick}
          title="Install SAJODA App"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors shadow-xs ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'menu' && (
        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-900 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold">Install SAJODA App</p>
              <p className="text-[10px] text-zinc-400 font-normal">Add to home screen for faster shopping</p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
            Install
          </span>
        </button>
      )}

      {variant === 'full' && (
        <button
          onClick={handleClick}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm bg-zinc-900 text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Install SAJODA on your phone</span>
        </button>
      )}

      {/* iOS Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/pwa-192x192.png" alt="SAJODA" className="w-10 h-10 rounded-xl" />
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base">Install on iPhone / iPad</h3>
                  <p className="text-xs text-zinc-500">Quick 2-step setup</p>
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
                <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                <div className="text-xs text-zinc-700 leading-relaxed">
                  Tap the <strong className="text-zinc-900 font-semibold inline-flex items-center gap-1 mx-1"><Share className="w-3.5 h-3.5 inline" /> Share</strong> button in Safari's bottom toolbar.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                <div className="text-xs text-zinc-700 leading-relaxed">
                  Scroll down and tap <strong className="text-zinc-900 font-semibold inline-flex items-center gap-1 mx-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

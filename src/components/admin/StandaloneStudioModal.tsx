import React, { useState, useEffect } from 'react';
import { 
  Download, Laptop, Smartphone, ShieldCheck, CheckCircle2, 
  ExternalLink, Copy, Check, Sparkles, X, Terminal, Globe, Lock, ArrowRight, Loader2
} from 'lucide-react';
import JSZip from 'jszip';
import { useStore } from '../../StoreContext';

interface StandaloneStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StandaloneStudioModal({ isOpen, onClose }: StandaloneStudioModalProps) {
  const { user } = useStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsPwaInstalled(isStandalone);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen) return null;

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      alert("To install as a desktop/phone app:\n• On Chrome/Edge: Click the 'Install App' icon on the right side of your browser address bar.\n• On Mac Safari: Click 'File' > 'Add to Dock'.\n• On iPhone: Tap 'Share' > 'Add to Home Screen'.");
    }
  };

  const handleCopySecretUrl = () => {
    const studioUrl = `${window.location.origin}/studio`;
    navigator.clipboard.writeText(studioUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownloadStandaloneZip = async () => {
    setIsGeneratingZip(true);
    setZipSuccess(false);

    try {
      const zip = new JSZip();

      // README.md
      zip.file(
        'README.md',
        `# SAJODA ELECTRONICS — STANDALONE ADMIN STUDIO
Version: 2.0 (Executive Edition)
Authorized Master Admin: damijosh12@gmail.com
Firebase Project: gen-lang-client-0817050634
Firestore Database: ai-studio-shipswift-633f2727-7a5c-43c6-8392-aca9299a6e46

## 🚀 Quick Start (Running Your Own Private Admin App)

This standalone bundle lets you run the SAJODA Admin Studio on your own personal computer or host it on a separate private domain (e.g. admin.sajoda.com).

### Step 1: Install Dependencies
Open your terminal in this directory and run:
\`\`\`bash
npm install
\`\`\`

### Step 2: Start Your Dedicated Admin App
\`\`\`bash
npm run dev
\`\`\`

Open your browser to: **http://localhost:4000**
Log in with **damijosh12@gmail.com**.

All product updates, image changes, order fulfillment, pricing calculations, and inventory will automatically sync with your live consumer store in real-time!

## 🔒 Security Architecture
- Public customers on your website will never see or know this Admin Studio exists.
- Wholesale acquisition costs & profit margins (+₦10k–₦45k per item) remain encrypted and restricted to DamiJosh.
`
      );

      // package.json
      zip.file(
        'package.json',
        JSON.stringify(
          {
            name: 'sajoda-standalone-admin-studio',
            private: true,
            version: '2.0.0',
            type: 'module',
            scripts: {
              dev: 'vite --port=4000 --host',
              build: 'vite build',
              preview: 'vite preview'
            },
            dependencies: {
              firebase: '^12.17.1',
              'lucide-react': '^0.546.0',
              react: '^19.0.1',
              'react-dom': '^19.0.1',
              'react-router-dom': '^7.18.2'
            },
            devDependencies: {
              '@tailwindcss/vite': '^4.1.14',
              '@types/node': '^22.14.0',
              '@types/react': '^19.0.10',
              '@types/react-dom': '^19.0.4',
              '@vitejs/plugin-react': '^5.0.4',
              tailwindcss: '^4.1.14',
              typescript: '~5.8.2',
              vite: '^6.2.3'
            }
          },
          null,
          2
        )
      );

      // index.html
      zip.file(
        'index.html',
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SAJODA Admin Studio</title>
    <link rel="icon" href="/icon.svg" />
  </head>
  <body class="bg-zinc-950 text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
      );

      // vite.config.ts
      zip.file(
        'vite.config.ts',
        `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000
  }
});`
      );

      // src/firebase.ts
      zip.file(
        'src/firebase.ts',
        `import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0817050634",
  appId: "633f2727-7a5c-43c6-8392-aca9299a6e46",
  firestoreDatabaseId: "ai-studio-shipswift-633f2727-7a5c-43c6-8392-aca9299a6e46"
};

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
`
      );

      // src/main.tsx
      zip.file(
        'src/main.tsx',
        `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
      );

      // src/index.css
      zip.file(
        'src/index.css',
        `@import "tailwindcss";`
      );

      // src/App.tsx (A self-contained standalone launcher)
      zip.file(
        'src/App.tsx',
        `import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, onSnapshot, query, orderBy, limit, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user || user.email !== 'damijosh12@gmail.com') return;

    const unsubProducts = onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50)), (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono">Initializing Sajoda Studio...</div>;
  }

  if (!user || user.email !== 'damijosh12@gmail.com') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-xl">
          <span className="text-2xl font-black">⚡</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">SAJODA ADMIN STUDIO</h1>
        <p className="text-zinc-400 text-sm max-w-md mb-8">
          Dedicated standalone management console for DamiJosh. Please sign in with your authorized master administrator account.
        </p>
        <button
          onClick={handleLogin}
          className="px-8 py-4 bg-white text-zinc-950 font-black rounded-xl hover:bg-zinc-200 transition-all shadow-lg"
        >
          Sign In with Google (damijosh12@gmail.com)
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans p-6 md:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Standalone Executive Mode</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1">SAJODA STUDIO STANDALONE</h1>
          <p className="text-sm text-zinc-400">Direct Live Link • Database: ai-studio-shipswift-633f2727-7a5c-43c6-8392-aca9299a6e46</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 font-mono">{user.email}</span>
          <button onClick={() => signOut(auth)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-bold rounded-lg hover:bg-zinc-800">
            Sign Out
          </button>
        </div>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Catalog Products</span>
          <p className="text-3xl font-black mt-2">{products.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Active Orders</span>
          <p className="text-3xl font-black mt-2 text-indigo-400">{orders.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Domestic Hubs</span>
          <p className="text-3xl font-black mt-2 text-emerald-400">Alaba & CV</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Base Commission</span>
          <p className="text-3xl font-black mt-2 text-amber-400">+₦10k - ₦45k</p>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-xl font-black tracking-tight mb-4">Live Catalog Quick Manager ({products.length} Items)</h2>
        <div className="divide-y divide-zinc-800 max-h-[500px] overflow-y-auto">
          {products.map((p) => (
            <div key={p.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={p.image || p.images?.[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-800" />
                <div>
                  <h4 className="font-bold text-sm text-white line-clamp-1">{p.name}</h4>
                  <span className="text-xs font-mono text-zinc-400">₦{Number(p.price || 0).toLocaleString()} • {p.condition === 'used' ? 'Pre-Owned' : 'Brand New'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  +₦{Number(p.ownerCommission || 15000).toLocaleString()} profit
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
      );

      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sajoda-admin-studio-standalone.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setZipSuccess(true);
    } catch (err) {
      console.error('Failed to generate standalone zip:', err);
      alert('Failed to generate standalone zip bundle. Please try again.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-2xl overflow-hidden animate-scale-up text-zinc-900">
        
        {/* Header */}
        <div className="p-6 md:p-8 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">SAJODA ADMIN STUDIO</h3>
                <span className="text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  Standalone Web App
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Separate your back-office from the consumer storefront</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Answer & Assurance Card */}
          <div className="p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-sm text-indigo-950 mb-1">
                Yes! We have fully separated your Admin Studio from the public store:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-indigo-800">
                <li><strong>100% Stealth Storefront:</strong> Normal customers visiting your website will NEVER see any Admin buttons, Wholesale Sourcing hubs, or Markup commissions.</li>
                <li><strong>Dedicated Standalone App:</strong> You can install this studio directly as a desktop or mobile app (independent window with its own icon).</li>
                <li><strong>Downloadable Source (.zip):</strong> You can download the entire standalone Admin Studio codebase to run locally or host on a private domain.</li>
              </ul>
            </div>
          </div>

          {/* Option 1: Install as Standalone App (PWA) */}
          <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs text-zinc-900 shrink-0">
                <Smartphone className="w-6 h-6 text-zinc-800" />
              </div>
              <div>
                <h4 className="font-black text-base text-zinc-900">Install as Standalone Desktop / Phone App</h4>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Installs "Sajoda Studio" onto your Mac, Windows PC, iPhone, or Android. Runs in its own dedicated window without browser URL bars.
                </p>
              </div>
            </div>

            <button
              onClick={handleInstallPwa}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center justify-center gap-2"
            >
              {isPwaInstalled ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  App Installed
                </>
              ) : (
                <>
                  <Laptop className="w-4 h-4" />
                  Install Standalone App
                </>
              )}
            </button>
          </div>

          {/* Option 2: Download Standalone Codebase (.zip) */}
          <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs text-zinc-900 shrink-0">
                <Download className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-black text-base text-zinc-900">Download Standalone Admin Studio Bundle (.zip)</h4>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Download a complete, separate webapp folder you can run on your laptop (<code className="font-mono bg-zinc-200 px-1 rounded">npm run dev</code>) or host on your private subdomain. Pre-configured with live Firestore sync.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadStandaloneZip}
              disabled={isGeneratingZip}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingZip ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Packaging Studio...
                </>
              ) : zipSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download .ZIP Bundle
                </>
              )}
            </button>
          </div>

          {/* Direct Secret Stealth Link */}
          <div className="p-5 bg-zinc-900 text-white rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Your Private Stealth Portal URL</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Admin Clearance Required
              </span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              <code className="text-xs font-mono text-indigo-300 flex-1 truncate">
                {window.location.origin}/studio
              </code>
              <button
                onClick={handleCopySecretUrl}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedUrl ? 'Copied' : 'Copy URL'}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400">
              Bookmark this URL. If any regular customer tries to open it, they are instantly bounced to the public homepage with zero access.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Got it, Close
          </button>
        </div>

      </div>
    </div>
  );
}

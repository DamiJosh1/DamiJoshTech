const fs = require('fs');

const loginCode = `import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Logo from './components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  // Clear errors when toggling modes
  useEffect(() => {
    setError('');
  }, [resetMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Failed to login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Ensure user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: result.user.email,
          createdAt: new Date().toISOString()
        });
      }
      
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError(err.message || 'Failed to send reset email.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (resetMode) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 px-4">
        <div className="absolute top-8 left-6 sm:left-12 lg:left-24 flex items-center gap-4">
          <Link to="/" className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-zinc-900 hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="cursor-pointer hidden sm:block">
            <Logo className="w-24 md:w-32 text-zinc-900" />
          </Link>
        </div>
        
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[32px] shadow-2xl animate-scale-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center">
              <EyeOff className="w-8 h-8 text-zinc-900" />
            </div>
          </div>
          
          {resetEmailSent ? (
            <div className="text-center">
              <h2 className="text-2xl font-black text-zinc-900 mb-4">Check your email</h2>
              <p className="text-zinc-500 mb-8 leading-relaxed">
                We've sent password reset instructions to <span className="font-bold text-zinc-900">{email}</span>.
              </p>
              <button
                onClick={() => setResetMode(false)}
                className="w-full py-4 rounded-xl font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
              >
                BACK TO LOGIN
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-zinc-900 mb-2 text-center">Reset Password</h2>
              <p className="text-zinc-500 mb-8 text-center text-sm">Enter your email and we'll send you instructions.</p>
              
              {error && (
                <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={\`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] \${
                    loading ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/20'
                  }\`}
                >
                  {loading ? 'Sending...' : 'SEND INSTRUCTIONS'}
                </button>
              </form>
              
              <button
                onClick={() => setResetMode(false)}
                className="w-full mt-4 py-4 rounded-xl font-bold text-zinc-900 bg-white border-2 border-zinc-200 hover:border-zinc-900 transition-colors"
              >
                CANCEL
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-zinc-50">
      {/* Left side - Form (Mobile & Desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-white relative z-10 shadow-2xl lg:shadow-none overflow-y-auto">
        
        <div className="absolute top-8 left-6 sm:left-12 lg:left-24 flex items-center gap-4">
          <Link to="/" className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 hover:bg-zinc-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="cursor-pointer hidden sm:block">
            <Logo className="w-24 md:w-32 text-zinc-900" />
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">Welcome Back</h1>
          <p className="text-zinc-500 font-medium mb-8">Sign in to your SAJODA account.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-zinc-700">Password</label>
                <button 
                  type="button" 
                  onClick={() => setResetMode(true)}
                  className="text-sm font-bold text-primary-blue hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={\`w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] \${
                loading ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/20'
              }\`}
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-zinc-200 flex-1"></div>
            <span className="text-sm text-zinc-400 font-medium">OR</span>
            <div className="h-px bg-zinc-200 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 hover:border-zinc-300 text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 py-3.5 px-4 rounded-xl font-bold transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="mt-8 text-center text-sm font-semibold text-zinc-600 pb-12">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-blue hover:underline">
              CREATE ONE
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Branding (Desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-900 text-white relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-zinc-800/30 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-blue/20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-lg p-12 text-center animate-slide-up">
          <h2 className="text-4xl font-black tracking-tight mb-6 leading-tight">Welcome back to SAJODA.</h2>
          <p className="text-lg text-zinc-400 font-medium">Sign in to access your orders, wishlist, and exclusive offers.</p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/Login.tsx', loginCode);

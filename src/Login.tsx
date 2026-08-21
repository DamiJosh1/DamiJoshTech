import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Mail, Phone, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'username'>('email');
  const [identifier, setIdentifier] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (auth.currentUser?.email === 'damijosh12@gmail.com') { navigate('/admin'); } else { navigate('/'); }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let loginEmail = identifier;

      if (loginMethod === 'username') {
        const q = query(collection(db, 'users'), where('username', '==', identifier));
        const snapshot = await getDocs(q);
        if (snapshot.empty) throw new Error('Account does not exist');
        loginEmail = snapshot.docs[0].data().email;
      } else if (loginMethod === 'phone') {
        const fullPhone = `${countryCode}${identifier}`;
        const q = query(collection(db, 'users'), where('phone', '==', fullPhone));
        const snapshot = await getDocs(q);
        if (snapshot.empty) throw new Error('Account does not exist');
        loginEmail = snapshot.docs[0].data().email;
      }

      await signInWithEmailAndPassword(auth, loginEmail, password);
      if (auth.currentUser?.email === 'damijosh12@gmail.com') { navigate('/admin'); } else { navigate('/'); }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.message === 'Account does not exist') {
        setError('Account does not exist. Please check your details.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-zinc-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <span className="text-3xl font-bold tracking-tight">
            <span className="text-blue-500">Vora</span><span className="text-white">Tech</span>
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Sign in to continue to your VoraTech account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-zinc-800">
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-zinc-700 rounded-xl shadow-sm bg-zinc-800 text-sm font-medium text-white hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-500">Or sign in with</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2 mb-6">
            <button onClick={() => setLoginMethod('email')} className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${loginMethod === 'email' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-zinc-800 text-zinc-400 border border-transparent hover:bg-zinc-700'}`}>Email</button>
            <button onClick={() => setLoginMethod('phone')} className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${loginMethod === 'phone' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-zinc-800 text-zinc-400 border border-transparent hover:bg-zinc-700'}`}>Phone</button>
            <button onClick={() => setLoginMethod('username')} className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${loginMethod === 'username' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-zinc-800 text-zinc-400 border border-transparent hover:bg-zinc-700'}`}>Username</button>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {loginMethod === 'email' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300">Email address</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-10 bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}

            {loginMethod === 'phone' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300">Phone number</label>
                <div className="mt-1 relative flex rounded-xl shadow-sm">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-zinc-800 bg-zinc-900 text-zinc-300 sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+61">🇦🇺 +61</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-zinc-500" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="block w-full pl-10 bg-zinc-950 border border-zinc-800 rounded-r-xl py-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
                      placeholder="123 456 7890"
                    />
                  </div>
                </div>
              </div>
            )}

            {loginMethod === 'username' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300">Username</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-10 bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="yourusername"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300">Password</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-700 bg-zinc-900 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-blue-500 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

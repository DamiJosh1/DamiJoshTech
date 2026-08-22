import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      // Don't reveal if email exists, just say it was sent or show generic error
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2rem] shadow-2xl text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-4">CHECK YOUR EMAIL</h2>
          <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
            If an account exists for <span className="font-bold text-zinc-900">{email}</span>, you'll receive a password reset link shortly.
          </p>
          <Link to="/login" className="block w-full py-4 rounded-xl font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors">
            BACK TO LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-zinc-50">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-white relative z-10 shadow-2xl lg:shadow-none">
        
        <div className="absolute top-8 left-6 sm:left-12 lg:left-24">
          <Link to="/" className="cursor-pointer">
            <Logo className="w-24 md:w-32 text-zinc-900" />
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">Reset Password</h1>
          <p className="text-zinc-500 font-medium mb-8">Enter your email address to reset your password.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] ${
                loading ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/20'
              }`}
            >
              {loading ? 'Sending...' : 'SEND RESET LINK'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-semibold text-zinc-600">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-blue hover:underline">
              LOGIN
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-zinc-900 text-white relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-zinc-800/30 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-blue/20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-lg p-12 text-center animate-slide-up">
          <h2 className="text-4xl font-black tracking-tight mb-6 leading-tight">Secure Your Account.</h2>
          <p className="text-lg text-zinc-400 font-medium">We'll help you get back to shopping in no time.</p>
        </div>
      </div>
    </div>
  );
}

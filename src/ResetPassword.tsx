import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from './firebase';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Extract oobCode from URL
  const searchParams = new URLSearchParams(location.search);
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or missing reset token.');
    } else {
      verifyPasswordResetCode(auth, oobCode).catch(() => {
        setError('Invalid or expired reset token.');
      });
    }
  }, [oobCode]);

  const validatePassword = (pass: string) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const isLengthValid = pass.length >= 8;
    return hasUpper && hasLower && hasNumber && isLengthValid;
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!oobCode) {
      setError('Invalid reset token.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password does not meet requirements.');
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2rem] shadow-2xl text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-4">PASSWORD UPDATED</h2>
          <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
            Your password has been successfully updated. You can now log in with your new password.
          </p>
          <Link to="/login" className="block w-full py-4 rounded-xl font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors">
            LOGIN
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
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">Create New Password</h1>
          <p className="text-zinc-500 font-medium mb-8">Enter your new password below.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={!oobCode}
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors pr-12 disabled:opacity-50"
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
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-medium text-zinc-500">
                <div className={`flex items-center gap-1.5 ${password.length >= 8 ? 'text-success' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-success' : 'bg-zinc-300'}`} />
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-success' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-success' : 'bg-zinc-300'}`} />
                  Uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${/[a-z]/.test(password) ? 'text-success' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-success' : 'bg-zinc-300'}`} />
                  Lowercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? 'text-success' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-success' : 'bg-zinc-300'}`} />
                  Number
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={!oobCode}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors disabled:opacity-50"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !oobCode}
              className={`w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] ${
                loading || !oobCode ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/20'
              }`}
            >
              {loading ? 'Updating...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-zinc-900 text-white relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-zinc-800/30 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-blue/20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-lg p-12 text-center animate-slide-up">
          <h2 className="text-4xl font-black tracking-tight mb-6 leading-tight">Secure Your Account.</h2>
        </div>
      </div>
    </div>
  );
}

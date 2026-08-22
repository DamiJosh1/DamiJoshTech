import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../firebase';
import { ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AccountSecurity() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (pass: string) => {
    return /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass) && pass.length >= 8;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password does not meet requirements.');
      return;
    }

    if (!auth.currentUser) return;

    try {
      setLoading(true);
      await updatePassword(auth.currentUser, newPassword);
      setSuccess('PASSWORD UPDATED');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('For your security, please log out and log back in to change your password.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-black text-zinc-900 mb-2">Security</h2>
      <p className="text-zinc-500 font-medium mb-8 pb-8 border-b border-zinc-100">
        Manage your password and account security.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold max-w-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success/10 text-success rounded-xl flex items-start gap-3 text-sm font-semibold max-w-xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleUpdate} className="max-w-xl space-y-6 mb-12 border border-zinc-200 rounded-[1.5rem] p-6 bg-zinc-50">
        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5" /> Change Password
        </h3>
        
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none transition-colors pr-12"
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
            <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-success' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-success' : 'bg-zinc-300'}`} />
              At least 8 characters
            </div>
            <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) ? 'text-success' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-success' : 'bg-zinc-300'}`} />
              Uppercase letter
            </div>
            <div className={`flex items-center gap-1.5 ${/[a-z]/.test(newPassword) ? 'text-success' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-success' : 'bg-zinc-300'}`} />
              Lowercase letter
            </div>
            <div className={`flex items-center gap-1.5 ${/[0-9]/.test(newPassword) ? 'text-success' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-success' : 'bg-zinc-300'}`} />
              Number
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-1.5">Confirm New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-auto px-8 py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            loading ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl shadow-zinc-900/20 active:scale-[0.98]'
          }`}
        >
          {loading ? 'Updating...' : 'UPDATE PASSWORD'}
        </button>
      </form>
    </div>
  );
}

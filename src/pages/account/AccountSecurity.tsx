import React, { useState } from 'react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../firebase';
import { Shield, CheckCircle2, AlertCircle, Key } from 'lucide-react';

export default function AccountSecurity() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('User not found.');

      // Re-authenticate first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect.');
      } else {
        setError('Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h1 className="text-2xl font-black text-zinc-900 mb-6">Security Settings</h1>
      
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
            <Key className="w-5 h-5 text-zinc-900" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">Change Password</h3>
            <p className="text-sm text-zinc-500">Update your password to keep your account secure.</p>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-success/10 text-success rounded-xl flex items-start gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
            />
          </div>
          
          <div className="h-px bg-zinc-100 my-2" />

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-bold transition-all ${
                loading ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl shadow-zinc-900/20 active:scale-[0.98]'
              }`}
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

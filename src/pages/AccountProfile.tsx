import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AccountProfile() {
  const { profileData } = useOutletContext<any>();
  const [firstName, setFirstName] = useState(profileData?.firstName || '');
  const [lastName, setLastName] = useState(profileData?.lastName || '');
  const [phone, setPhone] = useState(profileData?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setPhone(profileData.phone || '');
    }
  }, [profileData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!auth.currentUser) return;
    
    try {
      setLoading(true);
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`.trim()
      });

      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        firstName,
        lastName,
        phone,
        updatedAt: serverTimestamp()
      });

      setSuccess('Profile updated successfully.');
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-black text-zinc-900 mb-2">Profile</h2>
      <p className="text-zinc-500 font-medium mb-8 pb-8 border-b border-zinc-100">
        Manage your personal information.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success/10 text-success rounded-xl flex items-start gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleUpdate} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={profileData?.email || auth.currentUser?.email || ''}
            disabled
            className="w-full p-4 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed"
          />
          <p className="text-xs text-zinc-500 mt-2 font-medium">To change your email address, please contact support.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:bg-white outline-none transition-colors"
            placeholder="+1 234 567 8900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-auto px-8 py-4 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            loading ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl shadow-zinc-900/20 active:scale-[0.98]'
          }`}
        >
          {loading ? 'Saving...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useStore } from '../../StoreContext';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Camera, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AccountProfile() {
  const { user } = useStore();
  const [firstName, setFirstName] = useState(user?.displayName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.displayName?.split(' ').slice(1).join(' ') || '');
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const displayName = `${firstName} ${lastName}`.trim();
      
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, {
        displayName,
        photoURL: photoURL || user.photoURL
      });

      // Update Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        displayName,
        phone,
        photoURL: photoURL || user.photoURL,
        updatedAt: new Date()
      }, { merge: true });

      setMessage('Profile updated successfully.');
    } catch (err: any) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const getInitials = () => {
    const f = firstName ? firstName[0] : '';
    const l = lastName ? lastName[0] : '';
    return (f + l).toUpperCase() || 'U';
  };

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h1 className="text-2xl font-black text-zinc-900 mb-6">Profile Settings</h1>
      
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar Upload */}
          <div className="flex items-center gap-6 pb-6 border-b border-zinc-100">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0">
                {photoURL || user.photoURL ? (
                  <img src={photoURL || user.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials()
                )}
              </div>
              <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:border-zinc-900 transition-colors shadow-sm cursor-pointer group-hover:scale-105">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Profile Photo</h3>
              <p className="text-sm text-zinc-500 mt-1">We currently support image URL links.</p>
              <input 
                type="url" 
                placeholder="https://example.com/image.jpg"
                value={photoURL}
                onChange={e => setPhotoURL(e.target.value)}
                className="mt-2 w-full max-w-xs p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:border-zinc-900 outline-none"
              />
            </div>
          </div>

          {message && (
            <div className="p-4 bg-success/10 text-success rounded-xl flex items-start gap-3 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              value={user.email || ''}
              disabled
              className="w-full p-4 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-500 mt-2">Email address cannot be changed currently.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
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
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

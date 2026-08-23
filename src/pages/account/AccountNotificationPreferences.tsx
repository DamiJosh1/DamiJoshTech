import React, { useState, useEffect } from 'react';
import { useStore } from '../../StoreContext';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountNotificationPreferences() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
    newProducts: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchPreferences = async () => {
      try {
        const docRef = doc(db, 'notification_preferences', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPreferences({
             orderUpdates: docSnap.data().orderUpdates ?? true,
             promotions: docSnap.data().promotions ?? false,
             securityAlerts: docSnap.data().securityAlerts ?? true,
             newProducts: docSnap.data().newProducts ?? true
          });
        }
      } catch (err) {
        console.error("Error fetching preferences", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'notification_preferences', user.uid), {
        ...preferences,
        updatedAt: serverTimestamp()
      }, { merge: true });
      navigate('/account/notifications');
    } catch (err) {
      console.error(err);
      alert('Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ label, description, checked, onChange, disabled = false }: any) => (
    <div className="flex items-start justify-between gap-4 py-5 border-b border-zinc-100 last:border-0">
      <div>
        <p className="text-sm font-bold text-zinc-900">{label}</p>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>
      <button 
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-zinc-900' : 'bg-zinc-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  if (loading) {
     return <div className="animate-pulse flex space-y-4 flex-col"><div className="h-8 w-48 bg-zinc-200 rounded"></div><div className="h-64 bg-zinc-100 rounded-2xl w-full"></div></div>;
  }

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/account/notifications')} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">EMAIL PREFERENCES</h1>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 mb-6">
        <Toggle 
          label="Order Updates" 
          description="Shipping confirmations, delivery updates, and order status."
          checked={preferences.orderUpdates}
          onChange={(val: boolean) => setPreferences(prev => ({...prev, orderUpdates: val}))}
        />
        <Toggle 
          label="Security Alerts" 
          description="Password changes, login alerts, and account recovery."
          checked={preferences.securityAlerts}
          onChange={() => {}}
          disabled={true} 
        />
        <p className="text-xs text-zinc-400 -mt-2 mb-4 px-2">Security and critical transaction notifications cannot be disabled.</p>
        <Toggle 
          label="Promotions & Deals" 
          description="Flash sales, coupons, and special offers."
          checked={preferences.promotions}
          onChange={(val: boolean) => setPreferences(prev => ({...prev, promotions: val}))}
        />
        <Toggle 
          label="New Products" 
          description="Be the first to know about new arrivals and back-in-stock items."
          checked={preferences.newProducts}
          onChange={(val: boolean) => setPreferences(prev => ({...prev, newProducts: val}))}
        />
      </div>

      <button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full sm:w-auto px-8 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        {saving ? 'SAVING...' : 'SAVE PREFERENCES'}
      </button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { MapPin, Plus, Trash2, Edit2 } from 'lucide-react';

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', addressLine1: '', addressLine2: '',
    city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    if (!auth.currentUser) return;
    try {
      const q = query(collection(db, 'addresses'), where('userId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(fetched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    try {
      setLoading(true);
      
      // If setting as default, remove default from others
      if (formData.isDefault) {
        const defaultAddrs = addresses.filter(a => a.isDefault && a.id !== editingId);
        for (const addr of defaultAddrs) {
          await updateDoc(doc(db, 'addresses', addr.id), { isDefault: false });
        }
      }

      // If this is the first address, force it to be default
      const willBeDefault = formData.isDefault || addresses.length === 0 || (addresses.length === 1 && addresses[0].id === editingId);

      const dataToSave = {
        ...formData,
        userId: auth.currentUser.uid,
        isDefault: willBeDefault,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'addresses', editingId), dataToSave);
      } else {
        const newRef = doc(collection(db, 'addresses'));
        await setDoc(newRef, { ...dataToSave, createdAt: serverTimestamp(), id: newRef.id });
      }

      await fetchAddresses();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        firstName: '', lastName: '', addressLine1: '', addressLine2: '',
        city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteDoc(doc(db, 'addresses', id));
      await fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (addr: any) => {
    setFormData(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-black text-zinc-900">Addresses</h2>
        {!showForm && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                firstName: '', lastName: '', addressLine1: '', addressLine2: '',
                city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false
              });
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> ADD NEW
          </button>
        )}
      </div>
      <p className="text-zinc-500 font-medium mb-8 pb-8 border-b border-zinc-100">
        Manage your delivery addresses.
      </p>

      {showForm ? (
        <form onSubmit={handleSave} className="bg-zinc-50 border border-zinc-200 rounded-[1.5rem] p-6 max-w-2xl">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">First Name</label>
              <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Last Name</label>
              <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Address Line 1</label>
            <input type="text" required value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Address Line 2 (Optional)</label>
            <input type="text" value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">City</label>
              <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">State / Region</label>
              <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Postal Code</label>
              <input type="text" required value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Country</label>
              <input type="text" required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">Phone Number</label>
            <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" />
          </div>
          <div className="mb-6 flex items-center gap-2">
            <input type="checkbox" id="default" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer" />
            <label htmlFor="default" className="text-sm font-bold text-zinc-700 cursor-pointer">Set as default address</label>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">
              {loading ? 'Saving...' : 'SAVE ADDRESS'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-bold hover:border-zinc-900 transition-colors">
              CANCEL
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-zinc-50 rounded-[1.5rem] border border-zinc-200">
          <MapPin className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No addresses saved</h3>
          <p className="text-zinc-500 mb-6">Add an address to make checkout faster.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
          >
            ADD ADDRESS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white border border-zinc-200 rounded-[1.5rem] p-6 hover:shadow-lg transition-all relative">
              {addr.isDefault && (
                <span className="absolute top-6 right-6 bg-zinc-100 text-zinc-900 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                  DEFAULT
                </span>
              )}
              <h3 className="font-bold text-zinc-900 mb-1">{addr.firstName} {addr.lastName}</h3>
              <p className="text-sm text-zinc-500 mb-4">{addr.phone}</p>
              <div className="text-sm text-zinc-700 space-y-1 mb-6">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                <p>{addr.country}</p>
              </div>
              <div className="flex items-center gap-4 border-t border-zinc-100 pt-4">
                <button onClick={() => startEdit(addr)} className="text-sm font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 transition-colors">
                  <Edit2 className="w-4 h-4" /> EDIT
                </button>
                <button onClick={() => handleDelete(addr.id)} className="text-sm font-bold text-error hover:text-red-700 flex items-center gap-1 transition-colors">
                  <Trash2 className="w-4 h-4" /> DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

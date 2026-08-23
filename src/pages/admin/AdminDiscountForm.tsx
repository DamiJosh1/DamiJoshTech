import React, { useState } from 'react';
import { collection, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Promotion } from '../../types';

export default function AdminDiscountForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [promo, setPromo] = useState<Partial<Promotion>>({
    name: '',
    description: '',
    type: 'coupon',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    status: 'active',
    isStackable: false,
    minOrderValue: 0,
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...promo,
        endDate: promo.endDate ? Timestamp.fromDate(new Date(promo.endDate)) : null,
        createdAt: serverTimestamp(),
      };
      
      // Basic validation
      if (data.type === 'coupon' && !data.code) {
        alert("Coupons require a promo code.");
        setLoading(false);
        return;
      }
      
      await addDoc(collection(db, 'promotions'), data);
      navigate('/admin/discounts');
    } catch (err) {
      console.error(err);
      alert("Failed to save promotion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/discounts')}
          className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Create Promotion</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Promotion Name</label>
              <input 
                type="text" 
                required 
                value={promo.name}
                onChange={e => setPromo({...promo, name: e.target.value})}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500"
                placeholder="e.g. Summer Sale 2026"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Type</label>
              <select 
                value={promo.type}
                onChange={e => setPromo({...promo, type: e.target.value as any})}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500 capitalize"
              >
                <option value="coupon">Coupon Code</option>
                <option value="flash_sale">Flash Sale</option>
                <option value="automatic">Automatic Discount</option>
              </select>
            </div>
            
            {promo.type === 'coupon' && (
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Promo Code</label>
                <input 
                  type="text" 
                  value={promo.code}
                  onChange={e => setPromo({...promo, code: e.target.value.toUpperCase()})}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500 uppercase tracking-wider font-mono"
                  placeholder="e.g. SUMMER20"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Discount Type</label>
              <select 
                value={promo.discountType}
                onChange={e => setPromo({...promo, discountType: e.target.value as any})}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Discount Value</label>
              <input 
                type="number" 
                required 
                min="0"
                step="0.01"
                value={promo.discountValue}
                onChange={e => setPromo({...promo, discountValue: parseFloat(e.target.value)})}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">End Date & Time</label>
              <input 
                type="datetime-local" 
                value={promo.endDate as any}
                onChange={e => setPromo({...promo, endDate: e.target.value as any})}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin/discounts')}
            className="px-6 py-3 font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Promotion'}
          </button>
        </div>
      </form>
    </div>
  );
}

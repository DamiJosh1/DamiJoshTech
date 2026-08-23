import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Promotion } from '../../types';
import { Tag, Plus, Edit2, Trash2, PauseCircle, PlayCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDiscounts() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'promotions'), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
      setPromotions(fetched);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleStatus = async (promo: Promotion) => {
    if (!promo.id) return;
    const newStatus = promo.status === 'active' ? 'paused' : 'active';
    await updateDoc(doc(db, 'promotions', promo.id), { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      await deleteDoc(doc(db, 'promotions', id));
    }
  };

  const filteredPromos = promotions.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">Promotions & Discounts</h2>
          <p className="text-zinc-500 font-medium">Manage coupons, flash sales, and automatic discounts.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/discounts/new')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Create Promotion
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search promotions..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500 bg-white"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Name / Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">Loading promotions...</td>
                </tr>
              ) : filteredPromos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Tag className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                    <p className="text-zinc-500 text-base">No promotions found.</p>
                    <button onClick={() => navigate('/admin/discounts/new')} className="mt-4 text-indigo-600 font-bold hover:underline">Create your first promotion</button>
                  </td>
                </tr>
              ) : (
                filteredPromos.map(promo => (
                  <tr key={promo.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-zinc-900">{promo.name}</div>
                      {promo.code && <div className="text-xs text-zinc-500 font-mono mt-1">{promo.code}</div>}
                    </td>
                    <td className="p-4 capitalize">{promo.type.replace('_', ' ')}</td>
                    <td className="p-4">
                      {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$\${promo.discountValue}`}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                        promo.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        promo.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                        promo.status === 'expired' ? 'bg-rose-100 text-rose-700' :
                        'bg-zinc-100 text-zinc-700'
                      }`}>
                        {promo.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleStatus(promo)}
                          className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title={promo.status === 'active' ? 'Pause' : 'Activate'}
                        >
                          {promo.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => promo.id && handleDelete(promo.id)}
                          className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

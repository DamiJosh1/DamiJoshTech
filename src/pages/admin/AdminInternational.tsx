import React, { useState, useEffect } from 'react';
import { useStore } from '../../StoreContext';
import { Globe, DollarSign, Truck, FileText } from 'lucide-react';
import { collection, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminInternational() {
  const { countries, currencies, shippingMethods, taxRules } = useStore();
  const [activeTab, setActiveTab] = useState<'countries' | 'currencies' | 'shipping' | 'taxes'>('countries');

  const toggleCountry = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'countries', id), { active: !current });
  };
  
  const toggleCurrency = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'currencies', id), { active: !current });
  };
  
  const toggleShipping = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'shipping_methods', id), { active: !current });
  };
  
  const toggleTax = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'tax_rules', id), { active: !current });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">International Commerce</h1>
        <p className="text-zinc-500">Manage countries, currencies, shipping zones, and tax rules.</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-zinc-200">
        <button onClick={() => setActiveTab('countries')} className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'countries' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-zinc-500'}`}>Countries</button>
        <button onClick={() => setActiveTab('currencies')} className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'currencies' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-zinc-500'}`}>Currencies</button>
        <button onClick={() => setActiveTab('shipping')} className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'shipping' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-zinc-500'}`}>Shipping Zones</button>
        <button onClick={() => setActiveTab('taxes')} className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'taxes' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-zinc-500'}`}>Taxes</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        {activeTab === 'countries' && (
          <div>
            <h3 className="font-bold text-lg mb-4">Supported Countries</h3>
            <div className="space-y-3">
              {countries.map(c => (
                <div key={c.id} className="flex justify-between items-center p-4 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="font-bold">{c.name} ({c.code})</p>
                    <p className="text-xs text-zinc-500">Default Currency: {c.currencyCode}</p>
                  </div>
                  <button onClick={() => toggleCountry(c.id!, c.active)} className={`px-3 py-1 rounded-full text-xs font-bold ${c.active ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                    {c.active ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'currencies' && (
          <div>
            <h3 className="font-bold text-lg mb-4">Supported Currencies</h3>
            <div className="space-y-3">
              {currencies.map(c => (
                <div key={c.id} className="flex justify-between items-center p-4 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="font-bold">{c.code} ({c.symbol})</p>
                    <p className="text-xs text-zinc-500">Exchange Rate: {c.exchangeRate} (Precision: {c.decimalPrecision})</p>
                  </div>
                  <button onClick={() => toggleCurrency(c.id!, c.active)} className={`px-3 py-1 rounded-full text-xs font-bold ${c.active ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                    {c.active ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div>
            <h3 className="font-bold text-lg mb-4">Shipping Methods</h3>
            <div className="space-y-3">
              {shippingMethods.map(m => (
                <div key={m.id} className="flex justify-between items-center p-4 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="font-bold">{m.name} ({m.type})</p>
                    <p className="text-xs text-zinc-500">Price: ${m.price.toFixed(2)} | Delivery: {m.minDays}-{m.maxDays} days</p>
                    <p className="text-xs text-zinc-500">Countries: {m.countryCodes.join(', ')}</p>
                  </div>
                  <button onClick={() => toggleShipping(m.id!, m.active)} className={`px-3 py-1 rounded-full text-xs font-bold ${m.active ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                    {m.active ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'taxes' && (
          <div>
            <h3 className="font-bold text-lg mb-4">Tax Rules</h3>
            <div className="space-y-3">
              {taxRules.map(t => (
                <div key={t.id} className="flex justify-between items-center p-4 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="font-bold">Country: {t.countryCode}</p>
                    <p className="text-xs text-zinc-500">Rate: {t.ratePercentage}%</p>
                  </div>
                  <button onClick={() => toggleTax(t.id!, t.active)} className={`px-3 py-1 rounded-full text-xs font-bold ${t.active ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                    {t.active ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

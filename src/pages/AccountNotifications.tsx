import React, { useState } from 'react';
import { Bell, Package, Tag, AlertCircle } from 'lucide-react';

export default function AccountNotifications() {
  const [preferences, setPreferences] = useState({
    orderEmails: true,
    shippingUpdates: true,
    promotions: false,
    newsletter: false
  });

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-black text-zinc-900 mb-2">Notifications</h2>
      <p className="text-zinc-500 font-medium mb-8 pb-8 border-b border-zinc-100">
        Manage how we communicate with you.
      </p>

      <div className="max-w-2xl">
        <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5" /> Communication Preferences
        </h3>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50">
            <div>
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-zinc-500" /> Order Updates
              </h4>
              <p className="text-sm text-zinc-500 font-medium">Receive emails about your order status, payment confirmations, and receipts.</p>
              <p className="text-xs text-zinc-400 mt-2 italic">Required for transactional purposes.</p>
            </div>
            <div className="relative inline-flex items-center cursor-not-allowed shrink-0">
              <input type="checkbox" checked={preferences.orderEmails} disabled className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 opacity-60"></div>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors bg-white">
            <div>
              <h4 className="font-bold text-zinc-900 mb-1">Shipping & Delivery</h4>
              <p className="text-sm text-zinc-500 font-medium">Get notified when your order is shipped, out for delivery, and delivered.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={preferences.shippingUpdates} 
                onChange={e => setPreferences({...preferences, shippingUpdates: e.target.checked})} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
            </label>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors bg-white">
            <div>
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-zinc-500" /> Promotions & Offers
              </h4>
              <p className="text-sm text-zinc-500 font-medium">Receive emails about exclusive discounts, sales, and special offers.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={preferences.promotions} 
                onChange={e => setPreferences({...preferences, promotions: e.target.checked})} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
            </label>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors bg-white">
            <div>
              <h4 className="font-bold text-zinc-900 mb-1">Newsletter</h4>
              <p className="text-sm text-zinc-500 font-medium">Stay up to date with new product releases and SAJODA news.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={preferences.newsletter} 
                onChange={e => setPreferences({...preferences, newsletter: e.target.checked})} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

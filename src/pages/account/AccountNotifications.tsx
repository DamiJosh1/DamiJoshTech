import React, { useState } from 'react';
import { Bell, Check, Trash2, Settings, Package, CreditCard, ShieldCheck, Tag, Info, AlertTriangle, TrendingDown } from 'lucide-react';
import { useStore } from '../../StoreContext';
import { useNavigate } from 'react-router-dom';
import { AppNotification } from '../../types';

export default function AccountNotifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, formatPrice } = useStore();
  const navigate = useNavigate();
  
  const getIcon = (type: string) => {
    if (type.includes('ORDER')) return <Package className="w-5 h-5 text-primary-blue" />;
    if (type.includes('PAYMENT')) return <CreditCard className="w-5 h-5 text-emerald-500" />;
    if (type.includes('SECURITY') || type.includes('PASSWORD') || type.includes('EMAIL')) return <ShieldCheck className="w-5 h-5 text-amber-500" />;
    if (type.includes('PRICE_ALERT')) return <TrendingDown className="w-5 h-5 text-emerald-600" />;
    if (type.includes('PROMOTION')) return <Tag className="w-5 h-5 text-error" />;
    if (type.includes('REFUND') || type.includes('RETURN')) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    return <Info className="w-5 h-5 text-zinc-400" />;
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read && notif.id) {
      markNotificationAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">NOTIFICATIONS</h1>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">Alerts for orders, promotions, and product price drops.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => navigate('/account/price-alerts')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            <TrendingDown className="w-4 h-4" /> Price Alerts
          </button>
          <button 
            onClick={() => navigate('/account/notifications/preferences')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            <Settings className="w-4 h-4" /> Preferences
          </button>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl hover:bg-zinc-50 transition-colors"
            >
              <Check className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
            <Bell className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2 uppercase tracking-tight">You're all caught up.</h2>
          <p className="text-zinc-500 max-w-md">You don't have any new notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`group flex items-start gap-4 p-5 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}
              onClick={() => handleNotificationClick(notif)}
            >
              {notif.productImage ? (
                <img 
                  src={notif.productImage} 
                  alt="" 
                  className="w-12 h-12 rounded-xl object-cover border border-zinc-200 bg-zinc-50 shrink-0" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm">
                  {getIcon(notif.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold truncate ${!notif.read ? 'text-zinc-900' : 'text-zinc-700'}`}>
                        {notif.title}
                      </h3>
                      {notif.type === 'PRICE_ALERT' && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 shrink-0">
                          Price Drop
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${!notif.read ? 'text-zinc-700 font-medium' : 'text-zinc-500'}`}>
                      {notif.message}
                    </p>
                    {notif.priceData && (
                      <div className="mt-2 flex items-center gap-2 text-xs bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200 w-fit">
                        <span className="text-zinc-400 line-through text-[11px]">{formatPrice(notif.priceData.oldPrice)}</span>
                        <span className="font-black text-emerald-600 text-xs">{formatPrice(notif.priceData.newPrice)}</span>
                        <span className="text-zinc-500 text-[10px]">(Target: {formatPrice(notif.priceData.targetPrice)})</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">
                    {formatTime(notif.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!notif.read && (
                   <div className="w-2.5 h-2.5 bg-primary-blue rounded-full shrink-0"></div>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); if (notif.id) deleteNotification(notif.id); }}
                  className="p-2 text-zinc-400 hover:text-error hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

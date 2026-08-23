import React, { useState } from 'react';
import { Bell, Check, Trash2, Settings, Package, CreditCard, ShieldCheck, Tag, Info, AlertTriangle } from 'lucide-react';
import { useStore } from '../../StoreContext';
import { useNavigate } from 'react-router-dom';
import { AppNotification } from '../../types';

export default function AccountNotifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useStore();
  const navigate = useNavigate();
  
  const getIcon = (type: string) => {
    if (type.includes('ORDER')) return <Package className="w-5 h-5 text-primary-blue" />;
    if (type.includes('PAYMENT')) return <CreditCard className="w-5 h-5 text-emerald-500" />;
    if (type.includes('SECURITY') || type.includes('PASSWORD') || type.includes('EMAIL')) return <ShieldCheck className="w-5 h-5 text-amber-500" />;
    if (type.includes('PROMOTION') || type.includes('PRICE_ALERT')) return <Tag className="w-5 h-5 text-error" />;
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
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">NOTIFICATIONS</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/account/notifications/preferences')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            <Settings className="w-4 h-4" /> Preferences
          </button>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-200 text-zinc-700 text-sm font-bold rounded-xl hover:bg-zinc-50 transition-colors"
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
              <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-sm font-bold truncate ${!notif.read ? 'text-zinc-900' : 'text-zinc-700'}`}>
                      {notif.title}
                    </h3>
                    <p className={`text-sm mt-1 ${!notif.read ? 'text-zinc-700 font-medium' : 'text-zinc-500'}`}>
                      {notif.message}
                    </p>
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

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, TrendingDown, ArrowRight, ExternalLink, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { AppNotification } from '../types';

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const { 
    notifications, 
    unreadNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    formatPrice,
    user
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PRICE_ALERT'>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayedNotifications = notifications.filter(n => {
    if (filter === 'PRICE_ALERT') return n.type === 'PRICE_ALERT';
    return true;
  });

  const priceAlertCount = notifications.filter(n => n.type === 'PRICE_ALERT').length;

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read && notif.id) {
      markNotificationAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 relative rounded-full hover:bg-zinc-100 transition-colors text-charcoal hover:text-zinc-900 cursor-pointer"
        aria-label="Notifications"
        title="Notifications & Price Alerts"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xs animate-pulse">
            {unreadNotifications > 99 ? '99+' : unreadNotifications}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 animate-scale-in origin-top-right">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-zinc-900 text-sm">Notifications</h3>
              {unreadNotifications > 0 && (
                <span className="text-[10px] font-bold bg-primary-blue/10 text-primary-blue px-2 py-0.5 rounded-full">
                  {unreadNotifications} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadNotifications > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-primary-blue hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Mark read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-zinc-100 bg-white text-xs">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                filter === 'ALL'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('PRICE_ALERT')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                filter === 'PRICE_ALERT'
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <TrendingDown className="w-3 h-3" />
              Price Drops ({priceAlertCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-100">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold text-zinc-600">No notifications yet</p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Track products with the Price Drop Alert button to get instant alerts here.
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => {
                const isPriceAlert = notif.type === 'PRICE_ALERT';
                return (
                  <div
                    key={notif.id || Math.random().toString()}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 flex gap-3 hover:bg-zinc-50 transition-colors cursor-pointer group relative ${
                      !notif.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Unread indicator */}
                    {!notif.read && (
                      <div className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-primary-blue" />
                    )}

                    {/* Left Icon / Thumbnail */}
                    <div className="shrink-0">
                      {isPriceAlert && notif.productImage ? (
                        <div className="relative">
                          <img
                            src={notif.productImage}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-200 bg-white"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <TrendingDown className="w-3 h-3" />
                          </div>
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isPriceAlert 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {isPriceAlert ? <TrendingDown className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isPriceAlert 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {isPriceAlert ? '🔥 PRICE DROP' : notif.type}
                        </span>
                        {notif.id && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id!);
                            }}
                            className="text-zinc-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <h4 className="font-bold text-zinc-900 text-xs mt-1 truncate">
                        {notif.title}
                      </h4>
                      <p className="text-[11px] text-zinc-600 line-clamp-2 mt-0.5 leading-snug">
                        {notif.message}
                      </p>

                      {/* Price Difference Preview if available */}
                      {notif.priceData && (
                        <div className="mt-1.5 flex items-center gap-2 text-xs bg-white px-2 py-1 rounded-md border border-zinc-200 w-fit">
                          <span className="text-zinc-400 line-through text-[11px]">
                            {formatPrice(notif.priceData.oldPrice)}
                          </span>
                          <span className="font-black text-emerald-600 text-xs">
                            {formatPrice(notif.priceData.newPrice)}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            (Target: {formatPrice(notif.priceData.targetPrice)})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action Links */}
          <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/account/price-alerts');
              }}
              className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
            >
              <TrendingDown className="w-3.5 h-3.5" /> Manage Price Alerts
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/account/notifications');
              }}
              className="text-zinc-700 hover:text-zinc-900 flex items-center gap-1 transition-colors"
            >
              All Notifications <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

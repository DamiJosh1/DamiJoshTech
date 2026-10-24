import React, { useState, useEffect } from 'react';
import { X, Bell, TrendingDown, Check, ShieldAlert, Sparkles, AlertCircle, ArrowDownRight, Trash2 } from 'lucide-react';
import { Product, PriceAlert } from '../types';
import { useStore } from '../StoreContext';

interface PriceAlertModalProps {
  product: Product | null;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ product, onClose }) => {
  const { 
    user, 
    formatPrice, 
    createPriceAlert, 
    removePriceAlert, 
    getActiveAlertForProduct,
    simulatePriceDrop 
  } = useStore();

  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [requestPush, setRequestPush] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const existingAlert: PriceAlert | undefined = product ? getActiveAlertForProduct(product.id) : undefined;

  useEffect(() => {
    if (product) {
      if (existingAlert) {
        setTargetPrice(existingAlert.targetPrice);
        setEmail(existingAlert.userEmail || user?.email || '');
      } else {
        // Default to 10% below current price rounded to nearest hundred
        const defaultTarget = Math.round((product.price * 0.9) / 100) * 100;
        setTargetPrice(defaultTarget);
        setEmail(user?.email || '');
      }
      setSuccessMsg(null);
      setErrorMsg(null);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        setRequestPush(true);
      }
    }
  }, [product, existingAlert, user]);

  if (!product) return null;

  const discountPercent = product.price > 0 && targetPrice < product.price
    ? Math.round(((product.price - targetPrice) / product.price) * 100)
    : 0;

  const savingsAmount = Math.max(0, product.price - targetPrice);

  const applyPresetDiscount = (percentage: number) => {
    const calculated = Math.round((product.price * (1 - percentage / 100)) / 100) * 100;
    setTargetPrice(calculated);
  };

  const handleTogglePush = async () => {
    if (!('Notification' in window)) {
      setErrorMsg("Browser notifications are not supported in this browser.");
      return;
    }
    if (Notification.permission === 'granted') {
      setRequestPush(!requestPush);
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setRequestPush(true);
      } else {
        setRequestPush(false);
      }
    } catch (e) {
      console.warn("Notification request permission error", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || targetPrice <= 0) {
      setErrorMsg("Please enter a valid price threshold greater than 0.");
      return;
    }
    if (targetPrice >= product.price) {
      setErrorMsg(`Your target threshold must be lower than the current price of ${formatPrice(product.price)}.`);
      return;
    }
    if (!user && !email.trim()) {
      setErrorMsg("Please provide an email address so we can notify you.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await createPriceAlert(product, targetPrice, email);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create price alert.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingAlert?.id) return;
    setIsSubmitting(true);
    try {
      await removePriceAlert(existingAlert.id);
      setSuccessMsg("Price alert removed successfully.");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg("Failed to delete alert.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestSimulation = async () => {
    setIsSimulating(true);
    setErrorMsg(null);
    try {
      // If alert not saved yet, save it first
      if (!existingAlert) {
        await createPriceAlert(product, targetPrice, email);
      }
      // Trigger price drop to targetPrice
      await simulatePriceDrop(product.id, targetPrice);
      setSuccessMsg(`Simulated price drop to ${formatPrice(targetPrice)}! Check your notification bell and screen.`);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg("Failed to simulate price drop.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 animate-scale-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-zinc-900 text-lg leading-tight">Price Drop Alert</h3>
              <p className="text-xs text-zinc-500 font-medium">Get notified automatically when price falls</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Product Summary */}
          <div className="flex gap-4 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100 items-center">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover bg-white border border-zinc-200 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  product.condition === 'used'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-zinc-900 text-white'
                }`}>
                  {product.condition === 'used' ? 'Pre-Owned' : 'Brand New'}
                </span>
                {existingAlert && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Tracking Active
                  </span>
                )}
              </div>
              <h4 className="font-bold text-zinc-900 text-sm truncate">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-500 font-medium">Current Price:</span>
                <span className="font-black text-zinc-900 text-sm">{formatPrice(product.price)}</span>
              </div>
            </div>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 animate-fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Quick Discount Presets */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Quick Target Discount Presets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((pct) => {
                  const presetTarget = Math.round((product.price * (1 - pct / 100)) / 100) * 100;
                  const isSelected = Math.abs(targetPrice - presetTarget) < 50;
                  return (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => applyPresetDiscount(pct)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        isSelected 
                          ? 'border-primary-blue bg-blue-50/60 text-primary-blue ring-1 ring-primary-blue shadow-xs' 
                          : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <div className="font-black">-{pct}%</div>
                      <div className="text-[10px] text-zinc-500 font-normal mt-0.5 truncate">{formatPrice(presetTarget)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Price Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Target Price Threshold (₦)
                </label>
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Save {discountPercent}% ({formatPrice(savingsAmount)})
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 font-bold text-sm">
                  ₦
                </div>
                <input
                  type="number"
                  min="1"
                  step="50"
                  max={product.price - 1}
                  value={targetPrice || ''}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  placeholder={`e.g. ${Math.round(product.price * 0.9)}`}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-zinc-200 rounded-xl font-bold text-zinc-900 text-base focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all"
                  required
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-primary-blue" />
                Alert fires the instant the item price drops to or below this threshold.
              </p>
            </div>

            {/* Email Notification Option */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Notification Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all"
                required={!user}
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                We'll email you a direct buy link as soon as price drops.
              </p>
            </div>

            {/* Push Notifications Toggle */}
            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-700">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900">Instant Browser Notification</h5>
                  <p className="text-[11px] text-zinc-500">Pop-up alert even if tab is in background</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTogglePush}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  requestPush ? 'bg-primary-blue justify-end' : 'bg-zinc-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>

            {/* Submit / Update Button */}
            <div className="flex gap-3 pt-2">
              {existingAlert && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting || isSimulating}
                  className="px-4 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Remove this price alert"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting || isSimulating}
                className="flex-1 py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-lg shadow-zinc-900/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Bell className="w-4 h-4 text-emerald-400" />
                {isSubmitting 
                  ? 'Saving...' 
                  : existingAlert 
                    ? `Update Alert (${formatPrice(targetPrice)})` 
                    : `Set Price Drop Alert (${formatPrice(targetPrice)})`}
              </button>
            </div>
          </form>

          {/* Test & Simulation Section */}
          <div className="pt-3 border-t border-zinc-100">
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-left">
                <Sparkles className="w-4 h-4 text-primary-blue shrink-0" />
                <div>
                  <h6 className="text-xs font-bold text-zinc-900">Want to test right now?</h6>
                  <p className="text-[11px] text-zinc-600">Simulate a price drop to your target to see the notification trigger live.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTestSimulation}
                disabled={isSimulating || isSubmitting}
                className="w-full sm:w-auto px-3.5 py-2 bg-primary-blue hover:bg-blue-800 text-white text-xs font-bold rounded-xl shrink-0 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isSimulating ? 'Simulating...' : '⚡ Test Drop Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

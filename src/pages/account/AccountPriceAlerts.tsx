import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingDown, 
  Bell, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../StoreContext';
import { PriceAlert } from '../../types';

export default function AccountPriceAlerts() {
  const navigate = useNavigate();
  const { 
    priceAlerts, 
    removePriceAlert, 
    setPriceAlertModalProduct, 
    products, 
    formatPrice, 
    simulatePriceDrop,
    user 
  } = useStore();

  const [filter, setFilter] = useState<'all' | 'active' | 'triggered'>('all');
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Filter alerts
  const filteredAlerts = priceAlerts.filter(a => {
    if (filter === 'active') return a.status === 'active';
    if (filter === 'triggered') return a.status === 'triggered';
    return true;
  });

  const activeCount = priceAlerts.filter(a => a.status === 'active').length;
  const triggeredCount = priceAlerts.filter(a => a.status === 'triggered').length;

  const handleSimulate = async (alert: PriceAlert) => {
    setSimulatingId(alert.id || alert.productId);
    try {
      await simulatePriceDrop(alert.productId, alert.targetPrice);
      setFeedbackMsg(`Price drop simulated for "${alert.productName}" to ${formatPrice(alert.targetPrice)}! Check your bell icon.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulatingId(null);
    }
  };

  const handleEdit = (alert: PriceAlert) => {
    const liveProd = products.find(p => p.id === alert.productId);
    if (liveProd) {
      setPriceAlertModalProduct(liveProd);
    } else {
      // Create partial product
      setPriceAlertModalProduct({
        id: alert.productId,
        name: alert.productName,
        price: alert.initialPrice,
        image: alert.productImage,
        condition: 'new',
        category: 'Electronics',
        rating: 4.8,
        description: ''
      } as any);
    }
  };

  const handleDelete = async (alertId?: string) => {
    if (!alertId) return;
    if (confirm("Are you sure you want to remove this price alert?")) {
      await removePriceAlert(alertId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingDown className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              PRICE DROP ALERTS
            </h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium">
            Monitor target price thresholds and receive instant alerts when prices drop.
          </p>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          Track More Products <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Tracked</span>
            <Bell className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900">{priceAlerts.length}</div>
          <p className="text-xs text-zinc-400 mt-1">Products on your radar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Monitoring</span>
            <Clock className="w-4 h-4 text-primary-blue" />
          </div>
          <div className="text-2xl font-black text-primary-blue">{activeCount}</div>
          <p className="text-xs text-zinc-400 mt-1">Waiting for price drops</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Price Drops Triggered</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{triggeredCount}</div>
          <p className="text-xs text-zinc-400 mt-1">Target price reached or beaten!</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          All ({priceAlerts.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'active'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('triggered')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'triggered'
              ? 'bg-emerald-700 text-white'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Drops Triggered ({triggeredCount})
        </button>
      </div>

      {/* Alert List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <TrendingDown className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-zinc-900 mb-1">No Price Alerts Found</h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
            Never overpay again. Set custom price drop alerts on phones, laptops, and home appliances to receive instant notifications the moment they go on sale.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Browse Catalog
            </button>
            <button
              onClick={() => navigate('/deals')}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold rounded-xl transition-colors"
            >
              View Hot Deals
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map((alert) => {
            const liveProduct = products.find(p => p.id === alert.productId);
            const currentLivePrice = liveProduct ? liveProduct.price : alert.initialPrice;
            const isTriggered = alert.status === 'triggered' || currentLivePrice <= alert.targetPrice;
            const savingsAtTarget = Math.max(0, alert.initialPrice - alert.targetPrice);

            return (
              <div 
                key={alert.id || alert.productId}
                className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left: Product Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <img
                    src={alert.productImage}
                    alt={alert.productName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-zinc-50 border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isTriggered ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Price Target Reached!
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-primary-blue border border-blue-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-blue animate-ping" />
                          Actively Monitoring
                        </span>
                      )}
                    </div>
                    
                    <h3 
                      onClick={() => navigate(`/product/${alert.productId}`)}
                      className="font-bold text-zinc-900 text-sm sm:text-base hover:text-primary-blue cursor-pointer truncate transition-colors"
                    >
                      {alert.productName}
                    </h3>

                    {/* Price Comparison */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs">
                      <div>
                        <span className="text-zinc-400 block text-[10px]">When Alert Set:</span>
                        <span className="font-semibold text-zinc-600">{formatPrice(alert.initialPrice)}</span>
                      </div>
                      <div className="h-4 w-px bg-zinc-200" />
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Your Target:</span>
                        <span className="font-black text-zinc-900">{formatPrice(alert.targetPrice)}</span>
                      </div>
                      <div className="h-4 w-px bg-zinc-200" />
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Live Current Price:</span>
                        <span className={`font-black ${currentLivePrice <= alert.targetPrice ? 'text-emerald-600' : 'text-primary-blue'}`}>
                          {formatPrice(currentLivePrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                  {/* Simulate Drop Button */}
                  <button
                    type="button"
                    onClick={() => handleSimulate(alert)}
                    disabled={simulatingId === (alert.id || alert.productId)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-primary-blue border border-blue-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    title="Simulate price drop immediately to trigger the notification"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{simulatingId === (alert.id || alert.productId) ? 'Simulating...' : 'Test Drop'}</span>
                  </button>

                  {/* Edit Threshold */}
                  <button
                    type="button"
                    onClick={() => handleEdit(alert)}
                    className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    title="Change target price"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  {/* View Product Link */}
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${alert.productId}`)}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity, RefreshCcw, CreditCard, ShoppingCart } from 'lucide-react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function AdminFinanceDashboard() {
  const [metrics, setMetrics] = useState({
    grossRevenue: 0,
    costOfGoods: 0,
    shippingCost: 0,
    paymentFees: 0,
    discounts: 0,
    refunds: 0,
    marketingCost: 0,
    grossProfit: 0,
    netProfit: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFinanceData() {
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        let totalRevenue = 0;
        let totalDiscounts = 0;
        let totalRefunds = 0; // Ideally fetch from refunds collection or order status
        let totalCogs = 0;

        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status !== 'cancelled' && data.status !== 'refunded') {
             totalRevenue += (data.total || 0);
          }
          if (data.status === 'refunded') {
             totalRefunds += (data.total || 0);
          }
          // Assuming we store cost data in items eventually. For now, estimate or zero.
          if (data.items) {
             data.items.forEach((item: any) => {
                 totalCogs += (item.supplierPrice || 0) * (item.quantity || 1);
             });
          }
        });

        // Basic calculation
        const grossProfit = totalRevenue - totalRefunds - totalCogs;
        const netProfit = grossProfit; // marketing and fees are zero for now if not tracked

        setMetrics({
          grossRevenue: totalRevenue,
          costOfGoods: totalCogs,
          shippingCost: 0,
          paymentFees: 0,
          discounts: totalDiscounts,
          refunds: totalRefunds,
          marketingCost: 0,
          grossProfit: grossProfit,
          netProfit: netProfit
        });
      } catch (err) {
        console.error("Error loading finance data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFinanceData();
  }, []);

  if (loading) {
     return <div className="p-8 text-center text-zinc-500">Loading financial data...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Gross Revenue</h3>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(metrics.grossRevenue)}</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Cost of Goods</h3>
            <ShoppingCart className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(metrics.costOfGoods)}</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Refunds</h3>
            <RefreshCcw className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(metrics.refunds)}</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">Gross Profit</h3>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-900">{formatCurrency(metrics.grossProfit)}</p>
          <p className="text-xs text-indigo-600 mt-1 font-medium">
            Margin: {metrics.grossRevenue > 0 ? ((metrics.grossProfit / metrics.grossRevenue) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Gross Sales</span>
              <span className="font-medium text-zinc-900">{formatCurrency(metrics.grossRevenue)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Discounts</span>
              <span className="font-medium text-red-600">-{formatCurrency(metrics.discounts)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Refunds</span>
              <span className="font-medium text-red-600">-{formatCurrency(metrics.refunds)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 bg-zinc-50 -mx-6 px-6">
              <span className="font-semibold text-zinc-900">Net Sales</span>
              <span className="font-bold text-zinc-900">{formatCurrency(metrics.grossRevenue - metrics.discounts - metrics.refunds)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Cost of Goods Sold (COGS)</span>
              <span className="font-medium text-amber-600">-{formatCurrency(metrics.costOfGoods)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Shipping Costs</span>
              <span className="font-medium text-amber-600">-{formatCurrency(metrics.shippingCost)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Payment Fees</span>
              <span className="font-medium text-amber-600">-{formatCurrency(metrics.paymentFees)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 bg-indigo-50 -mx-6 px-6">
              <span className="font-bold text-indigo-900">Gross Profit</span>
              <span className="font-bold text-indigo-700">{formatCurrency(metrics.grossProfit)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" /> AI Financial Analyst
          </h3>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 space-y-3">
            <p className="text-sm font-medium text-indigo-900">Based on recent data analysis:</p>
            <ul className="space-y-2 text-sm text-indigo-800 list-disc list-inside">
              <li>{metrics.grossRevenue === 0 ? "No revenue data found for this period." : `Revenue is tracking at ${formatCurrency(metrics.grossRevenue)} with a ${(metrics.grossProfit / metrics.grossRevenue * 100).toFixed(1)}% margin.`}</li>
              {metrics.costOfGoods === 0 && <li>Product cost data is incomplete or missing, which makes profit calculations inaccurate. Ensure product supplier costs are tracked.</li>}
              {metrics.refunds > 0 && <li>Refunds account for {((metrics.refunds / metrics.grossRevenue) * 100).toFixed(1)}% of gross revenue. Investigate top returned items.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

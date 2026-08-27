import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bot, Package, DollarSign, Globe, Truck, ArrowLeft, BarChart2, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminAiProductDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/ai/products" className="p-2 border border-zinc-200 text-zinc-500 rounded-lg hover:bg-zinc-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-zinc-900">Opportunity Report</h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">SCORE 92/100</span>
          </div>
          <p className="text-sm text-zinc-500">Product ID: {id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              AI Recommendation
            </h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-md">SELL</div>
                <span className="font-medium text-indigo-900">High Opportunity Detected</span>
              </div>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  Strong supplier availability with healthy inventory depth.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  Estimated margin (68%) exceeds your 30% configured target.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  Shipping is available to your selected primary market (UK).
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  Positive demand signals detected for "Portable Projectors".
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-zinc-400" />
              Financial & Cost Analysis
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-500 text-sm">Supplier Cost</span>
                <span className="font-medium">$28.00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-500 text-sm">Est. Shipping (UK)</span>
                <span className="font-medium">$7.50</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-500 text-sm">Est. Total Landed Cost</span>
                <span className="font-medium">$35.50</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-500 text-sm">AI Suggested Selling Price</span>
                <span className="font-bold text-indigo-600">$89.99</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500 text-sm">Est. Gross Profit</span>
                <span className="font-bold text-green-600">$54.49 (60%)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-zinc-400" />
              Score Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <p className="text-xs text-zinc-500 mb-1">Margin Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-zinc-900">95</span>
                  <span className="text-xs text-zinc-400 mb-1">/100</span>
                </div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <p className="text-xs text-zinc-500 mb-1">Supplier Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-zinc-900">88</span>
                  <span className="text-xs text-zinc-400 mb-1">/100</span>
                </div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <p className="text-xs text-zinc-500 mb-1">Shipping Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-zinc-900">82</span>
                  <span className="text-xs text-zinc-400 mb-1">/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-zinc-400" />
              Product Profile
            </h3>
            <div className="aspect-square bg-zinc-100 rounded-lg mb-4 flex items-center justify-center">
              <Package className="w-12 h-12 text-zinc-300" />
            </div>
            <h4 className="font-medium text-zinc-900 mb-2">Mini Portable Projector 1080p</h4>
            <div className="text-sm text-zinc-500 space-y-2">
              <p>Supplier: CJ Dropshipping</p>
              <p>Category: Electronics</p>
              <p>Inventory: 430 units</p>
            </div>
            
            <div className="mt-6 space-y-3">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
                CREATE DRAFT
              </button>
              <button className="w-full bg-white border border-zinc-200 text-zinc-700 font-medium py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                ADD TO WATCHLIST
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
             <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-zinc-400" />
              Disclaimer
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              AI analysis is based on available connected data from suppliers and platforms. It should be reviewed manually before making final business decisions. Actual shipping costs and margins may fluctuate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

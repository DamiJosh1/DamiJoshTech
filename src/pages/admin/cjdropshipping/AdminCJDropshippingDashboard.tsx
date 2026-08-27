import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, RefreshCw, AlertCircle, Search, Download, Package, ShoppingCart, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function AdminCJDropshippingDashboard() {
  const [status, setStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'CONNECTION ERROR' | 'LOADING'>('LOADING');
  const [lastCheck, setLastCheck] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [metrics, setMetrics] = useState({
    imported: 0,
    synced: 0,
    pendingFulfillment: 0,
    processing: 0,
    shipped: 0,
    syncErrors: 0
  });

  const checkConnection = async () => {
    setStatus('LOADING');
    try {
      const res = await fetch('/api/dropshipping/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        if (data.lastCheck) setLastCheck(data.lastCheck);
        if (data.message) setErrorMessage(data.message);
      } else {
        setStatus('CONNECTION ERROR');
      }
    } catch (err) {
      console.error(err);
      setStatus('CONNECTION ERROR');
    }
  };

  const loadMetrics = async () => {
    try {
      // Get imported products (where source = CJDROPSHIPPING)
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('source', '==', 'CJDROPSHIPPING'));
      const querySnapshot = await getDocs(q);
      
      setMetrics(prev => ({
        ...prev,
        imported: querySnapshot.size,
        synced: querySnapshot.size // Placeholder for synced
      }));
      
      // Get orders needing fulfillment
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      // Basic count for now
    } catch (err) {
      console.error("Error loading metrics:", err);
    }
  };

  useEffect(() => {
    checkConnection();
    loadMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Connection Card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              status === 'CONNECTED' ? 'bg-green-100 text-green-600' :
              status === 'DISCONNECTED' ? 'bg-zinc-100 text-zinc-500' :
              status === 'LOADING' ? 'bg-blue-100 text-blue-500' :
              'bg-red-100 text-red-600'
            }`}>
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">CJ Dropshipping Integration</h2>
              <div className="flex items-center gap-2 mt-1">
                {status === 'LOADING' ? (
                  <span className="text-sm font-medium text-blue-600 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Checking...
                  </span>
                ) : status === 'CONNECTED' ? (
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : status === 'DISCONNECTED' ? (
                  <span className="text-sm font-medium text-zinc-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Disconnected
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Connection Error
                  </span>
                )}
                
                {lastCheck && (
                  <>
                    <span className="text-zinc-300">•</span>
                    <span className="text-xs text-zinc-500">
                      Last successful connection: {new Date(lastCheck).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              {errorMessage && status !== 'CONNECTED' && (
                <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={checkConnection}
              disabled={status === 'LOADING'}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${status === 'LOADING' ? 'animate-spin' : ''}`} />
              Test Connection
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-sm font-medium text-zinc-500 mb-1">Imported Products</p>
          <p className="text-2xl font-bold text-zinc-900">{metrics.imported}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-sm font-medium text-zinc-500 mb-1">Synced Products</p>
          <p className="text-2xl font-bold text-zinc-900">{metrics.synced}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-sm font-medium text-zinc-500 mb-1">Pending Fulfillment</p>
          <p className="text-2xl font-bold text-zinc-900">{metrics.pendingFulfillment}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-sm font-medium text-zinc-500 mb-1">Processing Fulfillment</p>
          <p className="text-2xl font-bold text-zinc-900">{metrics.processing}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-sm font-medium text-zinc-500 mb-1">Shipped Orders</p>
          <p className="text-2xl font-bold text-zinc-900">{metrics.shipped}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-sm font-medium text-zinc-500 mb-1">Sync Errors</p>
          <p className="text-2xl font-bold text-zinc-900">{metrics.syncErrors}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-zinc-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/cjdropshipping/products" className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-zinc-900">Search Products</h4>
            <p className="text-sm text-zinc-500 mt-1">Discover new CJ products</p>
          </Link>
          
          <Link to="/admin/cjdropshipping/products" className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-zinc-900">Import Product</h4>
            <p className="text-sm text-zinc-500 mt-1">Import directly via ID</p>
          </Link>
          
          <Link to="/admin/cjdropshipping/sync" className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-zinc-900">Sync Inventory</h4>
            <p className="text-sm text-zinc-500 mt-1">Update stock and prices</p>
          </Link>
          
          <Link to="/admin/cjdropshipping/orders" className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-zinc-900">View Fulfillment</h4>
            <p className="text-sm text-zinc-500 mt-1">Manage CJ orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

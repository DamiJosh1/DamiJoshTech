import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Package, Heart, MapPin } from 'lucide-react';

export default function AccountDashboard() {
  const { profileData } = useOutletContext<any>();

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-black text-zinc-900 mb-2">Welcome back{profileData?.firstName ? `, ${profileData.firstName}` : ''}.</h2>
      <p className="text-zinc-500 font-medium mb-8 pb-8 border-b border-zinc-100">
        Here's what's happening with your account today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link to="/account/orders" className="group p-6 rounded-[1.5rem] bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-zinc-900 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Your Orders</h3>
          <p className="text-sm font-medium text-zinc-500">Track, return, or buy things again.</p>
        </Link>
        
        <Link to="/account/wishlist" className="group p-6 rounded-[1.5rem] bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-zinc-900 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Your Wishlist</h3>
          <p className="text-sm font-medium text-zinc-500">View and manage your saved items.</p>
        </Link>

        <Link to="/account/addresses" className="group p-6 rounded-[1.5rem] bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-zinc-900 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Addresses</h3>
          <p className="text-sm font-medium text-zinc-500">Edit delivery addresses for faster checkout.</p>
        </Link>
      </div>
      
      <div className="bg-zinc-50 rounded-[1.5rem] p-6 border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Need help?</h3>
          <p className="text-sm font-medium text-zinc-500">Our customer support team is here for you.</p>
        </div>
        <a href="mailto:support@sajoda.com" className="px-6 py-3 bg-white text-zinc-900 font-bold rounded-xl border border-zinc-200 hover:border-zinc-900 transition-colors whitespace-nowrap">
          Contact Support
        </a>
      </div>
    </div>
  );
}

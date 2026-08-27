import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function AdminCJOrders() {
  return (
    <div className="py-12 text-center text-zinc-500">
      <ShoppingCart className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
      <h2 className="text-xl font-bold text-zinc-900 mb-2">CJ Fulfillment</h2>
      <p>NO ORDERS READY FOR FULFILLMENT</p>
    </div>
  );
}

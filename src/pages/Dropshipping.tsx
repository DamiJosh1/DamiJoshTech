import React, { useContext } from 'react';
import DropshippingProducts from '../components/DropshippingProducts';
import { StoreContext } from '../StoreContext';

export default function Dropshipping() {
  const { isDarkMode } = useContext(StoreContext);
  
  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-zinc-950' : 'bg-slate-50'}`}>
      <DropshippingProducts isDarkMode={isDarkMode} />
    </div>
  );
}

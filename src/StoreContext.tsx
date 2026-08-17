import React, { createContext, useContext } from 'react';
import { Product } from './types';
import { User as FirebaseUser } from 'firebase/auth';

export interface StoreContextType {
  products: Product[];
  isDarkMode: boolean;
  user: FirebaseUser | null;
  wishlistIds: string[];
  addingToCartId: string | null;
  prefersReducedMotion: boolean;
  handleFeaturedAddToCart: (product: Product, e?: React.MouseEvent) => void;
  handleWishlistToggle: (product: Product, e: React.MouseEvent) => void;
  setQuickViewProduct: (product: Product | null) => void;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};

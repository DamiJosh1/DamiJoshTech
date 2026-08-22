const fs = require('fs');

const contextCode = `import React, { createContext, useContext } from 'react';
import { Product, CartItem } from './types';
import { User as FirebaseUser } from 'firebase/auth';

export interface StoreContextType {
  products: Product[];
  isDarkMode: boolean;
  user: FirebaseUser | null;
  wishlistIds: string[];
  addingToCartId: string | null;
  prefersReducedMotion: boolean;
  handleFeaturedAddToCart: (product: Product, e?: React.MouseEvent) => void;
  handleAddToCart: (product: Product, quantity?: number, variant?: any) => void;
  handleWishlistToggle: (product: Product, e?: React.MouseEvent) => void;
  setQuickViewProduct: (product: Product | null) => void;
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
`;
fs.writeFileSync('src/StoreContext.tsx', contextCode);

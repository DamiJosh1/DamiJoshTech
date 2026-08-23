import React, { createContext, useContext } from 'react';
import { Product, CartItem, Promotion, AppNotification, StoreCountry, StoreCurrency, ShippingMethod, TaxRule } from './types';
import { User as FirebaseUser } from 'firebase/auth';

export interface StoreContextType {
  products: Product[];
  promotions: Promotion[];
  activeCoupon: Promotion | null;
  setActiveCoupon: (coupon: Promotion | null) => void;
  cartDiscount: number;
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
  clearCart: () => void;
  notifications: AppNotification[];
  unreadNotifications: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  countries: StoreCountry[];
  currencies: StoreCurrency[];
  shippingMethods: ShippingMethod[];
  taxRules: TaxRule[];
  activeCountry: StoreCountry | null;
  setActiveCountry: (c: StoreCountry | null) => void;
  activeCurrency: StoreCurrency | null;
  setActiveCurrency: (c: StoreCurrency | null) => void;
  formatPrice: (amount: number) => string;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Black", "White", "128GB"
  type: string; // e.g., "Color", "Storage"
  price?: number; // Override price if needed
  image?: string; // Variant specific image
  inStock: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  video?: string;
  description?: string;
  shortDescription?: string;
  features?: string[];
  category: string;
  badge?: string;
  cjSku?: string;
  brand?: string;
  inStock?: boolean;
  stockCount?: number;
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  includedItems?: string[];
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  productSnapshot: Product;
  variantSnapshot?: ProductVariant;
  createdAt: string;
}

export interface Promotion {
  id?: string;
  name: string;
  description?: string;
  type: 'coupon' | 'flash_sale' | 'automatic' | 'free_shipping';
  code?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: any; // Firestore Timestamp
  endDate: any; // Firestore Timestamp
  status: 'active' | 'scheduled' | 'paused' | 'expired' | 'draft';
  usageLimit?: number;
  currentUsage: number;
  minOrderValue?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  customerEligibility?: 'all' | 'specific' | 'first_order';
  isStackable: boolean;
  createdAt?: any;
}

export type NotificationType = 
  | 'ORDER_CONFIRMED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'ORDER_PROCESSING'
  | 'ORDER_SHIPPED'
  | 'ORDER_OUT_FOR_DELIVERY'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'REFUND_REQUESTED'
  | 'REFUND_APPROVED'
  | 'REFUND_COMPLETED'
  | 'RETURN_REQUESTED'
  | 'RETURN_APPROVED'
  | 'RETURN_REJECTED'
  | 'PASSWORD_CHANGED'
  | 'EMAIL_CHANGED'
  | 'SECURITY_ALERT'
  | 'PROMOTION'
  | 'BACK_IN_STOCK'
  | 'PRICE_ALERT';

export interface AppNotification {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: any;
}

export interface NotificationPreferences {
  userId: string;
  orderUpdates: boolean;
  promotions: boolean;
  securityAlerts: boolean;
  newProducts: boolean;
}

export interface EmailLog {
  id?: string;
  recipient: string;
  type: string;
  subject: string;
  status: 'queued' | 'sending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  sentAt: any;
  error?: string;
}

export interface BroadcastCampaign {
  id?: string;
  name: string;
  subject: string;
  message: string;
  audience: 'all' | 'customers' | 'segment';
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED' | 'FAILED';
  sendDate?: any;
  createdAt: any;
}

export interface StoreCountry {
  id?: string;
  code: string;
  name: string;
  active: boolean;
  currencyCode: string;
}

export interface StoreCurrency {
  id?: string;
  code: string;
  symbol: string;
  active: boolean;
  exchangeRate: number; // relative to base currency (USD)
  decimalPrecision: number;
}

export interface ShippingMethod {
  id?: string;
  name: string;
  type: 'standard' | 'express' | 'economy';
  price: number;
  minDays: number;
  maxDays: number;
  countryCodes: string[]; // which countries this applies to
  active: boolean;
}

export interface TaxRule {
  id?: string;
  countryCode: string;
  ratePercentage: number;
  active: boolean;
}

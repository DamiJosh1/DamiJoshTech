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

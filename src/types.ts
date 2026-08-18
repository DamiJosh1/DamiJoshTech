export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  video?: string;
  description?: string;
  features?: string[];
  category: string;
  badge?: string;
  cjSku?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  cjSku?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

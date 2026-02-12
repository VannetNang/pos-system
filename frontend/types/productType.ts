export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  maxStock?: number;
  created_at: string;
  updated_at: string;
}

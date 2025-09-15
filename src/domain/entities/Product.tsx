export interface Product {
  activated: boolean;
  product_code: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  discountPercentage?: number;
  discountPrice?: number;
  oferta?: boolean;           // ← NUEVO
}

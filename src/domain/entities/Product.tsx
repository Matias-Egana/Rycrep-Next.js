// src/domain/entities/Product.ts
export interface Product {
  activated: boolean;
  product_code: string;  // "P001" (nuevo PK)
  name: string;          // nombre del producto
  category: string;      // tipo de producto (alternador, luces, motor)
  brand:string           // Marca
  price: number;         // precio en pesos chilenos sin puntos ni comas
  stock: number;         // stock actual del producto en la tienda
  description: string;   // descripción del producto
  images: string[];
  discountPercentage?: number; // ✅ opcional: porcentaje de descuento
  discountPrice?: number;      // ✅ opcional: precio final con descuento
}
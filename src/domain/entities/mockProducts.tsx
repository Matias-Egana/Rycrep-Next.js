// src/domain/entities/mockProducts.ts
import type { Product } from "./Product";

export const mockProducts: Product[] = [
  {
    activated: true,
    product_code: "ALT001",
    name: "Alternador 12V",
    category: "alternador",
    "brand": "Bosch",
    price: 85000,
    stock: 10,
    description: "Alternador de alta calidad para vehículos livianos.",
    images: ["https://d3m0xk3430j32g.cloudfront.net/images/upload/8250/card/659f48d00ac140.63966912.jpg"],
    discountPercentage: 10,
  },
  {
    activated: true,
    product_code: "LUC001",
    name: "Kit Luces LED",
    category: "luces",
    "brand": "TDI",
    price: 35000,
    stock: 25,
    description: "Luces LED blancas de bajo consumo.",
    images: ["https://images.implementos.cl/img/1000/CMPELE0038-1.jpg"],
    discountPrice: 30000,
  },
  {
    activated: true,
    product_code: "MOT001",
    name: "Filtro de Aire Motor",
    category: "motor",
    "brand": "Niehoff",
    price: 15000,
    stock: 50,
    description: "Filtro de aire estándar para motores de gasolina.",
    images: ["https://cgmotors.cl/wp-content/uploads/2023/06/Filtro-de-aire-Conico-35mm-5.jpg"],
  }
];

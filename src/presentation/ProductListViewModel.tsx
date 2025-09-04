// src/presentation/viewmodels/ProductListViewModel.tsx
import type { Product } from "../domain/entities/Product";
import { mockProducts } from "../domain/entities/mockProducts";

// Helper: calcula precio final si hay discountPercentage
function computeDiscountPrice(p: Product): number {
  if (typeof p.discountPrice === "number") return p.discountPrice;
  if (typeof p.discountPercentage === "number") {
    return Math.round(p.price * (100 - p.discountPercentage) / 100);
  }
  return p.price;
}

export const products = async (category: string): Promise<Product[]> => {
  console.log(`[MOCK] Fetching productos de la categoría: ${category}`);
  // simula latencia
  await new Promise((r) => setTimeout(r, 350));

  // Enriquecer mock con discountPrice si aplica
  const enriched = mockProducts.map((p) => {
    if (p.discountPrice == null && typeof p.discountPercentage === "number") {
      return { ...p, discountPrice: computeDiscountPrice(p) };
    }
    return p;
  });

  if (!category || category === "all") return enriched;

  return enriched.filter(
    (p) => (p.category || "").toLowerCase() === category.toLowerCase()
  );
};

export default products;
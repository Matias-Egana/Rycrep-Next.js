import { ProductRepository } from "../data/repositories/ProductRepository"; // valor (ok)
import { makeGetProductsUseCase } from "../domain/usecases/GetProductsUseCase";
import { makeGetProductByCodeUseCase } from "../domain/usecases/GetProductByCodeUseCase";
import type { Product } from "../domain/entities/Product";
import type { RycrepProduct } from "../domain/entities/RycrepProduct";

const repo = new ProductRepository();
const listUC = makeGetProductsUseCase(repo);
const detailUC = makeGetProductByCodeUseCase(repo);

function toUi(p: RycrepProduct): Product {
  return {
    activated: true,
    product_code: p.model_code || String(p.id),
    name: p.name,
    category: p.category,
    brand: p.brand || "",            // ← antes "Rycrep"
    price: p.price ?? 0,
    stock: 99,
    description: p.description ?? "",
    images: p.image_url ? [p.image_url] : [],
    discountPrice: p.oferta && p.price != null ? p.price : undefined,
    discountPercentage: undefined,
    oferta: p.oferta,                // ← NUEVO
  };
}


export default async function fetchProductsByCategory(
  category: string | "all"
): Promise<Product[]> {
  const data = await listUC({ category: category as any });
  return data.map(toUi);
}

export async function fetchProductByCode(code: string): Promise<Product | null> {
  const p = await detailUC(code);
  return p ? toUi(p) : null;
}

import { ProductRepository } from "../data/repositories/ProductRepository";
import { makeGetProductsUseCase } from "../domain/usecases/GetProductsUseCase";
import { makeGetProductByCodeUseCase } from "../domain/usecases/GetProductByCodeUseCase";
import type { Product } from "../domain/entities/Product";
import type { RycrepProduct } from "../domain/entities/RycrepProduct";
import { resolveProductImageUrl } from "../lib/resolveProductImageUrl";

const repo = new ProductRepository();
const listUC = makeGetProductsUseCase(repo);
const detailUC = makeGetProductByCodeUseCase(repo);

function toUi(p: RycrepProduct): Product {
  const img = resolveProductImageUrl(p.image_url);

  return {
    activated: true,
    product_code: p.model_code || String(p.id),
    name: p.name,
    category: p.category,
    brand: p.brand || "",
    price: p.price ?? null,
    stock: 99,
    description: p.description ?? "",
    images: img ? [img] : [],
    discountPrice: p.oferta && p.price != null ? p.price : undefined,
    discountPercentage: undefined,
    oferta: p.oferta,

    // extras
    oem_code: p.oem_code,
    series: p.series,
    voltage: p.voltage,
    amp_rating: p.amp_rating,
    watt_rating: p.watt_rating,
    led_count: p.led_count,
    kelvin: p.kelvin,
    beam_pattern: p.beam_pattern,
    lens_color: p.lens_color,

    attributes: p.attributes,
  };
}

/** Nueva API: consulta al backend con category + brandKeys (multi) */
export async function fetchProducts(params: {
  category: string | "all";
  brandKeys?: string[];
}): Promise<Product[]> {
  const data = await listUC({
    category: params.category as any,
    brand_keys: params.brandKeys ?? [],
  });
  return data.map(toUi);
}

export async function fetchProductByCode(code: string): Promise<Product | null> {
  const p = await detailUC(code);
  return p ? toUi(p) : null;
}

export default fetchProducts; // compatibilidad

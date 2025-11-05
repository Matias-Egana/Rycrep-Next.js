import { apiGet, apiGetAll } from "../../api/http";
import type { ProductDTO } from "../dto/ProductDTO";
import { dtoToDomain } from "../mappers/productMapper";
import type {
  IProductRepository,
  ProductListParams,
} from "../../domain/repositories/IProductRepository";
import type { RycrepProduct } from "../../domain/entities/RycrepProduct";

export class ProductRepository implements IProductRepository {
  async list(params?: ProductListParams): Promise<RycrepProduct[]> {
    const query: Record<string, any> = {};
    if (params?.category && params.category !== "all") query.category = params.category;
    if (params?.search) query.search = params.search;
    if (params?.oferta !== undefined) query.oferta = params.oferta;

    // NUEVO: marcas múltiples (como keys) → brand_in (comma-separated) para el backend
    if (params?.brand_keys && params.brand_keys.length > 0) {
      query.brand_in = params.brand_keys.join(",");
    }

    const dtos = await apiGetAll<ProductDTO>("products/", query);
    return dtos.map(dtoToDomain);
  }

  async getByModelCode(code: string): Promise<RycrepProduct | null> {
    // ✅ Usar SIEMPRE el endpoint de detalle exacto.
    // Evita pedir la lista con model_code (que no filtra en el backend) y tomar el primer elemento.
    try {
      const safe = encodeURIComponent(code.trim());
      const dto = await apiGet<ProductDTO>(`products/${safe}/`);
      return dtoToDomain(dto);
    } catch (err: any) {
      // Si la API responde 404, devolvemos null; el resto de errores se propagan.
      const msg = String(err?.message ?? err);
      if (err?.status === 404 || /404/.test(msg) || /not_found/i.test(msg)) {
        return null;
      }
      throw err;
    }
  }

  // (update se mantiene igual, si lo usas)
}

import { apiGet, apiGetAll } from "../../api/http";
import type { ProductDTO } from "../dto/ProductDTO";
import { dtoToDomain } from "../mappers/productMapper";
import type { IProductRepository, ProductListParams } from "../../domain/repositories/IProductRepository";
import type { RycrepProduct } from "../../domain/entities/RycrepProduct";

// ...
export class ProductRepository implements IProductRepository {
  async list(params?: ProductListParams): Promise<RycrepProduct[]> {
    const query: Record<string, any> = {};
    if (params?.category && params.category !== "all") query.category = params.category;
    if (params?.search) query.search = params.search;
    if (params?.oferta !== undefined) query.oferta = params.oferta;

    // ANTES: "/products/"
    const dtos = await apiGetAll<ProductDTO>("products/", query);
    return dtos.map(dtoToDomain);
  }

  async getByModelCode(code: string): Promise<RycrepProduct | null> {
    // ANTES: "/products/"
    const dtos = await apiGetAll<ProductDTO>("products/", { model_code: code });
    if (dtos.length > 0) return dtoToDomain(dtos[0]);

    if (/^\d+$/.test(code)) {
      // ANTES: `/products/${code}/`
      const dto = await apiGet<ProductDTO>(`products/${code}/`);
      return dtoToDomain(dto);
    }
    return null;
  }
}

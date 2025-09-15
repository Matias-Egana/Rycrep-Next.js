import type { IProductRepository, ProductListParams } from "../repositories/IProductRepository";
import type { RycrepProduct } from "../entities/RycrepProduct";

/** Firma del caso de uso */
export type GetProductsUseCase = (params?: ProductListParams) => Promise<RycrepProduct[]>;

/** Factory: inyecta el repo y devuelve la función execute */
export function makeGetProductsUseCase(repo: IProductRepository): GetProductsUseCase {
  return (params?: ProductListParams) => repo.list(params);
}

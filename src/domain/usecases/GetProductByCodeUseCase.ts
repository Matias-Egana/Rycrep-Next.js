import type { IProductRepository } from "../repositories/IProductRepository";
import type { RycrepProduct } from "../entities/RycrepProduct";

/** Firma del caso de uso */
export type GetProductByCodeUseCase = (code: string) => Promise<RycrepProduct | null>;

/** Factory: inyecta el repo y devuelve la función execute */
export function makeGetProductByCodeUseCase(repo: IProductRepository): GetProductByCodeUseCase {
  return (code: string) => repo.getByModelCode(code);
}

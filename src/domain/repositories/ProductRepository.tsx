import type { RycrepProduct } from "../entities/RycrepProduct";

export type ProductListParams = {
  category?:
    | "alternadores"
    | "motores"
    | "baterias"
    | "fusibles"
    | "articulos_seguridad"
    | "faroles_luminarias"
    | "all";
  search?: string;
  oferta?: boolean;
};

export type UpdateProductPatch = {
  id: number | string;
  oferta: boolean;
  // Solo se envía price cuando NO está en oferta (regla del negocio)
  price?: number;
};

export interface ProductRepository {
  list(params?: ProductListParams): Promise<RycrepProduct[]>;
  getByModelCode(code: string): Promise<RycrepProduct | null>;
  update(patch: UpdateProductPatch): Promise<RycrepProduct>;
}

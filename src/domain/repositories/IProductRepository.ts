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

  /** NUEVO: lista de keys de marca (niehoff, segbosch, rc, etc.) */
  brand_keys?: string[];
};

export interface IProductRepository {
  list(params?: ProductListParams): Promise<RycrepProduct[]>;
  getByModelCode(code: string): Promise<RycrepProduct | null>;
}

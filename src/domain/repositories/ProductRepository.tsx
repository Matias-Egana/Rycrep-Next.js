import type { RycrepProduct } from "../entities/RycrepProduct";

export type ProductListParams = {
  category?:
    | "alternadores"
    | "motores"
    | "baterias"
    | "fusibles"
    | "articulos_seguridad"
    | "faroles_luminarias"
    | "accesorios"
    | "all";
  search?: string;
  oferta?: boolean;

  // ← NUEVOS filtros soportados por el backend y usados en ProductRepository.list()
  brand?: string;
  series?: string;
  voltage?: string;
};

export type UpdateProductPatch = {
  id: number | string;
  // envía solo lo que quieras actualizar (oferta y/o price)
  oferta?: boolean;
  price?: number;
};

export interface ProductRepository {
  list(params?: ProductListParams): Promise<RycrepProduct[]>;
  getByModelCode(code: string): Promise<RycrepProduct | null>;
  update(patch: UpdateProductPatch): Promise<RycrepProduct>;
}

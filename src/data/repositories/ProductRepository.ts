// src/data/repositories/ProductRepository.ts
import { apiGet, apiGetAll } from "../../api/http";
import type { ProductDTO } from "../dto/ProductDTO";
import { dtoToDomain } from "../mappers/productMapper";
import type {
  ProductRepository as IProductRepository,
  ProductListParams,
  UpdateProductPatch,
} from "../../domain/repositories/ProductRepository";
import type { RycrepProduct } from "../../domain/entities/RycrepProduct";
import { cmsAuth } from "../../lib/cmsAuth";

// Usa el mismo patrón que ya funciona en CmsLoginRepository
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ?? // legacy opcional
  "/api";

function buildUrl(path: string): string {
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${p}`;
}

/** Refresca el access token con el refresh guardado. Retorna el nuevo access o lanza error. */
async function tryRefreshAccess(): Promise<string> {
  const refresh = cmsAuth.getRefresh();
  if (!refresh) throw new Error("Sesión expirada. Vuelve a iniciar sesión en el CMS.");

  const url = buildUrl("cms/auth/refresh/");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    // refresh inválido → limpiar sesión
    cmsAuth.clear();
    const detail = await res.text().catch(() => "");
    throw new Error(`Tu sesión expiró. Inicia sesión nuevamente. (${res.status}) ${detail}`);
  }

  const data = (await res.json()) as { access: string };
  // Actualiza solo el access (mantén refresh y user)
  try {
    localStorage.setItem("cms_access", data.access);
  } catch {}
  return data.access;
}

/** PATCH con Authorization Bearer y reintento único si 401 (refresh) */
async function apiPatchAuth<T>(path: string, body: any): Promise<T> {
  const doFetch = async (access?: string) => {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return { res, url };
  };

  // 1) primer intento con el access actual (si existe)
  let access = cmsAuth.getAccess();
  let { res, url } = await doFetch(access);

  // 2) si 401 → intentamos refresh y reintento 1 vez
  if (res.status === 401) {
    try {
      access = await tryRefreshAccess();
      ({ res, url } = await doFetch(access));
    } catch (err) {
      // no se pudo refrescar
      throw err;
    }
  }

  if (!res.ok) {
    const errTxt = await res.text().catch(() => "");
    throw new Error(`PATCH ${url} ${res.status} - ${errTxt || res.statusText}`);
  }

  return (await res.json()) as T;
}

export class ProductRepository implements IProductRepository {
  async list(params?: ProductListParams): Promise<RycrepProduct[]> {
    const query: Record<string, any> = {};
    if (params?.category && params.category !== "all") query.category = params.category;
    if (params?.search) query.search = params.search;
    if (params?.oferta !== undefined) query.oferta = params.oferta;

    const dtos = await apiGetAll<ProductDTO>("products/", query);
    return dtos.map(dtoToDomain);
  }

  async getByModelCode(code: string): Promise<RycrepProduct | null> {
    const dtos = await apiGetAll<ProductDTO>("products/", { model_code: code });
    if (dtos.length > 0) return dtoToDomain(dtos[0]);

    if (/^\d+$/.test(code)) {
      const dto = await apiGet<ProductDTO>(`products/${code}/`);
      return dtoToDomain(dto);
    }
    return null;
  }

  // Actualiza oferta y/o precio (envía lo que venga en el patch)
  async update(patch: UpdateProductPatch): Promise<RycrepProduct> {
    const { id, ...body } = patch;
    // DRF detail endpoint: /api/products/{id}/
    const dto = await apiPatchAuth<ProductDTO>(`products/${id}/`, body);
    return dtoToDomain(dto);
  }
}

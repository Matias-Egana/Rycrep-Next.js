import { apiGet, apiGetAll } from "../../api/http";
import type { ProductDTO } from "../dto/ProductDTO";
import { dtoToDomain } from "../mappers/productMapper";
import type {
  IProductRepository,
  ProductListParams,
} from "../../domain/repositories/IProductRepository";
import type { RycrepProduct } from "../../domain/entities/RycrepProduct";
import { cmsAuth } from "../../lib/cmsAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "/api";

function buildUrl(path: string): string {
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${p}`;
}

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
    cmsAuth.clear();
    const detail = await res.text().catch(() => "");
    throw new Error(`Tu sesión expiró. Inicia sesión nuevamente. (${res.status}) ${detail}`);
  }

  const data = (await res.json()) as { access: string };
  try { localStorage.setItem("cms_access", data.access); } catch {}
  return data.access;
}

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

  let access = cmsAuth.getAccess();
  let { res, url } = await doFetch(access);

  if (res.status === 401) {
    access = await tryRefreshAccess();
    ({ res, url } = await doFetch(access));
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

    // NUEVO: marcas múltiples (como keys) → brand_in (comma-separated) para el backend
    if (params?.brand_keys && params.brand_keys.length > 0) {
      query.brand_in = params.brand_keys.join(",");
    }

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

  // (update se mantiene igual, si lo usas)
}

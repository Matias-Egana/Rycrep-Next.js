import { API_BASE_URL } from "../config/env";

export type Paginated<T> =
  | { count: number; next: string | null; previous: string | null; results: T[] }
  | T[];

// Asegura que el base termine en "/" y que el path NO empiece con "/"
function buildUrl(path: string, params?: Record<string, any>): string {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : API_BASE_URL + "/";
  const cleanPath = path.replace(/^\/+/, ""); // quita / iniciales
  const url = new URL(cleanPath, base);       // ahora sí: .../api/ + products/ => /api/products/

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    }
  }
  return url.toString();
}

function isPaginated<T>(data: any): data is { results: T[]; next: string | null } {
  return data && typeof data === "object" && "results" in data;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): Promise<T> {
  const url = buildUrl(path, params);
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${txt}`);
  }
  return res.json();
}

export async function apiGetAll<T>(path: string, params?: Record<string, any>): Promise<T[]> {
  const firstUrl = buildUrl(path, params);
  const firstRes = await fetch(firstUrl, { headers: { Accept: "application/json" } });
  if (!firstRes.ok) {
    const txt = await firstRes.text().catch(() => "");
    throw new Error(`GET ${firstUrl} -> ${firstRes.status} ${txt}`);
  }
  const first = (await firstRes.json()) as Paginated<T>;

  if (isPaginated<T>(first)) {
    const acc = [...first.results];
    let next = first.next;
    while (next) {
      const res = await fetch(next, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`GET ${next} -> ${res.status}`);
      const data = await res.json();
      acc.push(...data.results);
      next = data.next;
    }
    return acc;
  }
  return first as T[];
}

import { MEDIA_BASE_URL } from "../config/env";

/**
 * Resuelve un image_url a una URL usable por <img src>.
 *
 * Formatos soportados:
 *  - URL absoluta: https://...
 *  - Path absoluto: /data/products/archivo.webp
 *  - Solo nombre de archivo: archivo.webp
 */
export function resolveProductImageUrl(input?: string | null): string | null {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  // Ya es URL absoluta o esquema especial
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }

  const base = String(MEDIA_BASE_URL ?? "").replace(/\/+$/, "");

  // Path absoluto (por ejemplo /data/products/ryc45001.webp)
  if (raw.startsWith("/")) {
    return base ? `${base}${raw}` : raw;
  }

  // Solo nombre de archivo → lo asumimos dentro de /data/products
  const path = `/data/products/${raw}`;
  return base ? `${base}${path}` : path;
}

/**
 * Normaliza lo que se guarda en DB para la opción A:
 * - Ideal: guardar SIEMPRE path relativo, por ejemplo: /data/products/ryc45001.webp
 * - Si llega una URL absoluta que apunta a /data/products, la convertimos a path.
 * - Si llega una URL absoluta externa (no /data/products), la dejamos tal cual.
 */
export function normalizeProductImageUrlForDb(input?: string | null): string {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  // URL absoluta
  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      if (u.pathname.startsWith("/data/products/")) return u.pathname;
      return raw;
    } catch {
      return raw;
    }
  }

  // esquemas especiales (no recomendado para este caso, pero lo respetamos)
  if (raw.startsWith("data:") || raw.startsWith("blob:")) return raw;

  // path absoluto
  if (raw.startsWith("/")) return raw;

  // solo filename
  return `/data/products/${raw}`;
}

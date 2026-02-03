import { MEDIA_BASE_URL } from "../config/env";

/**
 * Convierte una URL guardada en BD (que puede ser absoluta o relativa)
 * en una URL lista para usar en <img src="...">.
 *
 * Soporta:
 * - https://... (se deja tal cual)
 * - /data/products/1.jpg (se prefija con MEDIA_BASE_URL)
 * - data/products/1.jpg (se normaliza a /data/products/1.jpg)
 */
export function resolveMediaUrl(input?: string | null): string | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;

  // Absoluta
  if (/^https?:\/\//i.test(raw)) return raw;

  // Relativa: normalizamos a /...
  const pathname = raw.startsWith("/") ? raw : `/${raw}`;

  const base = (MEDIA_BASE_URL || "").replace(/\/+$/, "");
  if (!base) return pathname; // fallback, al menos no rompe

  return `${base}${pathname}`;
}

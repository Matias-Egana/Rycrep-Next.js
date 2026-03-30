export function resolveMediaUrl(input?: string | null) {
  const raw = (input ?? "").trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;

  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function normalizeProductImageUrlForDb(input?: string | null) {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (url.pathname.startsWith("/data/products/")) return url.pathname;
      return raw;
    } catch {
      return raw;
    }
  }

  if (raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
  if (raw.startsWith("/")) return raw;
  return `/data/products/${raw}`;
}

type BackendProduct = {
  id: number | string;
  model_code?: string | null;
  name: string;
  category: string;
  brand?: string | null;
  price?: number | null;
  description?: string | null;
  image_url?: string | null;
  oferta?: boolean;
};

export type CatalogProduct = {
  id: number;
  code: string;
  name: string;
  category: string;
  brand: string;
  price: number | null;
  description: string;
  imageUrl: string | null;
  oferta: boolean;
};

export type CatalogResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CatalogProduct[];
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function toLookupKey(value: string) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "");
}

const brandAliasToKey: Record<string, string> = {
  niehoff: "niehoff",
  denso: "denso",
  delso: "denso",
  "delco remy": "delcoremy",
  delcoremy: "delcoremy",
  nikko: "nikko",
  seg: "segbosch",
  "seg (bosch)": "segbosch",
  "seg-bosch": "segbosch",
  bosch: "segbosch",
  "american superior": "americansuperior",
  american: "americansuperior",
  "r&c": "rc",
  "r c": "rc",
  ryc: "rc",
  peterson: "peterson",
  neolite: "neolite",
  syfco: "syfco",
  bussmann: "bussmann",
  "leece-neville": "leeceneville",
  leeceneville: "leeceneville",
  prelub: "prelub",
  tdi: "tdi",
};

function getBrandFilterKey(value: string) {
  const normalized = normalizeText(value);
  return brandAliasToKey[normalized] ?? toLookupKey(value);
}

function getApiBaseUrl() {
  const base = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("Falta configurar API_BASE_URL o NEXT_PUBLIC_API_BASE_URL.");
  return base.replace(/\/+$/, "");
}

function getMediaBaseUrl() {
  const media =
    process.env.MEDIA_BASE_URL?.trim() ??
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim() ??
    process.env.VITE_MEDIA_BASE_URL?.trim();
  if (media) return media.replace(/\/+$/, "");
  return new URL(getApiBaseUrl()).origin;
}

function resolveImageUrl(imageUrl?: string | null) {
  const raw = String(imageUrl ?? "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
  const mediaBaseUrl = getMediaBaseUrl();
  if (raw.startsWith("/")) return `${mediaBaseUrl}${raw}`;
  return `${mediaBaseUrl}/data/products/${raw}`;
}

function toCatalogProduct(product: BackendProduct): CatalogProduct {
  const numericId = Number(product.id);
  return {
    id: Number.isNaN(numericId) ? 0 : numericId,
    code: product.model_code || String(product.id),
    name: product.name,
    category: product.category,
    brand: product.brand || "Sin marca",
    price: product.price ?? null,
    description: product.description ?? "",
    imageUrl: resolveImageUrl(product.image_url),
    oferta: Boolean(product.oferta),
  };
}

async function fetchProductsChunk(url: URL) {
  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`No fue posible obtener productos: ${response.status}`);
  }

  return (await response.json()) as {
    count: number;
    next: string | null;
    previous: string | null;
    results: BackendProduct[];
  };
}

export async function fetchCatalogPage(params: {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  brand?: string;
}) {
  const baseUrl = getApiBaseUrl();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const offset = Math.max(0, (page - 1) * pageSize);
  const brandSelected = params.brand && params.brand !== "all";
  const makeUrl = (limit: number, chunkOffset: number) => {
    const url = new URL(`${baseUrl}/products/`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(chunkOffset));
    if (params.category && params.category !== "all") url.searchParams.set("category", params.category);
    if (params.search?.trim()) url.searchParams.set("search", params.search.trim());
    return url;
  };

  const json = await fetchProductsChunk(makeUrl(pageSize, offset));

  let results = json.results.map(toCatalogProduct);

  if (brandSelected) {
    const normalizedBrand = getBrandFilterKey(params.brand ?? "");
    const chunkSize = 100;
    const firstChunk = await fetchProductsChunk(makeUrl(chunkSize, 0));
    let aggregated = firstChunk.results.map(toCatalogProduct);
    const totalChunks = Math.ceil(firstChunk.count / chunkSize);

    for (let chunkIndex = 1; chunkIndex < totalChunks; chunkIndex += 1) {
      const chunk = await fetchProductsChunk(makeUrl(chunkSize, chunkIndex * chunkSize));
      aggregated = aggregated.concat(chunk.results.map(toCatalogProduct));
    }

    results = aggregated.filter((product) => getBrandFilterKey(product.brand) === normalizedBrand);
    return {
      count: results.length,
      next: null,
      previous: null,
      results: results.slice(offset, offset + pageSize),
    } satisfies CatalogResponse;
  }

  return {
    count: json.count,
    next: json.next,
    previous: json.previous,
    results,
  } satisfies CatalogResponse;
}

export async function fetchCatalogProduct(code: string) {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/products/${encodeURIComponent(code)}/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`No fue posible obtener el producto ${code}.`);

  const json = (await response.json()) as BackendProduct;
  return toCatalogProduct(json);
}

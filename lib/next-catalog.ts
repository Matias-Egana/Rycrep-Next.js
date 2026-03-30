import { findProductByCode, listProducts } from "@/lib/server/products";

type BackendProduct = {
  id: number | string | bigint;
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

function resolveImageUrl(imageUrl?: string | null) {
  const raw = String(imageUrl ?? "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
  if (raw.startsWith("/")) return raw;
  return `/data/products/${raw}`;
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

export async function fetchCatalogPage(params: {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  brand?: string;
}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const offset = Math.max(0, (page - 1) * pageSize);
  const brandSelected = params.brand && params.brand !== "all";

  const json = await listProducts({
    limit: pageSize,
    offset,
    category: params.category && params.category !== "all" ? params.category as never : undefined,
    search: params.search?.trim() || undefined,
  });

  let results = json.results.map((product: unknown) => toCatalogProduct(product as BackendProduct));

  if (brandSelected) {
    const normalizedBrand = getBrandFilterKey(params.brand ?? "");
    const chunkSize = 100;
    const firstChunk = await listProducts({
      limit: chunkSize,
      offset: 0,
      category: params.category && params.category !== "all" ? params.category as never : undefined,
      search: params.search?.trim() || undefined,
    });
    let aggregated = firstChunk.results.map((product: unknown) => toCatalogProduct(product as BackendProduct));
    const totalChunks = Math.ceil(firstChunk.count / chunkSize);

    for (let chunkIndex = 1; chunkIndex < totalChunks; chunkIndex += 1) {
      const chunk = await listProducts({
        limit: chunkSize,
        offset: chunkIndex * chunkSize,
        category: params.category && params.category !== "all" ? params.category as never : undefined,
        search: params.search?.trim() || undefined,
      });
      aggregated = aggregated.concat(
        chunk.results.map((product: unknown) => toCatalogProduct(product as BackendProduct)),
      );
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
    next: null,
    previous: null,
    results,
  } satisfies CatalogResponse;
}

export async function fetchCatalogProduct(code: string) {
  const product = await findProductByCode(code);
  if (!product) return null;
  return toCatalogProduct(product as unknown as BackendProduct);
}

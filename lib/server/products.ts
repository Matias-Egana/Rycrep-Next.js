import "server-only";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";

const productCategorySchema = z.enum([
  "alternadores",
  "motores",
  "baterias",
  "fusibles",
  "articulos_seguridad",
  "faroles_luminarias",
]);

const productListParamsSchema = z.object({
  q: z.string().optional(),
  search: z.string().optional(),
  category: productCategorySchema.optional(),
  oferta: z.enum(["true", "false"]).optional(),
  brand: z.string().optional(),
  price_min: z.coerce.number().nonnegative().optional(),
  price_max: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().int().positive().max(200).default(20).optional(),
  offset: z.coerce.number().int().nonnegative().default(0).optional(),
  orderBy: z.enum(["created_at", "updated_at", "name", "brand", "price"]).default("created_at").optional(),
  order: z.enum(["asc", "desc"]).default("desc").optional(),
});

export type BackendProductRecord = Awaited<ReturnType<typeof prisma.products_product.findFirst>>;

export type ProductListParams = z.infer<typeof productListParamsSchema>;

export function parseProductListParams(input: Record<string, string | undefined>) {
  return productListParamsSchema.parse(input);
}

function normalizeScalar<T>(value: T) {
  if (typeof value === "bigint") return Number(value);
  if (value instanceof Prisma.Decimal) return value.toNumber();
  return value;
}

function serializeProduct<T extends Record<string, unknown>>(product: T) {
  return Object.fromEntries(
    Object.entries(product).map(([key, value]) => [key, normalizeScalar(value)])
  ) as T;
}

export async function listProducts(params: ProductListParams) {
  const {
    q,
    search,
    category,
    oferta,
    brand,
    price_min: priceMin,
    price_max: priceMax,
    limit = 20,
    offset = 0,
    orderBy = "created_at",
    order = "desc",
  } = params;

  const query = search?.trim() || q?.trim();
  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { brand: { contains: query, mode: "insensitive" } },
      { model_code: { contains: query, mode: "insensitive" } },
      { oem_code: { contains: query, mode: "insensitive" } },
      { series: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category) where.category = category;
  if (oferta === "true") where.oferta = true;
  if (oferta === "false") where.oferta = false;
  if (brand?.trim()) where.brand = { contains: brand.trim(), mode: "insensitive" };

  if (priceMin != null || priceMax != null) {
    const priceFilter: Record<string, number> = {};
    if (priceMin != null) priceFilter.gte = priceMin;
    if (priceMax != null) priceFilter.lte = priceMax;
    where.price = priceFilter;
  }

  const results = await prisma.products_product.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: [{ [orderBy]: order }, { id: order }],
  });

  const count = await prisma.products_product.count({ where });

  return {
    results: results.map((product) => serializeProduct(product)),
    count,
    limit,
    offset,
  };
}

export async function findProductByCode(code: string) {
  const normalizedCode = code.trim();
  if (!normalizedCode) return null;

  const maybeId = Number(normalizedCode);
  let item = await prisma.products_product.findFirst({
    where: {
      OR: [
        { model_code: { equals: normalizedCode } },
        { oem_code: { equals: normalizedCode } },
      ],
    },
  });

  if (!item && Number.isFinite(maybeId) && maybeId > 0) {
    try {
      item = await prisma.products_product.findUnique({
        where: { id: BigInt(maybeId) },
      });
    } catch {
      item = null;
    }
  }

  if (!item) {
    item = await prisma.products_product.findFirst({
      where: { name: { equals: normalizedCode } },
    });
  }

  return item ? serializeProduct(item) : null;
}

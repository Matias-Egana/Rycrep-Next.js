import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

function toNumberSafe(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "object" && value && "toNumber" in value && typeof (value as { toNumber: () => number }).toNumber === "function") {
    return (value as { toNumber: () => number }).toNumber();
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function productToDto(product: {
  id: bigint | number;
  name: string;
  category: string;
  brand: string;
  image: string | null;
  image_url: string | null;
  price: Prisma.Decimal | number | null;
  oferta: boolean;
}) {
  return {
    id: toNumberSafe(product.id),
    name: product.name ?? "",
    category: product.category ?? "",
    brand: product.brand ?? "",
    image: product.image ?? null,
    image_url: product.image_url ?? null,
    price: toNumberSafe(product.price),
    oferta: Boolean(product.oferta),
  };
}

export async function listCmsProducts(params: {
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const term = (params.search ?? "").trim();
  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
  const order = params.order === "desc" ? "desc" : "asc";

  const allowedSort: Record<string, "name" | "brand" | "category" | "price" | "oferta"> = {
    name: "name",
    brand: "brand",
    category: "category",
    price: "price",
    oferta: "oferta",
  };
  const sortKey = allowedSort[params.sortBy ?? "name"] ?? "name";

  const where = term
    ? {
        OR: [
          { name: { contains: term } },
          { brand: { contains: term } },
          { category: { contains: term } },
          { model_code: { contains: term } },
        ],
      }
    : {};

  const [total, rows] = await Promise.all([
    prisma.products_product.count({ where }),
    prisma.products_product.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: true,
        brand: true,
        image: true,
        image_url: true,
        price: true,
        oferta: true,
      },
      orderBy: { [sortKey]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    total,
    items: rows.map(productToDto),
    page,
    limit,
  };
}

export async function createCmsProduct(input: {
  name: string;
  category: string;
  brand: string;
  image_url?: string;
  image?: string | null;
  price?: number | null;
  oferta?: boolean;
}) {
  const now = new Date();
  const created = await prisma.products_product.create({
    data: {
      name: input.name,
      category: input.category,
      brand: input.brand,
      image_url: input.image_url ?? input.image ?? "",
      description: "",
      model_code: "",
      voltage: "",
      oem_code: "",
      mounting_config: "",
      regulator_options: "",
      regulator_config: "",
      color: "",
      price: input.price == null ? null : new Prisma.Decimal(input.price.toFixed(2)),
      oferta: input.oferta ?? false,
      key_included: false,
      with_license_light: false,
      created_at: now,
      updated_at: now,
      applications: "",
      beam_pattern: "",
      series: "",
      lens_color: "",
      norma_bci: "",
      thread_type: "",
      tipo_tapa: "",
      lado_borne: "",
      measure: "",
      image: input.image ?? null,
      amp_rating: null,
      c20_ah: null,
      capacity_l: null,
      cca: null,
      depth_mm: null,
      diameter_mm: null,
      height_mm: null,
      kelvin: null,
      led_count: null,
      length_mm: null,
      life_hours: null,
      rc_min: null,
      voltage_max: null,
      voltage_min: null,
      watt_rating: null,
      width_mm: null,
      output_amp: null,
      weight_kg: null,
    },
    select: {
      id: true,
      name: true,
      category: true,
      brand: true,
      image: true,
      image_url: true,
      price: true,
      oferta: true,
    },
  });

  return productToDto(created);
}

export async function updateCmsProduct(
  id: number,
  patch: {
    name?: string;
    category?: string;
    brand?: string;
    image_url?: string | null;
    image?: string | null;
    price?: number | null;
    oferta?: boolean;
  }
) {
  const data: Prisma.products_productUpdateInput = {};

  if (typeof patch.name === "string") data.name = patch.name;
  if (typeof patch.category === "string") data.category = patch.category;
  if (typeof patch.brand === "string") data.brand = patch.brand;
  if (typeof patch.image_url === "string") data.image_url = patch.image_url;
  if (typeof patch.image === "string") data.image = patch.image;
  if (typeof patch.oferta === "boolean") data.oferta = patch.oferta;
  if (patch.price === null) data.price = null;
  if (typeof patch.price === "number" && Number.isFinite(patch.price)) {
    data.price = new Prisma.Decimal(patch.price.toFixed(2));
  }

  const updated = await prisma.products_product.update({
    where: { id: BigInt(id) },
    data,
    select: {
      id: true,
      name: true,
      category: true,
      brand: true,
      image: true,
      image_url: true,
      price: true,
      oferta: true,
    },
  });

  return productToDto(updated);
}

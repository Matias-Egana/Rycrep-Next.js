"use client";

import { getCsrfToken } from "@/lib/cms-csrf";
import { resolveMediaUrl } from "@/lib/cms-media";

export type CmsProduct = {
  id: number;
  name: string;
  category: string;
  brand: string;
  image?: string | null;
  image_url?: string | null;
  price: number | null;
  oferta: boolean;
  model_code?: string | null;
  oem_code?: string | null;
  description?: string | null;
  voltage?: string | null;
  amp_rating?: number | null;
  watt_rating?: number | null;
  led_count?: number | null;
  kelvin?: number | null;
  color?: string | null;
  beam_pattern?: string | null;
  series?: string | null;
  lens_color?: string | null;
  attributes?: unknown | null;
};

type CmsListResponse = {
  total: number;
  items: CmsProduct[];
  page: number;
  limit: number;
};

function mapProduct(raw: Record<string, unknown>): CmsProduct {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    category: String(raw.category ?? ""),
    brand: String(raw.brand ?? ""),
    image: (raw.image as string | null | undefined) ?? null,
    image_url: resolveMediaUrl((raw.image_url as string | null | undefined) ?? (raw.image as string | null | undefined) ?? null),
    price: raw.price == null ? null : Number(raw.price),
    oferta: Boolean(raw.oferta),
    model_code: (raw.model_code as string | null | undefined) ?? null,
    oem_code: (raw.oem_code as string | null | undefined) ?? null,
    description: (raw.description as string | null | undefined) ?? null,
    voltage: (raw.voltage as string | null | undefined) ?? null,
    amp_rating: raw.amp_rating == null ? null : Number(raw.amp_rating),
    watt_rating: raw.watt_rating == null ? null : Number(raw.watt_rating),
    led_count: raw.led_count == null ? null : Number(raw.led_count),
    kelvin: raw.kelvin == null ? null : Number(raw.kelvin),
    color: (raw.color as string | null | undefined) ?? null,
    beam_pattern: (raw.beam_pattern as string | null | undefined) ?? null,
    series: (raw.series as string | null | undefined) ?? null,
    lens_color: (raw.lens_color as string | null | undefined) ?? null,
    attributes: raw.attributes ?? null,
  };
}

export class CmsProductsRepository {
  async list(params: {
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
  } = {}): Promise<CmsListResponse> {
    const searchParams = new URLSearchParams();
    const term = (params.search ?? "").trim();
    if (term) {
      searchParams.set("search", term);
      searchParams.set("q", term);
    }
    if (params.page && params.page > 1) searchParams.set("page", String(params.page));
    if (params.limit && params.limit > 0) {
      searchParams.set("limit", String(params.limit));
      searchParams.set("pageSize", String(params.limit));
    }
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.order) searchParams.set("order", params.order);

    const response = await fetch(`/api/cms/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`, {
      credentials: "include",
    });

    if (response.status === 401 || response.status === 403) throw new Error("UNAUTHORIZED");
    if (!response.ok) throw new Error("Error al cargar productos.");

    const data = (await response.json()) as Record<string, unknown> | Record<string, unknown>[];
    const rawItems = Array.isArray(data)
      ? data
      : Array.isArray(data.items)
        ? (data.items as Record<string, unknown>[])
        : Array.isArray(data.results)
          ? (data.results as Record<string, unknown>[])
          : [];
    const items = rawItems.map(mapProduct);
    const total =
      typeof data === "object" && !Array.isArray(data) && typeof data.total === "number"
        ? data.total
        : typeof data === "object" && !Array.isArray(data) && typeof data.count === "number"
          ? data.count
          : items.length;

    return {
      total,
      items,
      page: typeof data === "object" && !Array.isArray(data) && typeof data.page === "number" ? data.page : (params.page ?? 1),
      limit:
        typeof data === "object" && !Array.isArray(data) && typeof data.limit === "number"
          ? data.limit
          : (params.limit ?? (items.length || 100)),
    };
  }

  async update(id: number, patch: Partial<CmsProduct>) {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`/api/cms/products/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(patch),
    });

    if (response.status === 401 || response.status === 403) throw new Error("UNAUTHORIZED");
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "No se pudo actualizar el producto.");
    }

    return mapProduct((await response.json()) as Record<string, unknown>);
  }

  async create(payload: Partial<CmsProduct>) {
    const csrfToken = await getCsrfToken();
    const response = await fetch("/api/cms/products", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401 || response.status === 403) throw new Error("UNAUTHORIZED");
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "No se pudo crear el producto.");
    }

    return mapProduct((await response.json()) as Record<string, unknown>);
  }

  async uploadProductImage(file: File) {
    const isJpeg =
      file.type === "image/jpeg" ||
      /\.(jpe?g)$/i.test(file.name);

    if (!isJpeg) {
      throw new Error("Selecciona una imagen JPG o JPEG.");
    }

    const csrfToken = await getCsrfToken();

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("No se pudo leer el archivo."));
      reader.readAsDataURL(file);
    });

    const response = await fetch("/api/cms/media/products", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        dataUrl,
        filename: file.name,
      }),
    });

    if (response.status === 401 || response.status === 403) throw new Error("UNAUTHORIZED");

    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      throw new Error(
        typeof data === "object" && data && "message" in data
          ? String(data.message)
          : "No se pudo subir la imagen.",
      );
    }

    return {
      path: String((data as { path?: string }).path || ""),
      filename: String((data as { filename?: string }).filename || ""),
    };
  }
}

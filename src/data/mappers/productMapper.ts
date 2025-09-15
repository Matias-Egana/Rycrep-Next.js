import type { ProductDTO } from "../dto/ProductDTO";
import { MEDIA_BASE_URL } from "../../config/env";
import type { RycrepProduct } from "../../domain/entities/RycrepProduct";

function toNumberOrNull(x: any): number | null {
  if (x === null || x === undefined || x === "") return null;
  const n = Number(x);
  return Number.isNaN(n) ? null : n;
}

export function dtoToDomain(dto: ProductDTO): RycrepProduct {
  const absolute = dto.image_url
    ? dto.image_url
    : dto.image
    ? `${MEDIA_BASE_URL}${dto.image.startsWith("/") ? "" : "/"}${dto.image}`
    : null;

  return {
    id: dto.id,
    category: dto.category,
    name: dto.name,
    brand: dto.brand ?? "",
    description: dto.description ?? "",
    model_code: dto.model_code ?? String(dto.id),
    voltage: dto.voltage ?? "",
    output_amp: toNumberOrNull(dto.output_amp),
    weight_kg: toNumberOrNull(dto.weight_kg),
    measure: dto.measure ?? "",
    mounting_config: dto.mounting_config ?? "",
    regulator_options: dto.regulator_options ?? "",
    regulator_config: dto.regulator_config ?? "",
    color: dto.color ?? "",
    color_codes: dto.color_codes ?? null,
    oferta: !!dto.oferta,
    price: toNumberOrNull(dto.price),
    image_url: absolute,
    created_at: dto.created_at,
    updated_at: dto.updated_at,
  };
}

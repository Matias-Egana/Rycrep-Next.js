import type { ProductDTO } from "../dto/ProductDTO";
import type { RycrepProduct } from "../../domain/entities/RycrepProduct";
import { resolveMediaUrl } from "../../lib/media";

export function dtoToDomain(dto: ProductDTO): RycrepProduct {
  return {
    id: dto.id,
    category: dto.category,
    name: dto.name,
    brand: dto.brand || "",
    description: dto.description || "",
    model_code: dto.model_code || "",
    oem_code: dto.oem_code || "",
    series: dto.series || "",

    // En BD puede venir relativa (ej: /data/products/1.jpg) o absoluta.
    // La UI siempre debe recibir una URL absoluta lista para <img src>
    image_url: resolveMediaUrl(dto.image_url || (dto.image ?? "") || null),

    oferta: Boolean(dto.oferta),
    price: dto.price,

    voltage: dto.voltage || "",
    voltage_min: dto.voltage_min,
    voltage_max: dto.voltage_max,
    amp_rating: dto.amp_rating,
    watt_rating: dto.watt_rating,
    led_count: dto.led_count,
    kelvin: dto.kelvin,
    life_hours: dto.life_hours,
    beam_pattern: dto.beam_pattern || "",
    lens_color: dto.lens_color || "",
    with_license_light: Boolean(dto.with_license_light),

    length_mm: dto.length_mm,
    width_mm: dto.width_mm,
    height_mm: dto.height_mm,
    diameter_mm: dto.diameter_mm,
    depth_mm: dto.depth_mm,

    applications: dto.applications || "",
    mounting_config: dto.mounting_config || "",
    regulator_options: dto.regulator_options || "",
    regulator_config: dto.regulator_config || "",

    norma_bci: dto.norma_bci || "",
    lado_borne: dto.lado_borne || "",
    tipo_tapa: dto.tipo_tapa || "",
    c20_ah: dto.c20_ah,
    rc_min: dto.rc_min,
    cca: dto.cca,

    thread_type: dto.thread_type || "",
    key_included: Boolean(dto.key_included),
    capacity_l: dto.capacity_l,

    color: dto.color || "",
    color_codes: dto.color_codes || null,

    attributes: dto.attributes || null,

    created_at: dto.created_at,
    updated_at: dto.updated_at,
  };
}

export interface Product {
  activated: boolean;
  product_code: string;        // alias de model_code / id
  name: string;
  category: string;
  brand: string;
  price: number | null;        // puede venir null si no es oferta
  stock: number;
  description: string;
  images: string[];

  // Oferta
  discountPercentage?: number;
  discountPrice?: number;
  oferta?: boolean;

  // NUEVOS (opcionales, para mostrar o futuras fichas técnicas)
  oem_code?: string;
  series?: string;

  voltage?: string;
  voltage_min?: number | null;
  voltage_max?: number | null;
  amp_rating?: number | null;
  watt_rating?: number | null;
  led_count?: number | null;
  kelvin?: number | null;
  life_hours?: number | null;
  beam_pattern?: string;
  lens_color?: string;
  with_license_light?: boolean;

  length_mm?: number | null;
  width_mm?: number | null;
  height_mm?: number | null;
  diameter_mm?: number | null;
  depth_mm?: number | null;

  applications?: string;
  mounting_config?: string;
  regulator_options?: string;
  regulator_config?: string;

  norma_bci?: string;
  lado_borne?: string;
  tipo_tapa?: string;
  c20_ah?: number | null;
  rc_min?: number | null;
  cca?: number | null;

  thread_type?: string;
  key_included?: boolean;
  capacity_l?: number | null;

  color?: string;
  color_codes?: Record<string, string> | null;

  // catch-all
  attributes?: Record<string, any> | null;
}

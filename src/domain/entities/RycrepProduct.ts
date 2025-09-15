import type { BackendCategory } from "../../data/dto/ProductDTO";

export interface RycrepProduct {
  id: number;
  category: BackendCategory;
  name: string;
  brand: string;
  description: string;
  model_code: string;
  voltage: string;
  output_amp: number | null;
  weight_kg: number | null;
  measure: string;
  mounting_config: string;
  regulator_options: string;
  regulator_config: string;
  color: string;
  color_codes: Record<string, string> | null;
  oferta: boolean;
  price: number | null;
  image_url: string | null;  // absoluta
  created_at: string;
  updated_at: string;
}

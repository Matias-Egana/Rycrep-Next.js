export type BackendCategory =
  | "alternadores"
  | "motores"
  | "baterias"
  | "fusibles"
  | "articulos_seguridad"
  | "faroles_luminarias";

export interface ProductDTO {
  id: number;
  category: BackendCategory;
  image: string | null;     // ruta relativa en /media/...
  image_url: string;        // absoluta (si la usas)
  name: string;
  brand: string; 
  description: string;
  model_code: string;
  voltage: string;
  output_amp: number | string | null;
  weight_kg: number | string | null;
  measure: string;
  mounting_config: string;
  regulator_options: string;
  regulator_config: string;
  color: string;
  color_codes: Record<string, string> | null;
  oferta: boolean;
  price: number | string | null;
  created_at: string;
  updated_at: string;
}

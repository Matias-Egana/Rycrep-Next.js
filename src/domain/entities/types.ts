import type { RycrepProduct } from "./RycrepProduct";

export interface CartItem {
  product: RycrepProduct;
  quantity: number;
}

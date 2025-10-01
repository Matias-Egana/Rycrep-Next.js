import type { ProductRepository, ProductListParams } from "../repositories/ProductRepository";
import type { RycrepProduct } from "../entities/RycrepProduct";

export class GetAllProductsUseCase {
  private repo: ProductRepository;

  constructor(repo: ProductRepository) {
    this.repo = repo;
  }

  execute(params?: ProductListParams): Promise<RycrepProduct[]> {
    return this.repo.list(params);
  }
}

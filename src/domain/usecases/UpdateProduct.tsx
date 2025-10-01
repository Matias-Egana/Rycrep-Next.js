import type { ProductRepository, UpdateProductPatch } from "../repositories/ProductRepository";
import type { RycrepProduct } from "../entities/RycrepProduct";

export class UpdateProductUseCase {
  private repo: ProductRepository;

  constructor(repo: ProductRepository) {
    this.repo = repo;
  }

  execute(patch: UpdateProductPatch): Promise<RycrepProduct> {
    return this.repo.update(patch);
  }
}

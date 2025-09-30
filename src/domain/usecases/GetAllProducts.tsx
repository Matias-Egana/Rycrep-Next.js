// src/domain/usecases/GetAllProducts.tsx
import type { IProductRepository, ProductListParams } from "../repositories/IProductRepository";
import type { RycrepProduct } from "../entities/RycrepProduct";

export class GetAllProducts {
  private repo: IProductRepository;         // ← declara la propiedad normal

  constructor(repo: IProductRepository) {   // ← sin "private" aquí
    this.repo = repo;                       // ← asignación explícita
  }

  async execute(params?: ProductListParams): Promise<RycrepProduct[]> {
    return this.repo.list(params);
  }
}

// src/domain/usecases/CmsLogin.tsx
import type { ICmsLoginRepository } from '../repositories/CmsLoginRepository';
import { cmsAuth, type CmsAuthPayload } from '../../lib/cmsAuth';

export class CmsLoginUseCase {
  private repo: ICmsLoginRepository;            // ← declara la prop normalmente

  constructor(repo: ICmsLoginRepository) {      // ← sin "private" aquí
    this.repo = repo;                           // ← asignación explícita
  }

  async execute(username: string, password: string): Promise<CmsAuthPayload> {
    const payload = await this.repo.login({ username, password });
    cmsAuth.save(payload);
    return payload;
  }
}

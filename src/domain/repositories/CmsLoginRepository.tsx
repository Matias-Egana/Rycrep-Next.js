// src/domain/repositories/CmsLoginRepository.tsx
import type { CmsAuthPayload } from '../../lib/cmsAuth';

export interface ICmsLoginRepository {
  login(params: { username: string; password: string }): Promise<CmsAuthPayload>;
}

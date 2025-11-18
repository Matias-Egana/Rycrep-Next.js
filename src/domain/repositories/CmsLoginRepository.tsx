// src/domain/repositories/CmsLoginRepository.tsx
import type { CmsAuthPayload, CmsUser } from '../../lib/cmsAuth';

export type CmsLoginRepoResult =
  | {
      kind: 'success';
      payload: CmsAuthPayload;
    }
  | {
      kind: 'mfa_required';
      challengeToken: string;
      user: CmsUser;
    };

export interface ICmsLoginRepository {
  login(params: { username: string; password: string }): Promise<CmsLoginRepoResult>;

  verifyMfa(params: {
    challengeToken: string;
    code: string;
  }): Promise<CmsAuthPayload>;
}

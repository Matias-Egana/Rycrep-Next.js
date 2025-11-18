// src/domain/usecases/CmsLogin.tsx
import type {
  ICmsLoginRepository,
  CmsLoginRepoResult,
} from '../repositories/CmsLoginRepository';
import { cmsAuth, type CmsAuthPayload, type CmsUser } from '../../lib/cmsAuth';

export type CmsLoginResult =
  | {
      status: 'success';
      payload: CmsAuthPayload;
    }
  | {
      status: 'mfa_required';
      challengeToken: string;
      user: CmsUser;
    };

export class CmsLoginUseCase {
  private repo: ICmsLoginRepository;

  constructor(repo: ICmsLoginRepository) {
    this.repo = repo;
  }

  async execute(username: string, password: string): Promise<CmsLoginResult> {
    const res: CmsLoginRepoResult = await this.repo.login({
      username,
      password,
    });

    if (res.kind === 'success') {
      cmsAuth.save(res.payload);
      return {
        status: 'success',
        payload: res.payload,
      };
    }

    // MFA requerido → todavía no guardamos nada en localStorage
    return {
      status: 'mfa_required',
      challengeToken: res.challengeToken,
      user: res.user,
    };
  }

  async verifyMfa(
    challengeToken: string,
    code: string,
  ): Promise<CmsAuthPayload> {
    const payload = await this.repo.verifyMfa({ challengeToken, code });
    cmsAuth.save(payload);
    return payload;
  }
}

// src/data/repositories/CmsLoginRepository.tsx
import type {
  ICmsLoginRepository,
  CmsLoginRepoResult,
} from '../../domain/repositories/CmsLoginRepository';
import type { CmsAuthPayload, CmsUser } from '../../lib/cmsAuth';
import { getCsrfToken } from '../../lib/csrf';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

function mapUser(raw: any): CmsUser {
  return {
    id: Number(raw.id),
    username: String(raw.username ?? ''),
    email: null,
    is_staff: !!raw.is_staff,
    is_superuser: !!raw.is_superuser,
    can_manage_mfa: !!raw.can_manage_mfa,
  };
}

function buildAuthPayload(data: any): CmsAuthPayload {
  if (!data?.token || !data?.user) {
    throw new Error('Respuesta inesperada del servidor.');
  }

  return {
    access: String(data.token),
    refresh: '',
    user: mapUser(data.user),
    password_rotation_warning: !!data.password_rotation_warning,
    password_age_days:
      typeof data.password_age_days === 'number'
        ? data.password_age_days
        : undefined,
  };
}

export class CmsLoginRepository implements ICmsLoginRepository {
  async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<CmsLoginRepoResult> {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${API_BASE}/cms/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({} as any));

    if (!res.ok) {
      const msg =
        (data && (data.detail || data.message)) ||
        'Error al iniciar sesión.';
      throw new Error(msg);
    }

    // Caso 1: el backend dice que se requiere MFA
    if (data.mfa_required) {
      if (!data.challenge_token || !data.user) {
        throw new Error('Respuesta MFA incompleta del servidor.');
      }

      return {
        kind: 'mfa_required',
        challengeToken: String(data.challenge_token),
        user: mapUser(data.user),
      };
    }

    // Caso 2: login normal sin MFA
    return {
      kind: 'success',
      payload: buildAuthPayload(data),
    };
  }

  async verifyMfa(params: {
    challengeToken: string;
    code: string;
  }): Promise<CmsAuthPayload> {
    const { challengeToken, code } = params;
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${API_BASE}/cms/auth/mfa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        challenge_token: challengeToken,
        code,
      }),
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({} as any));

    if (!res.ok) {
      const msg =
        (data && (data.detail || data.message)) ||
        'Error al verificar código MFA.';
      throw new Error(msg);
    }

    return buildAuthPayload(data);
  }
}

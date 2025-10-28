// src/data/repositories/CmsLoginRepository.tsx
import type { ICmsLoginRepository } from '../../domain/repositories/CmsLoginRepository';
import type { CmsAuthPayload } from '../../lib/cmsAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class CmsLoginRepository implements ICmsLoginRepository {
  async login({ username, password }: { username: string; password: string }): Promise<CmsAuthPayload> {
    const res = await fetch(`${API_BASE}/cms/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      const msg = detail?.detail || 'Credenciales inválidas o usuario no autorizado.';
      throw new Error(msg);
    }

    // Tu backend retorna { token, user: { id, username, first_name, last_name, is_staff } }
    const data = await res.json();

    const payload: CmsAuthPayload = {
      access: data.token as string,
      refresh: '', // no usamos refresh en este backend
      user: {
        id: data.user.id,
        username: data.user.username,
        email: null,
        is_staff: !!data.user.is_staff,
        is_superuser: false,
      },
    };

    return payload;
  }
}

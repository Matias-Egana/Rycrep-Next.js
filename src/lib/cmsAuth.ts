// src/lib/cmsAuth.ts
import { getCsrfToken, clearCsrfToken } from './csrf';
export type CmsUser = {
  id: number;
  username: string;
  email: string | null;
  is_staff: boolean;
  is_superuser: boolean; // si tu backend no lo manda, lo fijamos en false
};

export type CmsAuthPayload = {
  access: string;
  refresh: string;
  user: CmsUser;
};

const USER_KEY = "cms_user";
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const cmsAuth = {
  save(payload: CmsAuthPayload) {
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  },

  getAccess(): string | null {
    return null;
  },

  getRefresh(): string | null {
    return null;
  },

  getUser(): CmsUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CmsUser) : null;
  },

 clear() {
  localStorage.removeItem(USER_KEY);
  clearCsrfToken();

  getCsrfToken()
    .then((token) =>
      fetch(`${API_BASE}/cms/auth/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-Token": token,
        },
      })
    )
    .catch(() => {
    });
 },

  isLoggedIn() {
    return !!this.getUser();
  },
};

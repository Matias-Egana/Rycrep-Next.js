// src/lib/cmsAuth.ts
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

    fetch(`${API_BASE}/cms/auth/logout/`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {
    });
  },

  isLoggedIn() {
    return !!this.getUser();
  },
};

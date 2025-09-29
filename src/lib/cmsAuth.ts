// src/lib/cmsAuth.ts
export type CmsUser = {
  id: number;
  username: string;
  email: string | null;
  is_staff: boolean;
  is_superuser: boolean;
};

export type CmsAuthPayload = {
  access: string;
  refresh: string;
  user: CmsUser;
};

const ACCESS_KEY = 'cms_access';
const REFRESH_KEY = 'cms_refresh';
const USER_KEY = 'cms_user';

export const cmsAuth = {
  save(payload: CmsAuthPayload) {
    localStorage.setItem(ACCESS_KEY, payload.access);
    localStorage.setItem(REFRESH_KEY, payload.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  },
  getAccess() {
    return localStorage.getItem(ACCESS_KEY) || '';
  },
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY) || '';
  },
  getUser(): CmsUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CmsUser) : null;
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isLoggedIn() {
    return !!localStorage.getItem(ACCESS_KEY);
  },
};

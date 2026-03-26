"use client";

import { clearCsrfToken, getCsrfToken } from "@/lib/cms-csrf";

export type CmsUser = {
  id: number;
  username: string;
  email: string | null;
  is_staff: boolean;
  is_superuser: boolean;
  can_manage_mfa?: boolean;
};

export type CmsAuthPayload = {
  access: string;
  refresh: string;
  user: CmsUser;
  password_rotation_warning?: boolean;
  password_age_days?: number | null;
};

const USER_KEY = "cms_user";
const MFA_KEY = "cms_mfa_enabled";
const MFA_SETUP_ALLOWED_KEY = "cms_mfa_setup_allowed";

function safeGet(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, value);
  } catch {}
}

function safeSessionGet(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.sessionStorage.removeItem(key);
      return;
    }
    window.sessionStorage.setItem(key, value);
  } catch {}
}

export const cmsAuth = {
  save(payload: CmsAuthPayload) {
    safeSet(USER_KEY, JSON.stringify(payload.user));
  },

  getUser(): CmsUser | null {
    const raw = safeGet(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CmsUser;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  clear() {
    safeSet(USER_KEY, null);
    safeSet(MFA_KEY, null);
    safeSessionSet(MFA_SETUP_ALLOWED_KEY, null);
    clearCsrfToken();

    getCsrfToken()
      .then((token) =>
        fetch("/api/cms/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRF-Token": token,
          },
        }),
      )
      .catch(() => {});
  },

  setLoggedIn(loggedIn: boolean) {
    if (!loggedIn) this.clear();
  },

  isMfaEnabled() {
    return safeGet(MFA_KEY) === "1";
  },

  setMfaEnabled(enabled: boolean) {
    safeSet(MFA_KEY, enabled ? "1" : null);
  },

  canManageMfa() {
    return !!this.getUser()?.can_manage_mfa;
  },

  allowMfaSetup() {
    safeSessionSet(MFA_SETUP_ALLOWED_KEY, "1");
  },

  canSetupMfa() {
    return safeSessionGet(MFA_SETUP_ALLOWED_KEY) === "1";
  },

  clearMfaSetupAllowance() {
    safeSessionSet(MFA_SETUP_ALLOWED_KEY, null);
  },
};

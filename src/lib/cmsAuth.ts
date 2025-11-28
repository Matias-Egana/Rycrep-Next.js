// src/lib/cmsAuth.ts
import { getCsrfToken, clearCsrfToken } from "./csrf";

export type CmsUser = {
  id: number;
  username: string;
  email: string | null;
  is_staff: boolean;
  is_superuser: boolean; // Si el backend no lo manda, lo fijamos en false
  can_manage_mfa?: boolean; // Permiso para gestionar MFA de otros usuarios
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
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

function safeGet(key: string): string | null {
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
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // ignoramos errores de localStorage
  }
}

export const cmsAuth = {
  // Guarda sólo el usuario (igual que antes)
  save(payload: CmsAuthPayload) {
    safeSet(USER_KEY, JSON.stringify(payload.user));
  },

  getAccess(): string | null {
    // Usas cookies + CSRF, así que aquí no hacemos nada.
    return null;
  },

  getRefresh(): string | null {
    return null;
  },

  getUser(): CmsUser | null {
    const raw = safeGet(USER_KEY);
    return raw ? (JSON.parse(raw) as CmsUser) : null;
  },

  clear() {
    // Limpia estado en cliente
    safeSet(USER_KEY, null);
    safeSet(MFA_KEY, null);
    clearCsrfToken();

    // Intenta cerrar sesión también en el backend (no bloqueante)
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
        // ignoramos errores de red
      });
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  // Helper para que el front pueda "marcar" login/logout
  setLoggedIn(loggedIn: boolean) {
    if (!loggedIn) {
      this.clear();
    }
    // Si es true asumimos que el ViewModel llamó a save() con el usuario.
  },

  // NUEVO: helper para saber si el usuario puede gestionar MFA de otros
  canManageMfa(): boolean {
    const user = this.getUser();
    return !!user?.can_manage_mfa;
  },

  // ======== MFA ========
  isMfaEnabled(): boolean {
    return safeGet(MFA_KEY) === "1";
  },

  setMfaEnabled(enabled: boolean) {
    safeSet(MFA_KEY, enabled ? "1" : null);
  },
};

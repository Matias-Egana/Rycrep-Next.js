// src/lib/csrf.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/cms/csrf/`, {
    credentials: "include",
  });

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok || !data?.csrfToken) {
    throw new Error("No se pudo obtener el token CSRF.");
  }

  return String(data.csrfToken);
}

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;

  if (!csrfPromise) {
    csrfPromise = fetchCsrfToken()
      .then((token) => {
        csrfToken = token;
        return token;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }

  return csrfPromise;
}

export function clearCsrfToken() {
  csrfToken = null;
  csrfPromise = null;
}

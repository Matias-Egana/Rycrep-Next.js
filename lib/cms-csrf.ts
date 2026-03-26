"use client";

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

async function fetchCsrfToken() {
  const response = await fetch("/api/cms/csrf", {
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data || typeof data !== "object" || !("csrfToken" in data)) {
    throw new Error("No se pudo obtener el token CSRF.");
  }

  return String((data as { csrfToken: string }).csrfToken);
}

export async function getCsrfToken() {
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

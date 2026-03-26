"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CmsShell } from "@/components/site/cms/cms-shell";
import { cmsAuth, type CmsAuthPayload, type CmsUser } from "@/lib/cms-auth";
import { clearCsrfToken, getCsrfToken } from "@/lib/cms-csrf";

type LoginResult =
  | { kind: "success"; payload: CmsAuthPayload }
  | { kind: "mfa_required"; challengeToken: string; user: CmsUser };

function mapUser(raw: Record<string, unknown>): CmsUser {
  return {
    id: Number(raw.id),
    username: String(raw.username ?? ""),
    email: raw.email ? String(raw.email) : null,
    is_staff: !!raw.is_staff,
    is_superuser: !!raw.is_superuser,
    can_manage_mfa: !!raw.can_manage_mfa,
  };
}

function buildAuthPayload(data: Record<string, unknown>): CmsAuthPayload {
  return {
    access: String(data.token ?? ""),
    refresh: "",
    user: mapUser((data.user as Record<string, unknown>) ?? {}),
    password_rotation_warning: !!data.password_rotation_warning,
    password_age_days:
      typeof data.password_age_days === "number" ? data.password_age_days : null,
  };
}

async function readStructuredResponse(response: Response) {
  const rawText = await response.text();
  let data: Record<string, unknown> = {};

  try {
    data = JSON.parse(rawText) as Record<string, unknown>;
  } catch {}

  return { rawText, data };
}

function isLikelyCsrfFailure(
  response: Response,
  rawText: string,
  data: Record<string, unknown>
) {
  const normalizedText = rawText.toLowerCase();
  const normalizedError = String(data.error ?? "").toLowerCase();
  const normalizedMessage = String(data.message ?? "").toLowerCase();

  return (
    response.status === 403 &&
    (
      normalizedError.includes("csrf") ||
      normalizedMessage.includes("csrf") ||
      normalizedText.includes("csrf") ||
      normalizedError === "internal_error"
    )
  );
}

function extractErrorMessage(rawText: string, data: Record<string, unknown>, fallback: string) {
  return String(data.detail || data.message || rawText || fallback);
}

async function postWithCsrfRetry(path: string, payload: Record<string, unknown>) {
  let attemptedRefresh = false;

  while (true) {
    const csrfToken = await getCsrfToken();
    const response = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(payload),
    });

    const parsed = await readStructuredResponse(response);

    if (!response.ok && !attemptedRefresh && isLikelyCsrfFailure(response, parsed.rawText, parsed.data)) {
      attemptedRefresh = true;
      clearCsrfToken();
      continue;
    }

    return { response, ...parsed };
  }
}

async function submitLoginRequest(username: string, password: string): Promise<LoginResult> {
  const { response, rawText, data } = await postWithCsrfRetry("/api/cms/auth/login", {
    username,
    password,
  });

  if (!response.ok) {
    throw new Error(extractErrorMessage(rawText, data, "Error al iniciar sesion."));
  }

  if (data.mfa_required) {
    return {
      kind: "mfa_required",
      challengeToken: String(data.challenge_token ?? ""),
      user: mapUser((data.user as Record<string, unknown>) ?? {}),
    };
  }

  return {
    kind: "success",
    payload: buildAuthPayload(data),
  };
}

async function submitMfaRequest(challengeToken: string, code: string) {
  const { response, rawText, data } = await postWithCsrfRetry(
    "/api/cms/auth/mfa/verify",
    {
      challenge_token: challengeToken,
      code,
    }
  );

  if (!response.ok) {
    throw new Error(extractErrorMessage(rawText, data, "Error al verificar el codigo MFA."));
  }

  return buildAuthPayload(data);
}

export function CmsLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cmsAuth.isLoggedIn() && cmsAuth.isMfaEnabled()) {
      router.replace("/cms/productos");
    }
  }, [router]);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      if (mfaRequired) {
        const code = mfaCode.trim();
        if (!code) {
          throw new Error("Debes ingresar el codigo MFA.");
        }
        if (!challengeToken) {
          throw new Error("No hay un desafio MFA activo. Intenta iniciar sesion nuevamente.");
        }

        const payload = await submitMfaRequest(challengeToken, code);
        cmsAuth.save(payload);
        cmsAuth.setLoggedIn(true);
        cmsAuth.setMfaEnabled(true);
        cmsAuth.clearMfaSetupAllowance();
        router.replace("/cms/productos");
        return;
      }

      const cleanUser = username.trim();
      const cleanPassword = password;

      if (!cleanUser || !cleanPassword) {
        throw new Error("Usuario y contrasena son obligatorios.");
      }

      const result = await submitLoginRequest(cleanUser, cleanPassword);

      if (result.kind === "mfa_required") {
        setMfaRequired(true);
        setChallengeToken(result.challengeToken);
        setMfaCode("");
        return;
      }

      cmsAuth.save(result.payload);
      cmsAuth.setLoggedIn(true);
      cmsAuth.setMfaEnabled(false);
      cmsAuth.allowMfaSetup();
      router.replace("/cms/mfa");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No se pudo iniciar sesion."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <CmsShell
      title="Acceso al panel"
      description="Ingresa con tu cuenta administrativa para gestionar productos, credenciales y seguridad del CMS."
    >
      <div className="mx-auto max-w-[460px]">
        {!mfaRequired ? (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-500">
                Usuario
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-500">
                Contrasena
              </label>
              <div className="flex gap-3">
                <input
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
                  onClick={() => setShowPwd((current) => !current)}
                >
                  {showPwd ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="rounded-2xl border border-[#1d2f6f]/10 bg-[#f5f7ff] px-4 py-4 text-sm leading-7 text-slate-600">
              Ingresa el codigo de 6 digitos generado por tu app autenticadora para completar el ingreso.
            </p>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-500">
                Codigo MFA
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium tracking-[0.32em] text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                value={mfaCode}
                onChange={(event) => setMfaCode(event.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
              />
            </div>
          </div>
        )}

        {error ? (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#e63a39] px-5 text-base font-black text-white shadow-[0_18px_34px_rgba(230,58,57,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d63231] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading
            ? mfaRequired
              ? "Verificando..."
              : "Ingresando..."
            : mfaRequired
              ? "Confirmar codigo"
              : "Ingresar"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-400">
          Acceso reservado a personal autorizado.
        </p>
      </div>
    </CmsShell>
  );
}

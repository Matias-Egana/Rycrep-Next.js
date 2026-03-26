"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CmsShell } from "@/components/site/cms/cms-shell";
import { RECAPTCHA_SITE_KEY } from "@/lib/env";

declare global {
  interface Window {
    grecaptcha?: {
      ready?: (callback: () => void) => void;
      render: (container: HTMLElement, options: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

type ValidateResponse =
  | { valid: true; expiresAt?: string }
  | { valid: false; reason?: string; redirectTo?: string };

export function SetupAdminForm({ token }: { token: string }) {
  const router = useRouter();
  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [validating, setValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redirectHint, setRedirectHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(`/api/setup/validate/${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const rawText = await response.text();
        let data: ValidateResponse = { valid: false };

        try {
          data = JSON.parse(rawText) as ValidateResponse;
        } catch {}

        if (cancelled) return;

        if (!response.ok || !data.valid) {
          setIsTokenValid(false);
          setError(
            !data.valid && data.reason
              ? `No fue posible usar este enlace: ${data.reason}.`
              : rawText || "No fue posible validar este enlace de configuración.",
          );
          setRedirectHint(!data.valid && data.redirectTo ? data.redirectTo : "/");
          setValidating(false);
          return;
        }

        setIsTokenValid(true);
        setValidating(false);
      } catch {
        setIsTokenValid(false);
        setError("No pudimos validar el enlace con el backend. Intenta nuevamente o revisa si el token sigue vigente.");
        setRedirectHint("/");
        setValidating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!scriptReady || !captchaContainerRef.current || !RECAPTCHA_SITE_KEY || !window.grecaptcha || widgetIdRef.current !== null) {
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !captchaContainerRef.current || !window.grecaptcha || typeof window.grecaptcha.render !== "function") {
        return;
      }

      widgetIdRef.current = window.grecaptcha.render(captchaContainerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (value: string) => setCaptchaToken(value),
        "expired-callback": () => setCaptchaToken(null),
      });
    };

    if (typeof window.grecaptcha.ready === "function") {
      window.grecaptcha.ready(renderWidget);
    } else {
      const timeout = window.setTimeout(renderWidget, 150);
      return () => {
        cancelled = true;
        window.clearTimeout(timeout);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [scriptReady]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !email || !password) {
      setError("Debes completar todos los campos.");
      return;
    }
    if (!captchaToken) {
      setError("Debes completar el captcha.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/setup/${token}`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, captchaToken }),
      });

      const rawText = await response.text();
      let data: Record<string, unknown> = {};

      try {
        data = JSON.parse(rawText) as Record<string, unknown>;
      } catch {}

      if (!response.ok) {
        throw new Error(String(data.error || data.message || rawText || "No se pudo crear el administrador."));
      }

      setSuccess(String(data.message || "Administrador creado correctamente."));
      window.setTimeout(() => router.replace("/cms/login"), 1200);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No se pudo crear el administrador.");
      if (widgetIdRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current);
        setCaptchaToken(null);
      }
    } finally {
      setLoading(false);
    }
  }

  if (validating) {
    return (
      <CmsShell
        title="Configuración inicial"
        description="Estamos validando el enlace temporal antes de permitir la creación del primer administrador."
      >
        <p className="text-sm text-slate-500">Validando enlace de configuración...</p>
      </CmsShell>
    );
  }

  if (!isTokenValid) {
    return (
      <CmsShell
        title="Enlace de configuración no disponible"
        description="El token no pudo validarse o ya no está vigente. Te dejamos la razón visible para no ocultar el problema."
      >
        <div className="mx-auto max-w-[640px] space-y-5">
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-5 text-sm leading-7 text-red-700">
            {error || "Este enlace de configuración ya no está disponible."}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#e63a39] px-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(230,58,57,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d63231]"
              onClick={() => window.location.reload()}
            >
              Reintentar validación
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
              onClick={() => router.push(redirectHint || "/")}
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </CmsShell>
    );
  }

  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
      <CmsShell
        title="Configuración inicial del CMS"
        description="Crea el primer usuario administrador del sistema usando el mismo flujo protegido del proyecto anterior."
      >
        <div className="mx-auto max-w-[520px]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {[
              {
                id: "setup-username",
                label: "Usuario",
                type: "text",
                value: username,
                setter: setUsername,
                autoComplete: "username",
              },
              {
                id: "setup-email",
                label: "Correo electrónico",
                type: "email",
                value: email,
                setter: setEmail,
                autoComplete: "email",
              },
              {
                id: "setup-password",
                label: "Contraseña",
                type: "password",
                value: password,
                setter: setPassword,
                autoComplete: "new-password",
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-2 block text-sm font-bold text-slate-500">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                  value={field.value}
                  onChange={(event) => field.setter(event.target.value)}
                />
              </div>
            ))}

            <div className="rounded-[24px] border border-slate-200 bg-[#f8fbff] p-4">
              {RECAPTCHA_SITE_KEY ? (
                <div ref={captchaContainerRef} />
              ) : (
                <p className="text-sm text-red-600">
                  Falta configurar <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> para habilitar este formulario.
                </p>
              )}
            </div>

            {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p> : null}
            {success ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success} Redirigiendo al login...</p> : null}

            <button
              type="submit"
              className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#e63a39] px-5 text-base font-black text-white shadow-[0_18px_34px_rgba(230,58,57,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d63231] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading || !RECAPTCHA_SITE_KEY}
            >
              {loading ? "Creando administrador..." : "Crear administrador"}
            </button>
          </form>
        </div>
      </CmsShell>
    </>
  );
}

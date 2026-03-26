"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CmsShell } from "@/components/site/cms/cms-shell";
import { cmsAuth } from "@/lib/cms-auth";
import { getCsrfToken } from "@/lib/cms-csrf";

function qrUrl(value: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(value)}`;
}

export function CmsMfaSetup() {
  const router = useRouter();
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) {
      router.replace("/cms/login");
      return;
    }
    if (cmsAuth.isMfaEnabled()) {
      router.replace("/cms/productos");
      return;
    }
    if (!cmsAuth.canSetupMfa()) {
      router.replace("/cms/login");
      return;
    }

    void (async () => {
      try {
        const csrfToken = await getCsrfToken();
        const response = await fetch("/api/cms/auth/mfa/setup", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        });
        const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

        if (response.status === 401 || response.status === 403) {
          cmsAuth.clear();
          router.replace("/cms/login");
          return;
        }

        if (!response.ok || !data.otpauth_url) {
          throw new Error(String(data.detail || data.message || "No se pudo iniciar la configuracion MFA."));
        }

        const url = String(data.otpauth_url);
        setOtpauthUrl(url);
        try {
          const parsed = new URL(url);
          setSecret(parsed.searchParams.get("secret"));
        } catch {}
      } catch (setupError) {
        setError(setupError instanceof Error ? setupError.message : "No se pudo iniciar la configuracion MFA.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function confirmMfa() {
    const cleanCode = code.trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      setError("El codigo MFA debe tener exactamente 6 digitos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch("/api/cms/auth/mfa/enable", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ code: cleanCode }),
      });
      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok || !data.enabled) {
        throw new Error(String(data.detail || data.message || "Codigo MFA invalido."));
      }

      cmsAuth.setMfaEnabled(true);
      cmsAuth.clearMfaSetupAllowance();
      router.replace("/cms/productos");
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "No se pudo activar MFA.");
      setLoading(false);
    }
  }

  return (
    <CmsShell
      title="Configura tu segundo factor"
      description="Antes de entrar al panel, confirma la autenticacion en dos pasos con tu aplicacion autenticadora."
    >
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <div className="rounded-[28px] border border-slate-200 bg-[#f8fbff] p-5 text-center">
          {loading && !otpauthUrl ? (
            <p className="text-sm text-slate-500">Generando codigo QR...</p>
          ) : null}
          {otpauthUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl(otpauthUrl)}
                alt="Codigo QR MFA"
                className="mx-auto h-[220px] w-[220px] rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_16px_32px_rgba(15,23,42,0.08)]"
              />
              {secret ? (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Si no puedes escanearlo, usa este secreto manual:
                  <span className="mt-2 block rounded-2xl bg-white px-4 py-3 font-mono text-sm font-bold text-[#111827]">
                    {secret}
                  </span>
                </p>
              ) : null}
            </>
          ) : null}
        </div>

        <div>
          <p className="text-[1rem] leading-7 text-slate-600">
            Escanea el codigo con Google Authenticator, Authy u otra app compatible y luego escribe el primer codigo de 6 digitos.
          </p>

          <div className="mt-6 max-w-[420px]">
            <label className="mb-2 block text-sm font-bold text-slate-500">
              Codigo MFA
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium tracking-[0.3em] text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
            />
          </div>

          {error ? (
            <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#e63a39] px-6 text-base font-black text-white shadow-[0_18px_34px_rgba(230,58,57,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d63231] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading || !otpauthUrl}
              onClick={confirmMfa}
            >
              {loading && otpauthUrl ? "Verificando..." : "Confirmar y activar MFA"}
            </button>
            <button
              type="button"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-base font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
              onClick={() => {
                cmsAuth.clearMfaSetupAllowance();
                router.replace("/cms/login");
              }}
            >
              Volver al login
            </button>
          </div>
        </div>
      </div>
    </CmsShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CmsNavbar } from "@/components/site/cms/cms-navbar";
import { cmsAuth } from "@/lib/cms-auth";
import { getCsrfToken } from "@/lib/cms-csrf";

export function CmsMfaAdminForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) {
      router.replace("/cms/login");
      return;
    }
    if (!cmsAuth.canManageMfa()) {
      router.replace("/cms");
    }
  }, [router]);

  async function handleReset() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const trimmed = username.trim();
      if (!trimmed) throw new Error("Debes indicar un nombre de usuario.");

      const csrfToken = await getCsrfToken();
      const response = await fetch(`/api/cms/users/${encodeURIComponent(trimmed)}/mfa/reset`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({}),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok) {
        throw new Error(String(data.detail || data.message || "Error al resetear MFA."));
      }

      setMessage(
        `La autenticación en dos pasos se ha reseteado para ${String(data.username || trimmed)}${data.userId ? ` (ID ${String(data.userId)})` : ""}.`,
      );
      setUsername("");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Error al resetear MFA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <CmsNavbar />
      <div className="mx-auto w-full max-w-[860px] px-4 py-10 sm:px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_28px_60px_rgba(15,23,42,0.08)] sm:p-10">
          <span className="inline-flex rounded-full bg-[#e63a39]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#e63a39]">
            Seguridad avanzada
          </span>
          <h1 className="mt-4 text-[2.3rem] font-black tracking-[-0.05em] text-[#111827]">Gestión de MFA</h1>
          <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-slate-500">
            Desde aquí puedes resetear el segundo factor de otro usuario cuando pierda acceso a su aplicación autenticadora.
          </p>

          <div className="mt-8">
            <label htmlFor="mfa-username" className="mb-2 block text-sm font-bold text-slate-500">
              Nombre de usuario
            </label>
            <input
              id="mfa-username"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ej: admin"
            />
          </div>

          {message ? <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p> : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#e63a39] px-6 text-base font-black text-white shadow-[0_18px_34px_rgba(230,58,57,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d63231] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading || !username.trim()}
              onClick={handleReset}
            >
              {loading ? "Reseteando..." : "Resetear MFA"}
            </button>
            <button
              type="button"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-base font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
              onClick={() => router.push("/cms/productos")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

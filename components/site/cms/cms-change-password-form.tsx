"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CmsNavbar } from "@/components/site/cms/cms-navbar";
import { cmsAuth } from "@/lib/cms-auth";
import { getCsrfToken } from "@/lib/cms-csrf";

const COMMON_PASSWORDS = ["123456", "123456789", "password", "qwerty", "admin", "111111", "123123", "abc123"];

function validatePasswordStrength(password: string, username?: string | null, email?: string | null) {
  const errors: string[] = [];
  if (password.length < 12) errors.push("Debe tener al menos 12 caracteres.");
  if (!/[a-z]/.test(password)) errors.push("Debe contener al menos una letra minúscula.");
  if (!/[A-Z]/.test(password)) errors.push("Debe contener al menos una letra mayúscula.");
  if (!/[0-9]/.test(password)) errors.push("Debe contener al menos un dígito.");
  if (!/[^\w\s]/.test(password)) errors.push("Debe contener al menos un carácter especial.");
  if (COMMON_PASSWORDS.includes(password)) errors.push("La contraseña es demasiado trivial.");

  const lower = password.toLowerCase();
  const candidates = [username?.toLowerCase(), email?.split("@")[0]?.toLowerCase()].filter(Boolean) as string[];
  for (const candidate of candidates) {
    if (candidate.length >= 3 && lower.includes(candidate)) {
      errors.push("No debe contener datos personales evidentes.");
      break;
    }
  }

  return errors;
}

export function CmsChangePasswordForm() {
  const router = useRouter();
  const user = useMemo(() => cmsAuth.getUser(), []);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [policyErrors, setPolicyErrors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) {
      router.replace("/cms/login");
      return;
    }
    if (!cmsAuth.isMfaEnabled()) {
      router.replace("/cms/mfa");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setPolicyErrors([]);

    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Todos los campos son obligatorios.");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("La nueva contraseña y su confirmación no coinciden.");
      }

      const errors = validatePasswordStrength(newPassword, user?.username ?? null, user?.email ?? null);
      if (errors.length > 0) {
        setPolicyErrors(errors);
        throw new Error("La nueva contraseña no cumple la política de seguridad.");
      }

      const csrfToken = await getCsrfToken();
      const response = await fetch("/api/cms/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      if (!response.ok) {
        if (Array.isArray(data.errors)) setPolicyErrors(data.errors.map(String));
        throw new Error(String(data.detail || data.message || "No se pudo cambiar la contraseña."));
      }

      setMessage(String(data.message || "Contraseña actualizada correctamente."));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No se pudo cambiar la contraseña.");
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
            Cuenta
          </span>
          <h1 className="mt-4 text-[2.3rem] font-black tracking-[-0.05em] text-[#111827]">Cambiar contraseña</h1>
          <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-slate-500">
            Mantén una clave robusta y cámbiala periódicamente. La política sigue los requisitos del backend original.
          </p>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-[#f8fbff] px-5 py-5 text-sm leading-7 text-slate-600">
            <p>
              Sesión iniciada como <strong>@{user?.username ?? "usuario"}</strong>.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Mínimo 12 caracteres.</li>
              <li>Mayúsculas, minúsculas, números y símbolo obligatorio.</li>
              <li>No debe ser trivial ni contener usuario o correo.</li>
            </ul>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {[
              {
                id: "current-password",
                label: "Contraseña actual",
                value: currentPassword,
                setValue: setCurrentPassword,
                placeholder: "••••••••••••",
              },
              {
                id: "new-password",
                label: "Nueva contraseña",
                value: newPassword,
                setValue: setNewPassword,
                placeholder: "Escribe una contraseña robusta",
              },
              {
                id: "confirm-password",
                label: "Confirmar nueva contraseña",
                value: confirmPassword,
                setValue: setConfirmPassword,
                placeholder: "Repite la nueva contraseña",
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-2 block text-sm font-bold text-slate-500">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                  value={field.value}
                  onChange={(event) => field.setValue(event.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p> : null}
            {policyErrors.length > 0 ? (
              <ul className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                {policyErrors.map((policyError) => (
                  <li key={policyError}>{policyError}</li>
                ))}
              </ul>
            ) : null}
            {message ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p> : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#e63a39] px-6 text-base font-black text-white shadow-[0_18px_34px_rgba(230,58,57,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d63231] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Cambiar contraseña"}
              </button>
              <button
                type="button"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-base font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
                onClick={() => router.push("/cms/productos")}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

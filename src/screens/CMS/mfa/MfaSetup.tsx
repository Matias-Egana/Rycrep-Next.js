// src/screens/CMS/mfa/MfaSetup.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import CmsNavbar from "../../../components/cms/CmsNavbar";
import { cmsAuth } from "../../../lib/cmsAuth";
import "../login/Login.css"; // reutilizamos estilos (card, btn, etc.)
import { getCsrfToken } from "../../../lib/csrf";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function MfaSetup() {
  const nav = useNavigate();

  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si no hay sesión CMS → al login
  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) {
      nav("/cms/login", { replace: true });
    }
  }, [nav]);

  // Apenas entras a /cms/mfa, pedimos al backend que genere el secret y la otpauth_url
  useEffect(() => {
    startSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startSetup() {
    setLoading(true);
    setError(null);
    setEnabled(false);
    setOtpauthUrl(null);
    setSecret(null);
    setCode("");

   try {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${API_BASE}/cms/auth/mfa/setup`, {
      method: "POST",
      credentials: "include", 
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        throw new Error(
          data?.detail || data?.message || "No se pudo iniciar el setup de MFA."
        );
      }

      if (!data.otpauth_url) {
        throw new Error("El servidor no devolvió la otpauth_url.");
      }

      setOtpauthUrl(data.otpauth_url);

      // Intentar extraer el secret para mostrarlo como fallback manual
      try {
        const url = new URL(data.otpauth_url);
        const s = url.searchParams.get("secret");
        if (s) setSecret(s);
      } catch {
        // si falla no importa, el QR igual funciona
      }
    } catch (err: any) {
      setError(err?.message || "Error al iniciar configuración MFA.");
    } finally {
      setLoading(false);
    }
  }

async function confirmMfa() {
  const c = code.trim();

  if (!c) {
    setError("Debes ingresar el código MFA de 6 dígitos.");
    return;
  }

  if (!/^\d{6}$/.test(c)) {
    setError("El código MFA debe tener exactamente 6 dígitos.");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${API_BASE}/cms/auth/mfa/enable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ code: c }),
      credentials: "include",
    });

    const data = await res.json().catch(() => ({} as any));

    if (!res.ok || !data.enabled) {
      throw new Error(
        data?.detail || data?.message || "Código MFA inválido."
      );
    }

    setEnabled(true);
    nav("/cms/productos", { replace: true });
  } catch (err: any) {
    setError(err?.message || "Error al activar MFA.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="cms-page nice-surface">
      <CmsNavbar />

      <div className="cms-container">
        <div className="card">
          <h1 className="title">Seguridad / MFA</h1>
          <p className="description">
            Habilita un segundo factor de autenticación usando una app como
            Google Authenticator o Authy.
          </p>

          {loading && !otpauthUrl && (
            <p className="description">Generando código QR…</p>
          )}

          {otpauthUrl && (
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <p className="description">
                Escanea este código QR con tu app de autenticación.
              </p>
              <div
                style={{
                  background: "white",
                  padding: "16px",
                  display: "inline-block",
                  borderRadius: "12px",
                }}
              >
                <QRCode value={otpauthUrl} size={192} />
              </div>

              {secret && (
                <p className="description" style={{ marginTop: "0.75rem" }}>
                  Si no puedes escanear el QR, usa este código manualmente en tu
                  app:
                  <br />
                  <code>{secret}</code>
                </p>
              )}
            </div>
          )}

          {otpauthUrl && (
            <>
              <label className="label" htmlFor="mfa-code">
                Ingresa el primer código MFA que veas en tu app
              </label>
              <input
                id="mfa-code"
                className="input"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
              />
              <button
                className="btn"
                disabled={loading}
                onClick={confirmMfa}
                style={{ marginTop: "0.75rem" }}
              >
                {loading ? "Verificando..." : "Confirmar y activar MFA"}
              </button>
            </>
          )}

          {enabled && (
            <p className="description" style={{ marginTop: "0.75rem" }}>
              ✅ MFA activado correctamente para tu cuenta.
            </p>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

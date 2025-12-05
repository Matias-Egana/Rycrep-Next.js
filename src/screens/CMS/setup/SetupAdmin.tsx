// src/screens/CMS/setup/SetupAdmin.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../login/Login.css";

const BACKEND_BASE = (import.meta.env.VITE_MEDIA_BASE_URL || "").replace(
  /\/+$/,
  ""
);

if (!BACKEND_BASE) {
  throw new Error("VITE_MEDIA_BASE_URL no está definida");
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

if (!RECAPTCHA_SITE_KEY) {
  throw new Error("VITE_RECAPTCHA_SITE_KEY no está definida");
}

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

export default function SetupAdmin() {
  const { token } = useParams<{ token: string }>();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 👇 nuevo: token del captcha
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="cms-login">
        <div className="cms-card">
          <h1 className="title">Configuración inicial</h1>
          <p className="subtitle">Token inválido en la URL.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !email || !password) {
      setError("Debes completar todos los campos.");
      return;
    }

    // 👇 validación de captcha en el frontend
    if (!captchaToken) {
      setError("Debes completar el captcha.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_BASE}/setup/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 👇 enviamos captchaToken al backend
        body: JSON.stringify({ username, email, password, captchaToken }),
      });

      const data: ApiResponse = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        // Mensajes más claros según status
        if (res.status === 410) {
          setError(
            data.error ??
              "Este enlace de configuración ya fue usado o expiró."
          );
        } else if (res.status === 404) {
          setError(data.error ?? "Token inválido.");
        } else if (res.status === 429) {
          setError(
            data.error ??
              "Demasiados intentos. El token ha sido bloqueado por seguridad."
          );
        } else {
          setError(
            data.error ??
              data.message ??
              "No se pudo crear el administrador. Inténtalo de nuevo."
          );
        }
        return;
      }

      setSuccess(data.message ?? "Administrador creado correctamente.");
      // Opcional: redirigir al login del CMS
      setTimeout(() => {
        nav("/cms/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cms-login">
      <div className="cms-card">
        <h1 className="title">Configuración inicial del CMS</h1>
        <p className="subtitle">
          Crea el <strong>primer usuario administrador</strong> del sistema.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="username">
            Usuario
          </label>
          <input
            id="username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label className="label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label className="label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          {/*  Captcha obligatorio antes de enviar */}
          <div style={{ marginTop: "16px", marginBottom: "8px" }}>
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY ?? ""}
              onChange={(token) => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
            />
          </div>

          <button
            className="btn primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: "20px", width: "100%" }}
          >
            {loading ? "Creando administrador..." : "Crear administrador"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        {success && (
          <p className="footer-note" style={{ color: "#16a34a" }}>
            {success} Redirigiendo al login...
          </p>
        )}

        <p className="footer-note">
          Este formulario solo funciona cuando <strong>no existe</strong> ningún
          administrador en el sistema.
        </p>
      </div>
    </div>
  );
}

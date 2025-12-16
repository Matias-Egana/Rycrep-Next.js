// src/screens/CMS/setup/SetupAdmin.tsx
import { useEffect, useState } from "react";
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
  redirectTo?: string;
};

type ValidateResponse =
  | { valid: true; expiresAt?: string }
  | { valid: false; reason?: string; redirectTo?: string };

export default function SetupAdmin() {
  const { token } = useParams<{ token: string }>();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // token del captcha
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // ✅ NUEVO: validar token apenas entra a /setup/:token
  useEffect(() => {
    if (!token) {
      // No mostramos nada: ruta inválida -> INICIO
      nav("/", { replace: true });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/setup/validate/${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data: ValidateResponse = await res.json().catch(() => ({
          valid: false,
        }));

        if (cancelled) return;

        if (!res.ok || !data.valid) {
          // Token inválido / admin ya existe -> INICIO
          const redirectTo =
            (!data.valid && data.redirectTo) ? data.redirectTo : "/";

          // usamos location para asegurarnos de salir sí o sí de /setup/:token
          window.location.replace(redirectTo);
          return;
        }

        setValidating(false);
      } catch (e) {
        // Si no podemos confirmar validez, por seguridad tratamos como inválido -> INICIO
        window.location.replace("/");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, nav]);

  // Mientras validamos, no mostramos el formulario
  if (validating) {
    return (
      <div className="cms-login">
        <div className="cms-card">
          <h1 className="title">Configuración inicial</h1>
          <p className="subtitle">Validando enlace de configuración...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      window.location.replace("/");
      return;
    }

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
      const res = await fetch(`${BACKEND_BASE}/setup/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, captchaToken }),
      });

      const data: ApiResponse = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        // ✅ NUEVO: si backend trae redirectTo, mandamos al INICIO automáticamente
        if (data.redirectTo) {
          window.location.replace(data.redirectTo);
          return;
        }

        if (res.status === 410) {
          setError(
            data.error ?? "Este enlace de configuración ya fue usado o expiró."
          );
          // Por requerimiento, en caso inválido no debe quedarse aquí:
          setTimeout(() => nav("/", { replace: true }), 800);
        } else if (res.status === 404) {
          setError(data.error ?? "Token inválido.");
          setTimeout(() => nav("/", { replace: true }), 800);
        } else if (res.status === 429) {
          setError(
            data.error ??
              "Demasiados intentos. El token ha sido bloqueado por seguridad."
          );
          setTimeout(() => nav("/", { replace: true }), 800);
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
      setTimeout(() => {
        nav("/cms/login", { replace: true });
      }, 1200);
    } catch (err) {
      console.error(err);
      // Por seguridad: si no hay conexión, no permitimos seguir en setup
      window.location.replace("/");
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

          <div style={{ marginTop: "16px", marginBottom: "8px" }}>
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY ?? ""}
              onChange={(t) => setCaptchaToken(t)}
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

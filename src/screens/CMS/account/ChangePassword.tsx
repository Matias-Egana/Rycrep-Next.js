// src/screens/CMS/account/ChangePassword.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cmsAuth } from "../../../lib/cmsAuth";
import { getCsrfToken } from "../../../lib/csrf";
import "../login/Login.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

type PolicyResult = {
  valid: boolean;
  errors: string[];
};

const COMMON_PASSWORDS = [
  "123456",
  "123456789",
  "password",
  "qwerty",
  "admin",
  "111111",
  "123123",
  "abc123",
];

function validatePasswordStrengthFrontend(password: string): PolicyResult {
  const errors: string[] = [];
  const pwd = password ?? "";

  if (pwd.length < 12) {
    errors.push("Debe tener al menos 12 caracteres.");
  }
  if (!/[a-z]/.test(pwd)) {
    errors.push("Debe contener al menos una letra minúscula.");
  }
  if (!/[A-Z]/.test(pwd)) {
    errors.push("Debe contener al menos una letra mayúscula.");
  }
  if (!/[0-9]/.test(pwd)) {
    errors.push("Debe contener al menos un dígito.");
  }
  if (!/[^\w\s]/.test(pwd)) {
    errors.push("Debe contener al menos un carácter especial.");
  }
  if (COMMON_PASSWORDS.includes(pwd)) {
    errors.push("La contraseña es demasiado trivial.");
  }

  const user = cmsAuth.getUser();
  const lowerPwd = pwd.toLowerCase();
  const candidates: string[] = [];

  if (user?.username) {
    candidates.push(user.username.toLowerCase());
  }
  if (user?.email) {
    const [local] = user.email.split("@");
    if (local) candidates.push(local.toLowerCase());
  }

  for (const c of candidates) {
    if (c && c.length >= 3 && lowerPwd.includes(c)) {
      errors.push(
        "No debe contener datos personales evidentes (usuario, correo, etc)."
      );
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default function ChangePassword() {
  const nav = useNavigate();
  const currentUser = cmsAuth.getUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [policyErrors, setPolicyErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) {
      nav("/cms/login", { replace: true });
    }
  }, [nav]);

  const handleBack = () => {
    nav("/cms/productos");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setPolicyErrors([]);

    try {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        setError("Todos los campos son obligatorios.");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setError("La nueva contraseña y su confirmación no coinciden.");
        setLoading(false);
        return;
      }

      const policy = validatePasswordStrengthFrontend(newPassword);
      if (!policy.valid) {
        setPolicyErrors(policy.errors);
        setError("La nueva contraseña no cumple la política de seguridad.");
        setLoading(false);
        return;
      }

      const csrf = await getCsrfToken();

      const res = await fetch(`${API_BASE}/cms/auth/change-password/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        if (Array.isArray(data?.errors)) {
          setPolicyErrors(data.errors.map(String));
        }
        throw new Error(
          data?.detail || data?.message || "No se pudo cambiar la contraseña."
        );
      }

      setMessage(data?.message || "Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPolicyErrors([]);
    } catch (e: any) {
      setError(e?.message ?? "Error inesperado al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="cms-login">
      <div className="card">
        <h1 className="title">Cambiar contraseña</h1>
        <p className="description">
          Desde aquí puedes actualizar tu contraseña de acceso al CMS. Mantén
          una clave robusta y cámbiala periódicamente.
        </p>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginTop: "-0.25rem",
            marginBottom: "0.9rem",
          }}
        >
          Sesión iniciada como <strong>@{currentUser.username}</strong>.
        </p>

        <div
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          <p style={{ margin: 0, marginBottom: "0.25rem" }}>
            Requisitos de la nueva contraseña:
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            <li>Mínimo 12 caracteres.</li>
            <li>Al menos mayúsculas, minúsculas y números.</li>
            <li>Al menos un símbolo (ej: ! @ # $ %).</li>
            <li>No debe ser trivial ni contener tu usuario/correo.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="currentPassword">
            Contraseña actual
          </label>
          <input
            id="currentPassword"
            className="input"
            type="password"
            placeholder="••••••••••"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <label className="label" htmlFor="newPassword">
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            className="input"
            type="password"
            placeholder="Escribe una contraseña robusta"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className="label" htmlFor="confirmNewPassword">
            Confirmar nueva contraseña
          </label>
          <input
            id="confirmNewPassword"
            className="input"
            type="password"
            placeholder="Repite la nueva contraseña"
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          {error && (
            <p className="error" style={{ marginTop: "0.5rem" }}>
              {error}
            </p>
          )}

          {policyErrors.length > 0 && (
            <ul className="error" style={{ marginTop: "0.25rem" }}>
              {policyErrors.map((errMsg, idx) => (
                <li key={idx}>{errMsg}</li>
              ))}
            </ul>
          )}

          {message && (
            <p className="success" style={{ marginTop: "0.75rem" }}>
              {message}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Guardando…" : "Cambiar contraseña"}
            </button>

            <button
              type="button"
              className="login-button"
              style={{ backgroundColor: "#777" }}
              onClick={handleBack}
              disabled={loading}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

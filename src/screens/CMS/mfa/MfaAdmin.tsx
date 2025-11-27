// src/screens/CMS/mfa/MfaAdmin.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cmsAuth } from "../../../lib/cmsAuth";
import { getCsrfToken } from "../../../lib/csrf";
import "../login/Login.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function MfaAdmin() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tiene que estar logueado
    if (!cmsAuth.isLoggedIn()) {
      nav("/cms/login", { replace: true });
      return;
    }

    // Y tener permiso para gestionar MFA (can_manage_mfa:true)
    if (!cmsAuth.canManageMfa()) {
      nav("/cms/login", { replace: true });
    }
  }, [nav]);

  const handleReset = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const trimmed = username.trim();
      if (!trimmed) {
        setError("Debes indicar un nombre de usuario.");
        setLoading(false);
        return;
      }

      const csrf = await getCsrfToken();

      const res = await fetch(
        `${API_BASE}/cms/users/${encodeURIComponent(trimmed)}/mfa/reset`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrf,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        throw new Error(
          data?.detail || data?.message || "Error al resetear MFA."
        );
      }

      setMessage(
        `MFA reseteado para el usuario ${
          data.username || trimmed
        } (ID ${data.userId}).`
      );
    } catch (e: any) {
      setError(e?.message ?? "Error inesperado al resetear MFA.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Puedes cambiar la ruta si quieres ir a otro lado
    nav("/cms/productos");
  };

  const currentUser = cmsAuth.getUser();
  if (!currentUser) return null;

  return (
    <div className="cms-login">
      <div className="card">
        <h1 className="title">Gestión de MFA</h1>
        <p className="description">
          Desde aquí puedes resetear la autenticación en dos pasos de otros
          usuarios <code>staff</code> cuando pierden acceso a su app de
          autenticación.
        </p>

        <label className="label" htmlFor="username">
          Nombre de usuario (auth_user.username)
        </label>
        <input
          id="username"
          className="input"
          type="text"
          placeholder="Ej: admin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
            className="login-button"
            onClick={handleReset}
            disabled={loading || !username.trim()}
          >
            {loading ? "Reseteando…" : "Resetear MFA"}
          </button>

          <button
            type="button"
            className="login-button"
            style={{ backgroundColor: "#777" }}
            onClick={handleBack}
          >
            Volver
          </button>
        </div>

        {message && <p className="success" style={{ marginTop: "1rem" }}>{message}</p>}
        {error && <p className="error" style={{ marginTop: "0.5rem" }}>{error}</p>}
      </div>
    </div>
  );
}

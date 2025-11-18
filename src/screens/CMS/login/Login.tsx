// src/screens/CMS/login/Login.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCmsLoginVM } from './ViewModel';
import './Login.css';
import { cmsAuth } from '../../../lib/cmsAuth';

export default function CmsLogin() {
  const nav = useNavigate();
  const {
    state,
    setUsername,
    setPassword,
    setShowPwd,
    setMfaCode,
    submitLogin,
    submitMfa,
  } = useCmsLoginVM();

  // Si ya hay sesión CMS, manda directo al panel
  useEffect(() => {
    if (cmsAuth.isLoggedIn()) nav('/cms/productos', { replace: true });
  }, [nav]);

  function handleSubmit() {
    if (state.mfaRequired) {
      //  Cuando ya tiene MFA activado: código de 6 dígitos y al CMS
      submitMfa(() => nav('/cms/productos', { replace: true }));
    } else {
      //  Login sin MFA activado todavía: ir directo a la pantalla de QR
      submitLogin(() => nav('/cms/mfa', { replace: true }));
    }
  }

  return (
    <div className="cms-login">
      <div className="card">
        <h1 className="title">Acceso al panel de administración.</h1>
        <p className="description">
          Autenticado contra usuarios <code>auth_user</code> con permiso <code>is_staff</code>.
        </p>

        {/* Paso 1: usuario + contraseña (cuando aún no se ha pedido MFA) */}
        {!state.mfaRequired && (
          <>
            <label className="label" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              className="input"
              placeholder="admin"
              value={state.username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <label className="label" htmlFor="password">
              Contraseña
            </label>
            <div className="password-row">
              <input
                id="password"
                className="input"
                type={state.showPwd ? 'text' : 'password'}
                value={state.password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn-eye"
                onClick={() => setShowPwd(!state.showPwd)}
              >
                {state.showPwd ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </>
        )}

        {/* Paso 2: código MFA (cuando backend responde mfa_required) */}
        {state.mfaRequired && (
          <>
            <p className="description">
              Ingresa el código de 6 dígitos generado por tu app de autenticación
              (Google Authenticator, etc.).
            </p>
            <label className="label" htmlFor="mfa-code">
              Código MFA
            </label>
            <input
              id="mfa-code"
              className="input"
              placeholder="000000"
              value={state.mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </>
        )}

        {state.error && <p className="error">{state.error}</p>}

        <button
          className="btn"
          disabled={state.loading}
          onClick={handleSubmit}
        >
          {state.loading
            ? state.mfaRequired
              ? 'Verificando…'
              : 'Ingresando…'
            : state.mfaRequired
            ? 'Confirmar código'
            : 'Ingresar'}
        </button>

        <p className="footer-note">
          Autenticado contra usuarios <code>auth_user</code> (is_staff).
        </p>
      </div>
    </div>
  );
}

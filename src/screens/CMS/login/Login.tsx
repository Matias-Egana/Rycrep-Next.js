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

  // Si ya hay sesión CMS:
  // - con MFA → panel
  // - sin MFA → se queda en login (no mandamos al QR automáticamente)
  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) return;

    if (cmsAuth.isMfaEnabled()) {
      nav('/cms/productos', { replace: true });
    }
  }, [nav]);

  function handleSubmit() {
    if (state.mfaRequired) {
      // Usuario que ya tiene MFA configurado → pedimos código
      submitMfa(() => {
        cmsAuth.setLoggedIn(true);
        cmsAuth.setMfaEnabled(true);
        nav('/cms/productos', { replace: true });
      });
    } else {
      // Login inicial de usuario sin MFA
      submitLogin(() => {
        cmsAuth.setLoggedIn(true);
        cmsAuth.setMfaEnabled(false); // MFA pendiente
        // 👇 Solo permitimos entrar a /cms/mfa cuando venimos del login
        nav('/cms/mfa', {
          replace: true,
          state: { fromLogin: true },
        });
      });
    }
  }

  return (
    <div className="cms-login">
      <div className="card">
        <h1 className="title">Acceso al panel de administración</h1>
        <p className="description">
          Ingresa tu usuario y contraseña para acceder al panel de administración.
        </p>

        {/* Paso 1: usuario + contraseña */}
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

        {/* Paso 2: código MFA cuando backend responde mfa_required */}
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
              maxLength={6}
            />
            {/* 🔒 Importante: esto NO llama al endpoint de reset */}
            <p
              className="help-text"
              style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}
            >
              ¿No puedes acceder a tu app de autenticación?
              <br />
              Ponte en contacto con un administrador para que resetee tu MFA desde el panel de control.
            </p>
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

        {/* Nota de pie neutra, sin detalles internos */}
        <p className="footer-note">
          Acceso reservado a personal autorizado.
        </p>
      </div>
    </div>
  );
}

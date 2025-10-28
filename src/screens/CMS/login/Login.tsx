// src/screens/CMS/login/Login.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { cmsAuth } from '../../../lib/cmsAuth';
import { useCmsLoginVM } from './ViewModel';
import './Login.css';

export default function CmsLogin() {
  const nav = useNavigate();
  const { state, setUsername, setPassword, setShowPwd, submit } = useCmsLoginVM();

  useEffect(() => {
    //if (cmsAuth.isLoggedIn()) nav('/cms/productos', { replace: true });
  }, [nav]);

  return (
    <div className="cms-login">
      <div className="card">
        <h1 className="title">CMS — Acceso</h1>
        <p className="subtitle">Solo personal autorizado</p>

        <label className="label" htmlFor="username">Usuario</label>
        <input
          id="username"
          className="input"
          placeholder="admin"
          value={state.username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <label className="label" htmlFor="password">Contraseña</label>
        <div className="password-row">
          <input
            id="password"
            className="input"
            type={state.showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            value={state.password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button className="link" onClick={() => setShowPwd(!state.showPwd)}>
            {state.showPwd ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        {state.error && <div className="error">{state.error}</div>}

        <button
          className="btn"
          disabled={state.loading}
          //onClick={() => submit(() => nav('/cms/productos', { replace: true }))}
        >
          {state.loading ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className="footer-note">Autenticado contra usuarios <code>auth_user</code> (is_staff).</p>
      </div>
    </div>
  );
}

// src/components/cms/CmsNavbar.tsx
import { useNavigate } from 'react-router-dom';
import { cmsAuth } from '../../lib/cmsAuth';
import './CmsNavbar.css';

export default function CmsNavbar() {
  const nav = useNavigate();
  const user = cmsAuth.getUser();
  const canManageMfa = cmsAuth.canManageMfa();

  function goToChangePassword() {
    nav('/cms/change-password');
  }

  function goToMfaAdmin() {
    nav('/cms/mfa-admin');
  }

  function logout() {
    cmsAuth.clear();
    nav('/cms/login', { replace: true });
  }

  return (
    <nav className="cms-nav">
      <div className="cms-nav__left">
        <span className="cms-brand">RYCREP — CMS</span>
        <button className="cms-btn" type="button" onClick={goToChangePassword}>
          Cambiar contraseña
        </button>
        {canManageMfa && (
          <button className="cms-btn" type="button" onClick={goToMfaAdmin}>
            Gestionar MFA
          </button>
        )}
      </div>
      <div className="cms-nav__right">
        {user && <span className="cms-user">@{user.username}</span>}
        <button className="cms-btn" type="button" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

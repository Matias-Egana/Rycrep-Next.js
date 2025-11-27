// src/components/cms/CmsNavbar.tsx
import { useNavigate } from 'react-router-dom';
import { cmsAuth } from '../../lib/cmsAuth';
import './CmsNavbar.css';

export default function CmsNavbar() {
  const nav = useNavigate();
  const user = cmsAuth.getUser();
  const canManageMfa = cmsAuth.canManageMfa();

  function logout() {
    cmsAuth.clear();
    nav('/cms/login', { replace: true });
  }

  function goToMfaAdmin() {
    nav('/cms/mfa-admin');
  }

  return (
    <nav className="cms-nav">
      <div className="cms-nav__left">
        <span className="cms-brand">RYCREP — CMS</span>

        {canManageMfa && (
          <button className="cms-btn" onClick={goToMfaAdmin}>
            Gestionar MFA
          </button>
        )}
      </div>
      <div className="cms-nav__right">
        {user && <span className="cms-user">@{user.username}</span>}
        <button className="cms-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

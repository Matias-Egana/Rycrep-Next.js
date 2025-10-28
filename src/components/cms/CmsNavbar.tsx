// src/components/cms/CmsNavbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { cmsAuth } from '../../lib/cmsAuth';
import './CmsNavbar.css';

export default function CmsNavbar() {
  const nav = useNavigate();
  const user = cmsAuth.getUser();

  const logout = () => {
    cmsAuth.clear();
    nav('/cms/login', { replace: true });
  };

  return (
    <nav className="cms-nav">
      <div className="cms-nav__left">
        <span className="cms-brand">RYCREP — CMS</span>
        <Link to="/cms/productos" className="cms-link">Productos</Link>
      </div>
      <div className="cms-nav__right">
        {user && <span className="cms-user">@{user.username}</span>}
        <button className="cms-btn" onClick={logout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}

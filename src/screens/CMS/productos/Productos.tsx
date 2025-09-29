// src/screens/CMS/productos/Productos.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsAuth } from '../../../lib/cmsAuth';

export default function CmsProductos() {
  const nav = useNavigate();

  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) nav('/cms/login', { replace: true });
  }, [nav]);

  const user = cmsAuth.getUser();

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>CMS — Productos</h1>
      <p style={{ color: '#6b7280' }}>
        Bienvenido {user?.username}. Próximamente el CRUD de productos aquí.
      </p>
      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => { cmsAuth.clear(); nav('/cms/login'); }}
          style={{ border: '1px solid #111', background: '#fff', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

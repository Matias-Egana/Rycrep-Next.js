// src/App.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';

import Inicio from './screens/inicio/Inicio';
import Nosotros from './screens/nosotros/Nosotros';
import Servicios from './screens/servicios/servicios';
import Productos from './screens/productos/ProductList';
import ProductDetail from './screens/productos/ProductDetail';
import Representacion from './screens/representacion/representacion';
import Contacto from './screens/contacto/Contacto';
import Distribuciones from './screens/distribuciones/Distribuciones';
import Cotizado from './screens/cotizado/Cotizado';
import NotFound from './screens/NotFound';

import WhatsAppWidget, { type WhatsAppContact } from './components/layout/WhatsAppWidget/WhatsAppWidget';

import CmsLogin from './screens/CMS/login/Login';
import CmsProductos from './screens/CMS/productos/Productos'; // ← NUEVO
import { useEffect } from 'react';

const contactos: WhatsAppContact[] = [
  { label: "Ventas", phone: "56951992909", defaultMessage: "¡Hola, equipo de Ventas! Necesito información comercial 😊", accentColor: "#25D366" },
  { label: "Ventas Técnicas", phone: "56982298903", defaultMessage: "Hola, Ventas Técnicas. Tengo una duda técnica sobre el producto.", accentColor: "#128C7E" },
];

function BodyClassController() {
  const { pathname } = useLocation();
  useEffect(() => {
    const isCMS = pathname.startsWith('/cms');
    document.body.classList.toggle('cms-mode', isCMS);
    return () => document.body.classList.remove('cms-mode');
  }, [pathname]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  const showWidget = !pathname.startsWith('/cms');

  return (
    <>
      <BodyClassController />
      <Routes>
        {/* Sitio público */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="representaciones" element={<Representacion />} />
          <Route path="distribuciones" element={<Distribuciones />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="productos" element={<Productos />} />
          <Route path="productos/:product_code" element={<ProductDetail />} />
          <Route path="cotizado" element={<Cotizado />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* CMS */}
        <Route path="/cms/login" element={<CmsLogin />} />
        <Route path="/cms/productos" element={<CmsProductos />} />
      </Routes>

      {showWidget && (
        <WhatsAppWidget
          title="¿Con quién quieres hablar?"
          subtitle="Elige el canal adecuado para ayudarte mejor"
          contacts={contactos}
          position="bottom-right"
          autoOpenDelay={0}
          tooltip="Escríbenos por WhatsApp"
          zIndex={60}
        />
      )}
    </>
  );
}

export default App;

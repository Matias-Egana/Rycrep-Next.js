// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Screens (asegúrate de que los nombres de archivo coincidan en mayúsculas/minúsculas)
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

// WhatsApp widget (del componente que te pasé)
import WhatsAppWidget from './components/layout/WhatsAppWidget/WhatsAppWidget';

function App() {
  return (
    <>
      <Routes>
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
      </Routes>

      {/* Widget flotante global */}
      <WhatsAppWidget
        phone={import.meta.env.VITE_WHATSAPP_NUMBER || '56912345678'}
        defaultMessage="¡Hola! Vengo desde la web y me interesa una cotización 😀"
        position="bottom-right"
        autoOpenDelay={3000}
        ctaLabel="Enviar mensaje"
        title="RYCREP Ventas"
        subtitle="Suele responder en minutos"
        accentColor="#25D366"
        tooltip="Chatea con nosotros"
        zIndex={1000}
      />
    </>
  );
}

export default App;

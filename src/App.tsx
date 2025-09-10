// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Inicio from './screens/inicio/Inicio';
import Nosotros from './screens/nosotros/Nosotros';
import Servicios from './screens/servicios/servicios';
import Productos from './screens/productos/ProductList'; 
import ProductDetail from './screens/productos/ProductDetail';
import Representacion from './screens/representacion/representacion';
import Contacto from './screens/contacto/Contacto';
import NotFound from './screens/NotFound';
import Distribuciones from './screens/distribuciones/Distribuciones';
import Cotizado from './screens/cotizado/Cotizado';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path='nosotros' element={<Nosotros />} />
        <Route path='representaciones' element={<Representacion />} />
        <Route path='distribuciones' element={<Distribuciones />} />
        <Route path='contacto' element={<Contacto />} />
        <Route path='servicios' element={<Servicios />} />
        <Route path='productos' element={<Productos />} />
        <Route path='productos/:product_code' element={<ProductDetail />} />
        <Route path='cotizado' element={<Cotizado />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Inicio from './screens/inicio/Inicio';
import Nosotros from './screens/nosotros/Nosotros';
import Contacto from './screens/contacto/Contacto';
import NotFound from './screens/NotFound';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path='nosotros' element={<Nosotros />} />
        <Route path='contacto' element={<Contacto />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

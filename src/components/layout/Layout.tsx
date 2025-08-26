import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';
import logo from'../../assets/inicio/ric-logo.svg'
const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rc-link ${isActive ? 'is-active' : ''}`;

  return (
    <header className="rc-navbar" role="banner">
      <div className="rc-container">
        <div className="rc-left">
          <Link to="/" className="rc-brand" onClick={closeMenu} aria-label="Ir al inicio">
                <img src={logo} alt="R&C Representaciones" className="rc-logo-img" />
          </Link>

          <nav className={`rc-nav ${open ? 'is-open' : ''}`} aria-label="Principal">
            <ul className="rc-menu" onClick={closeMenu}>
              <li><NavLink to="/" end className={linkClass}>Inicio</NavLink></li>
              <li><NavLink to="/nosotros" className={linkClass}>Nosotros</NavLink></li>
              <li><NavLink to="/representaciones" className={linkClass}>Representaciones</NavLink></li>
              <li><NavLink to="/servicios" className={linkClass}>Servicios</NavLink></li>
              <li><NavLink to="/productos" className={linkClass}>Productos</NavLink></li>
              <li><NavLink to="/contacto" className={linkClass}>Contacto</NavLink></li>
            </ul>
          </nav>
        </div>

        <div className="rc-right">
          <NavLink to="/cotizado" className="rc-btn-cta" onClick={closeMenu}>
            Cotiza Ahora
          </NavLink>

          <button
            className={`rc-burger ${open ? 'is-open' : ''}`}
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

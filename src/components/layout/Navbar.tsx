import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';
import logo from '../../assets/inicio/ric-logo.svg';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
    setDropdownOpen(false);
  };

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
            <ul className="rc-menu">
              <li><NavLink to="/" end className={linkClass} onClick={closeMenu}>Inicio</NavLink></li>
              <li><NavLink to="/nosotros" className={linkClass} onClick={closeMenu}>Nosotros</NavLink></li>
              <li><NavLink to="/representaciones" className={linkClass} onClick={closeMenu}>Representaciones</NavLink></li>
              <li><NavLink to="/distribuciones" className={linkClass} onClick={closeMenu}>Distribuciones</NavLink></li>

              <li><NavLink to="/servicios" className={linkClass} onClick={closeMenu}>Servicios</NavLink></li>

              {/* Dropdown Productos */}
              <li className={`rc-dropdown ${dropdownOpen ? 'is-open' : ''}`}>
                <NavLink
                  to="/productos"
                  className={linkClass}
                  onClick={closeMenu} // cierra menú y redirige
                >
                  Productos
                </NavLink>

                {/* Flecha para mobile */}
                <span
                  className={`rc-arrow ${dropdownOpen ? 'is-open' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                  ▾
                </span>

                <ul className={`rc-submenu ${dropdownOpen ? 'is-open' : ''}`}>
                  <li><NavLink to="/productos/Alternadores" className={linkClass} onClick={closeMenu}>Alternadores</NavLink></li>
                  <li><NavLink to="/productos/Motores" className={linkClass} onClick={closeMenu}>Motores</NavLink></li>
                  <li><NavLink to="/productos/Baterias" className={linkClass} onClick={closeMenu}>Baterias</NavLink></li>
                  <li><NavLink to="/productos/fusibles" className={linkClass} onClick={closeMenu}>Fusibles</NavLink></li>
                  <li><NavLink to="/productos/Seguridad" className={linkClass} onClick={closeMenu}>Artículos de seguridad</NavLink></li>
                  <li><NavLink to="/productos/Motores" className={linkClass} onClick={closeMenu}>Faroles y luminarias</NavLink></li>
                </ul>
              </li>

              <li><NavLink to="/contacto" className={linkClass} onClick={closeMenu}>Contacto</NavLink></li>
            </ul>
          </nav>
        </div>

        <div className="rc-right">
          <NavLink to="/cotizado" className="rc-btn-cta" onClick={closeMenu}>Cotiza Ahora</NavLink>

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

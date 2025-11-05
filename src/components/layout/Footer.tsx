import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import seals from'../../assets/Certificaciones/certificaciones.png'
/**
 * TODO: Si tienes tu imagen de sellos, descomenta e importa:
 * import seals from '../../assets/sellos-certificaciones.png';
 * y reemplaza <SealsPlaceholder /> por:
 * <img src={seals} alt="Sellos de certificación" className="rc-seals-img" />
 */

// Placeholder SVG de 4 sellos tipo “IRAM”
  <svg
    className="rc-seals-img"
    viewBox="0 0 240 54"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Sellos de certificación (placeholder)"
  >
    <defs>
      <linearGradient id="g1" x1="0" x2="1">
        <stop offset="0" stopColor="#6be3ff" />
        <stop offset="1" stopColor="#6b7bff" />
      </linearGradient>
      <linearGradient id="g2" x1="0" x2="1">
        <stop offset="0" stopColor="#a74bff" />
        <stop offset="1" stopColor="#35c2ff" />
      </linearGradient>
    </defs>
    {/** cuatro “sellos” */}
    <g transform="translate(4,4)">
      <rect width="52" height="46" rx="2" fill="url(#g1)" stroke="#fff" />
      <circle cx="26" cy="23" r="14" fill="none" stroke="#fff" strokeWidth="2" />
      <text x="26" y="28" textAnchor="middle" fontFamily="Montserrat,Arial" fontSize="10" fill="#fff" fontWeight="700">IRAM</text>
    </g>
    <g transform="translate(64,4)">
      <rect width="52" height="46" rx="2" fill="#6b2b2b" stroke="#fff" />
      <circle cx="26" cy="23" r="14" fill="none" stroke="#fff" strokeWidth="2" />
      <text x="26" y="28" textAnchor="middle" fontFamily="Montserrat,Arial" fontSize="10" fill="#fff" fontWeight="700">I-Net</text>
    </g>
    <g transform="translate(124,4)">
      <rect width="52" height="46" rx="2" fill="url(#g2)" stroke="#fff" />
      <circle cx="26" cy="23" r="14" fill="none" stroke="#fff" strokeWidth="2" />
      <text x="26" y="28" textAnchor="middle" fontFamily="Montserrat,Arial" fontSize="10" fill="#fff" fontWeight="700">IRAM</text>
    </g>
    <g transform="translate(184,4)">
      <rect width="52" height="46" rx="2" fill="url(#g1)" stroke="#fff" />
      <circle cx="26" cy="23" r="14" fill="none" stroke="#fff" strokeWidth="2" />
      <text x="26" y="28" textAnchor="middle" fontFamily="Montserrat,Arial" fontSize="10" fill="#fff" fontWeight="700">IRAM</text>
    </g>
  </svg>

const Footer: React.FC = () => {
  return (
    <footer className="rc-footer">
      <div className="rc-footer__container">
        {/* Columna izquierda: Sellos */}
        <div className="rc-footer__left">
          <img src={seals} alt="Certificaciones" className="rc-seals-img" />
        </div>

        {/* Columna centro: Dirección y teléfono */}
        <div className="rc-footer__center" aria-label="Dirección y teléfono">
          <p className="rc-address">
            <span>El Oro&nbsp;7956 Barrio Industrial,</span>
            <span>Antofagasta</span>
          </p>
          <a href="tel:+56951992909" className="rc-phone">+56 9 5199 2909</a>
        </div>

        {/* Columna derecha: Redes y CTA contacto */}
        <div className="rc-footer__right">
          <p className="rc-follow">Síguenos</p>

          <div className="rc-social">
            <a
              className="rc-social__item rc-social--in"
              href="https://www.linkedin.com/company/rycrep/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              {/* Ícono LinkedIn */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zm7 0h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05C20.4 8.45 23 10.7 23 15v8h-4v-7c0-1.67-.03-3.82-2.33-3.82-2.34 0-2.7 1.83-2.7 3.7V23h-4V8.5z"
                />
              </svg>
            </a>

            <a
              className="rc-social__item rc-social--ig"
              href="https://www.instagram.com/rycrepresentacionesyservicios"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              {/* Ícono Instagram (cámara simple) */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <radialGradient id="igGrad" cx="65%" cy="35%" r="95%">
                    <stop offset="0%" stopColor="#FFDC80" />
                    <stop offset="35%" stopColor="#FCAF45" />
                    <stop offset="60%" stopColor="#F56040" />
                    <stop offset="80%" stopColor="#E1306C" />
                    <stop offset="100%" stopColor="#5851DB" />
                  </radialGradient>
                </defs>
                <rect width="24" height="24" rx="6" fill="url(#igGrad)" />
                <circle cx="12" cy="12" r="4.2" fill="#fff" />
                <circle cx="17.2" cy="6.8" r="1.4" fill="#fff" />
              </svg>
            </a>

            <a
              className="rc-social__item rc-social--fb"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              {/* Ícono Facebook */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06C2 17.07 5.66 21.2 10.44 22v-7.03H7.9v-2.91h2.54v-2.2c0-2.5 1.49-3.87 3.77-3.87 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.78l-.44 2.91h-2.34V22C18.34 21.2 22 17.07 22 12.06Z"
                />
              </svg>
            </a>
          </div>

          <Link to="/contacto" className="rc-contact-link">
            Contáctanos
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

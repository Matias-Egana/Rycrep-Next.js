import React, { useEffect, useMemo, useRef, useState } from 'react';
import './inicio.css';
import CategoryGrid from '../../components/layout/CategoryGrid';
import Servicios from './servicios';

/* =========================
   ASSETS
========================= */
import komatsuLogo from '../../assets/logos/komatsu.png';
import sqmLogo from '../../assets/logos/sqm.png';
import codelcoLogo from '../../assets/logos/codelco.png';
import bhpLogo from '../../assets/logos/bhp.png';
import amLogo from '../../assets/logos/antofagasta-minerals.png';
import collahuasiLogo from '../../assets/logos/collahuasi.jpg';
import cumminsLogo from '../../assets/logos/cummins.png';
import aesgener from '../../assets/logos/aesgener.png';

import slide1 from '../../assets/hero/Niehoff & Co.png';
import slide2 from '../../assets/hero/slide1.png';
import slide3 from '../../assets/hero/slide2.png';
import slide4 from '../../assets/hero/slide3.png';

/* =========================
   DATA
========================= */
const clientLogos = [
  komatsuLogo,
  sqmLogo,
  codelcoLogo,
  bhpLogo,
  amLogo,
  collahuasiLogo,
  cumminsLogo,
  aesgener
];

const slides = [
  { img: slide1, headline: 'Cotiza nuestros productos originales\n de Niehoff & Co.', sub: '' },
  { img: slide2, headline: 'Mantención y reparación\n de equipo electromecánico', sub: 'Servicios Integrales' },
  { img: slide3, headline: 'Soporte técnico especializado', sub: 'Diagnóstico • Mantenimiento • Reparación' },
  { img: slide4, headline: 'Somos representantes oficiales de Niehoff en Chile', sub: 'Cobertura en el norte de Chile' },
];

/* =========================
   HELPERS
========================= */
const logoFallbackSVG = (name: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="52">
      <rect width="100%" height="100%" rx="6" fill="#ffffff"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Montserrat,Arial" font-size="14" fill="#1b2240">${name}</text>
    </svg>`
  )}`;

/* =========================
   COMPONENT
========================= */
const Inicio: React.FC = () => {
  // Hero carousel
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    timer.current = window.setInterval(() => setIdx(i => (i + 1) % slides.length), 5000);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, []);

  // Logos duplicados para efecto "infinito"
  const track = useMemo(() => [...clientLogos, ...clientLogos], []);

  return (
    <div className="home">
      {/* ================= HERO ================= */}
      <section className="home-hero">
        {slides.map((s, i) => {
          const active = i === idx ? ' is-active' : '';
          const bg = `linear-gradient(0deg, rgba(0,0,0,.55), rgba(0,0,0,.35)), url('${s.img}') center/cover`;
          return (
            <div key={i} className={'hero-slide' + active} style={{ background: bg }}>
              <div className="hero-content">
                <h1 dangerouslySetInnerHTML={{ __html: s.headline.replace(/\n/g, '<br/>') }} />
                <p>{s.sub}</p>
              </div>
            </div>
          );
        })}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={'dot' + (i === idx ? ' is-active' : '')}
              onClick={() => setIdx(i)}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ============== PRODUCTS (CategoryGrid) ============== */}
      <section className="products">
        <div className="container">
          <div className="products-grid">
            <CategoryGrid />
          </div>
        </div>
      </section>

      {/* ============== SERVICIOS (reemplaza FEATURES STRIP) ============== */}
      <section className="services">
        <div className="container">
          <Servicios />
        </div>
      </section>

      {/* ============== LOGOS SLIDER ============== */}
      <section className="logos">
        <div className="confian-title-container">
          <h3>Confían en nosotros</h3>
        </div>
        <div className="logos-viewport">
          <div className="logos-track">
            {track.map((src, i) => (
              <div key={i} className="logo-item">
                <img
                  src={src}
                  alt="Logo cliente"
                  onError={e => {
                    const name = src.split('/').pop()?.replace(/\.(png|svg|jpg|jpeg)$/i, '') ?? 'Cliente';
                    e.currentTarget.src = logoFallbackSVG(name);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;

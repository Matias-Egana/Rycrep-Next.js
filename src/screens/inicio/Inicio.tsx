import React, { useEffect, useMemo, useRef, useState } from 'react';
import './inicio.css';
/* =========================================================
   IMPORTAR LOGOS DESDE src/assets
   ======================================================= */
import komatsuLogo from '../../assets/logos/komatsu.png';
import sqmLogo from '../../assets/logos/sqm.png';
import codelcoLogo from '../../assets/logos/codelco.png';
import bhpLogo from '../../assets/logos/bhp.png';
import amLogo from '../../assets/logos/antofagasta-minerals.png';
import collahuasiLogo from '../../assets/logos/collahuasi.jpg';
import cumminsLogo from '../../assets/logos/cummins.png';
import slide1 from "../../assets/hero/Niehoff & Co.png";
import slide2 from "../../assets/hero/slide1.png";
import slide3 from "../../assets/hero/slide2.png";
import slide4 from "../../assets/hero/slide3.png";
import CategoryGrid from '../../components/layout/CategoryGrid';
import { useNavigate } from 'react-router-dom';

const clientLogos = [
  komatsuLogo,
  sqmLogo,
  codelcoLogo,
  bhpLogo,
  amLogo,
  collahuasiLogo,
  cumminsLogo,
];

/* =========================================================
   SLIDES DEL HERO
   ======================================================= */
const slides = [
  { img: slide1, headline: 'Cotiza nuestros productos originales\n de Niehoff & Co.', sub: '' },
  { img: slide2, headline: 'Mantención y reparación\n de equipo electromecánico', sub: 'Servicios Integrales' },
  { img: slide3, headline: 'Soporte técnico especializado', sub: 'Diagnóstico • Mantenimiento • Reparación' },
  { img: slide4, headline: 'Somos representantes oficiales de Niehoff en Chile', sub: 'Cobertura en el norte de Chile' },
];

/* =========================================================
   FEATURES
   ======================================================= */
type Feature = { title: string; icon: 'bolt' | 'probe' | 'helmet' | 'tools' };
const features: Feature[] = [
  { title: 'SERVICIO OFICIAL', icon: 'bolt' },
  { title: 'DIAGNOSTICO', icon: 'probe' },
  { title: 'MANTENIMIENTO', icon: 'helmet' },
  { title: 'REPARACIÓN', icon: 'tools' },
];

/* =========================================================
   PRODUCTOS
   ======================================================= */
type Product = { title: string; img: string };
const products: Product[] = [
  { title: 'Baterías', img: '/assets/productos/bateria.png' },
  { title: 'Alternadores y motores de partida', img: '/assets/productos/alternador.png' },
  { title: 'Fusibles', img: '/assets/productos/fusible.png' },
  { title: 'Luces y accesorios de seguridad', img: '/assets/productos/luces.png' },
];

/* =========================================================
   ICONOS INLINE
   ======================================================= */
const Icon: React.FC<{ name: Feature['icon'] }> = ({ name }) => {
  const common = { width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 };
  switch (name) {
    case 'bolt': return <svg {...common}><path d="M13 2L3 14h6l-1 8 10-12h-6l1-8z" fill="currentColor" stroke="none" /></svg>;
    case 'probe': return <svg {...common}><rect x="3" y="3" width="6" height="10" rx="1.5" stroke="currentColor" /><rect x="15" y="3" width="6" height="10" rx="1.5" stroke="currentColor" /><path d="M6 13v6M18 13v6M6 19h12" /></svg>;
    case 'helmet': return <svg {...common}><path d="M4 13a8 8 0 0116 0v2H4v-2z" /><path d="M10 7v6M14 7v6" /><path d="M3 17h18" /></svg>;
    case 'tools': return <svg {...common}><path d="M2 7l4 4m3-7l11 11M14 2l8 8" /><path d="M7 2l3 3-2 2L5 4 7 2zM16 13l3 3-2 2-3-3 2-2z" /></svg>;
  }
};

/* =========================================================
   HERO CAROUSEL
   ======================================================= */
const HeroCarousel: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(() => setIdx(i => (i + 1) % slides.length), 5000);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, []);

  return (
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
          />
        ))}
      </div>
    </section>
  );
};

/* =========================================================
   FEATURES STRIP
   ======================================================= */
const FeaturesStrip: React.FC = () => {
  const navigate = useNavigate(); // ✅ Hook al nivel superior del componente

  const handleClick = (feature: string) => {
    if (feature === 'SERVICIO OFICIAL') {
      navigate('/servicios'); // ruta a la que quieres ir
    }
    // Puedes agregar más rutas para otros servicios si quieres
  };

  return (
    <section className="features-strip">
      <div className="container">
        <h2 className="features-title">Nuestros Servicios</h2>
        <ul className="features-grid">
          {features.map(f => (
            <li
              key={f.title}
              className="feature-card"
              onClick={() => handleClick(f.title)}
              style={{ cursor: 'pointer' }}
            >
              <span className="feature-icon"><Icon name={f.icon} /></span>
              <span className="feature-title">{f.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* =========================================================
   PRODUCTS SHOWCASE
   ======================================================= */
const ProductCard: React.FC<Product> = ({ img, title }) => {
  const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
       <rect width="100%" height="100%" fill="#f3f5f9"/>
       <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
             font-family="Montserrat,Arial" font-size="16" fill="#a0a6b0">Imagen de ${title}</text>
     </svg>`
  )}`;
  return (
    <article className="product-card">
      <img src={img} onError={e => (e.currentTarget.src = fallback)} alt={title} />
      <h3>{title}</h3>
    </article>
  );
};

const ProductsShowcase: React.FC = () => (
  <section className="products">
    <div className="container">
      <div className="products-grid">
        <CategoryGrid/>
      </div>
    </div>
  </section>
);

/* =========================================================
   LOGOS SLIDER
   ======================================================= */
const LogosSlider: React.FC = () => {
  const track = useMemo(() => [...clientLogos, ...clientLogos], []);
  return (
    <section className="logos">
      <div className="container">
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
                  const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="52">
                      <rect width="100%" height="100%" rx="6" fill="#ffffff"/>
                      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                            font-family="Montserrat,Arial" font-size="14" fill="#1b2240">${name}</text>
                    </svg>`
                  )}`;
                  e.currentTarget.src = fallback;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   PÁGINA DE INICIO
   ======================================================= */
const Inicio: React.FC = () => (
  <div className="home">
    <HeroCarousel />
    <ProductsShowcase />
    <FeaturesStrip />
    <LogosSlider />
  </div>
);

export default Inicio;

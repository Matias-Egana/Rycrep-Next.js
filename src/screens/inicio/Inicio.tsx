import React, { useEffect, useMemo, useRef, useState } from 'react';
import './inicio.css';

/* =========================================================
   DATA (cámbiala cuando tengas recursos reales)
   =======================================================*/

// TODO: Reemplaza estos paths por tus imágenes reales dentro de /src/assets/...
const slides = [
  {
    img: '/assets/hero/slide1.jpg', // excavadoras / obra
    headline: 'Mantención y reparación\n de equipo electromecánico',
    sub: 'Servicios Integrales',
  },
  {
    img: '/assets/hero/slide2.jpg',
    headline: 'Soporte técnico especializado',
    sub: 'Diagnóstico • Mantenimiento • Reparación',
  },
  {
    img: '/assets/hero/slide3.jpg',
    headline: 'Calidad y rapidez en terreno',
    sub: 'Cobertura en el norte de Chile',
  },
];

type Feature = { title: string; icon: 'bolt' | 'probe' | 'helmet' | 'tools' };
const features: Feature[] = [
  { title: 'SERVICIO OFICIAL', icon: 'bolt' },
  { title: 'DIAGNOSTICO', icon: 'probe' },
  { title: 'MANTENIMIENTO', icon: 'helmet' },
  { title: 'REPARACIÓN', icon: 'tools' },
];

type Product = { title: string; img: string };
const products: Product[] = [
  { title: 'Baterías', img: '/assets/productos/bateria.png' },
  { title: 'Alternadores y motores de partida', img: '/assets/productos/alternador.png' },
  { title: 'Fusibles', img: '/assets/productos/fusible.png' },
  { title: 'Luces y accesorios de seguridad', img: '/assets/productos/luces.png' },
];

// TODO: Reemplazar por logos reales (PNG/SVG) en /assets/logos/
const clientLogos: string[] = [
  '/assets/logos/komatsu.png',
  '/assets/logos/sqm.png',
  '/assets/logos/codelco.png',
  '/assets/logos/bhp.png',
  '/assets/logos/antofagasta-minerals.png',
  '/assets/logos/collahuasi.png',
  '/assets/logos/cummins.png',
];

/* =========================================================
   ICONOS (SVG inline para que no dependas de librerías)
   =======================================================*/
const Icon: React.FC<{ name: Feature['icon'] }> = ({ name }) => {
  const common = { width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 };
  switch (name) {
    case 'bolt':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M13 2L3 14h6l-1 8 10-12h-6l1-8z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'probe':
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="3" width="6" height="10" rx="1.5" stroke="currentColor" />
          <rect x="15" y="3" width="6" height="10" rx="1.5" stroke="currentColor" />
          <path d="M6 13v6M18 13v6M6 19h12" />
        </svg>
      );
    case 'helmet':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 13a8 8 0 0116 0v2H4v-2z" />
          <path d="M10 7v6M14 7v6" />
          <path d="M3 17h18" />
        </svg>
      );
    case 'tools':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M2 7l4 4m3-7l11 11M14 2l8 8" />
          <path d="M7 2l3 3-2 2L5 4 7 2zM16 13l3 3-2 2-3-3 2-2z" />
        </svg>
      );
  }
};

/* =========================================================
   HERO CAROUSEL (auto-play + fade)
   =======================================================*/
const HeroCarousel: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 5000);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, []);

  return (
    <section className="home-hero" aria-label="Carrusel principal">
      {slides.map((s, i) => {
        const active = i === idx ? ' is-active' : '';
        // Si no existe la imagen, igual dejamos un degradado azul-oscuro
        const bg = `linear-gradient(0deg, rgba(0,0,0,.55), rgba(0,0,0,.35)), url('${s.img}') center/cover, linear-gradient(90deg,#24304f,#1a2240)`;
        return (
          <div key={i} className={'hero-slide' + active} style={{ background: bg }}>
            <div className="hero-content">
              <h1 dangerouslySetInnerHTML={{ __html: s.headline.replace(/\n/g, '<br/>') }} />
              <p>{s.sub}</p>
            </div>
          </div>
        );
      })}

      <div className="hero-dots" role="tablist" aria-label="Selector de diapositiva">
        {slides.map((_, i) => (
          <button
            key={i}
            className={'dot' + (i === idx ? ' is-active' : '')}
            onClick={() => setIdx(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

/* =========================================================
   STRIP DE SERVICIOS (franja azul con tiles rojos)
   =======================================================*/
const FeaturesStrip: React.FC = () => {
  return (
    <section className="features-strip" aria-label="Servicios">
      <div className="container">
        <ul className="features-grid">
          {features.map((f) => (
            <li key={f.title} className="feature-card">
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
   PRODUCTOS (grid)
   =======================================================*/
const ProductCard: React.FC<Product> = ({ img, title }) => {
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
        <rect width="100%" height="100%" fill="#f3f5f9"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="Montserrat,Arial" font-size="16" fill="#a0a6b0">Imagen de ${title}</text>
      </svg>`
    );
  return (
    <article className="product-card">
      {/* Reemplaza src por tu imagen real; el fallback mantiene la caja visual */}
      <img src={img} onError={(e) => ((e.currentTarget.src = fallback))} alt={title} />
      <h3>{title}</h3>
    </article>
  );
};

const ProductsShowcase: React.FC = () => (
  <section className="products" aria-labelledby="productos-title">
    <div className="container">
      <h2 id="productos-title">Productos</h2>
      <div className="products-grid">
        {products.map((p) => <ProductCard key={p.title} {...p} />)}
      </div>
    </div>
  </section>
);

/* =========================================================
   LOGOS SLIDER (loop infinito)
   =======================================================*/
const LogosSlider: React.FC = () => {
  // duplicamos lista para el efecto infinito
  const track = useMemo(() => [...clientLogos, ...clientLogos], []);
  return (
    <section className="logos" aria-labelledby="logos-title">
      <div className="container">
        <h3 id="logos-title">Confían en nosotros</h3>
      </div>

      <div className="logos-viewport">
        <div className="logos-track">
          {track.map((src, i) => (
            <div className="logo-item" key={i}>
              {/* Si no hay PNG del logo, mostramos un placeholder con el nombre del archivo */}
              <img
                src={src}
                alt="Logo cliente"
                onError={(e) => {
                  const name = src.split('/').pop()?.replace(/\.(png|svg|jpg|jpeg)$/, '') ?? 'Cliente';
                  const fallback =
                    'data:image/svg+xml;utf8,' +
                    encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="52">
                        <rect width="100%" height="100%" rx="6" fill="#ffffff"/>
                        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                              font-family="Montserrat,Arial" font-size="14" fill="#1b2240">${name}</text>
                      </svg>`
                    );
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
   =======================================================*/
const Inicio: React.FC = () => {
  return (
    <div className="home">
      <HeroCarousel />
      <FeaturesStrip />
      <ProductsShowcase />
      <LogosSlider />
    </div>
  );
};

export default Inicio;

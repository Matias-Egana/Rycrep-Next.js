import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import './inicio.css';
import { useNavigate } from 'react-router-dom';
import CategoryGrid from '../../components/layout/CategoryGrid';

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

type Feature = { title: string; icon: 'bolt' | 'probe' | 'helmet' | 'tools' };
const features: Feature[] = [
  { title: 'SERVICIO OFICIAL', icon: 'bolt' },
  { title: 'DIAGNOSTICO', icon: 'probe' },
  { title: 'MANTENIMIENTO', icon: 'helmet' },
  { title: 'REPARACIÓN', icon: 'tools' },
];

/* =========================
   HELPERS
========================= */
const renderIcon = (name: Feature['icon']) => {
  const common = { width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 } as const;
  switch (name) {
    case 'bolt':   return <svg {...common}><path d="M13 2L3 14h6l-1 8 10-12h-6l1-8z" fill="currentColor" stroke="none" /></svg>;
    case 'probe':  return <svg {...common}><rect x="3" y="3" width="6" height="10" rx="1.5"/><rect x="15" y="3" width="6" height="10" rx="1.5"/><path d="M6 13v6M18 13v6M6 19h12"/></svg>;
    case 'helmet': return <svg {...common}><path d="M4 13a8 8 0 0116 0v2H4v-2z"/><path d="M10 7v6M14 7v6"/><path d="M3 17h18"/></svg>;
    case 'tools':  return <svg {...common}><path d="M2 7l4 4m3-7l11 11M14 2l8 8"/><path d="M7 2l3 3-2 2L5 4 7 2zM16 13l3 3-2 2-3-3 2-2z"/></svg>;
  }
};

const logoFallbackSVG = (name: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="52">
      <rect width="100%" height="100%" rx="6" fill="#ffffff"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Montserrat,Arial" font-size="14" fill="#1b2240">${name}</text>
    </svg>`
  )}`;

/* =========================
   POPOVER (portal al body)
========================= */
type Placement = 'bottom'; // simplificado: siempre abajo

const FeaturePopover: React.FC<{
  open: boolean;
  anchorEl: HTMLElement | null;
  children: React.ReactNode;
}> = ({ open, anchorEl, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });

  const computeAndSetPosition = React.useCallback(() => {
    if (!open || !anchorEl || !ref.current) return;
    const pop = ref.current;

    // Primero, movemos offscreen para medir tamaño real
    const prevTop = pop.style.top;
    const prevLeft = pop.style.left;
    pop.style.top = `-10000px`;
    pop.style.left = `-10000px`;

    const pr = pop.getBoundingClientRect();
    const ar = anchorEl.getBoundingClientRect();
    const vw = window.innerWidth;

    const GAP = 12;
    const top = Math.round(ar.bottom + GAP); // bottom placement
    let left = Math.round(ar.left + ar.width / 2 - pr.width / 2);
    left = Math.max(8, Math.min(left, vw - pr.width - 8)); // clamp a viewport

    // Restauramos (serán sobrescritos por el style con estado)
    pop.style.top = prevTop;
    pop.style.left = prevLeft;

    setPos({ top, left });
  }, [open, anchorEl]);

  useLayoutEffect(() => {
    if (!open) return;
    // Posicionar en el primer render "abierto"
    computeAndSetPosition();
  }, [open, anchorEl, children, computeAndSetPosition]);

  useEffect(() => {
    if (!open) return;
    // Reposicionar en resize/scroll (captura para detectar scroll en contenedores)
    const handler = () => computeAndSetPosition();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true as any);
    };
  }, [open, computeAndSetPosition]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div
      ref={ref}
      className="fp-popover fp-show"
      style={{ top: pos.top, left: pos.left }}
      role="dialog"
      aria-live="polite"
    >
      {children}
    </div>,
    document.body
  );
};


/* =========================
   CONTENIDO DE POPOVER
========================= */
const getFeatureContent = (title: string) => {
  switch (title) {
    case 'SERVICIO OFICIAL':
      return (
        <div>
          <p className="fp-p">
            <strong>Overhaul</strong>, <strong>predictiva</strong> y <strong>preventiva</strong>.
            Pruebas en banco, ajustes, calibraciones e informe técnico.
          </p>
          <ul className="fp-list">
            <li>Revisión de aislamiento y conexiones</li>
            <li>Recambio de piezas críticas</li>
            <li>Recomendaciones operacionales</li>
          </ul>
        </div>
      );

    case 'DIAGNOSTICO':
      return (
        <div>
          <p className="fp-p">
            <strong>Diagnóstico integral</strong> de sistemas electrónicos, eléctricos y
            electromecánicos: lectura de fallas, pruebas y verificación de funcionamiento.
          </p>
          <ul className="fp-list">
            <li>SCADA/PLC/HMI &amp; tarjetas electrónicas</li>
            <li>Tableros, redes BT y subestaciones</li>
            <li>Motores, alternadores y arranque</li>
          </ul>
          <p className="fp-note">Entregamos reporte con hallazgos y plan de acción.</p>
        </div>
      );

    case 'MANTENIMIENTO':
      return (
        <div>
          <p className="fp-p">
            Ejecutamos <strong>mantenimiento/overhaul</strong> a partir del <strong>diagnóstico</strong>:
            planes preventivos/correctivos, limpieza, ajuste, recambio y pruebas.
          </p>
          <p className="fp-note">Puede derivar en <strong>mantenimiento y/o reparación</strong>.</p>
        </div>
      );

    case 'REPARACIÓN':
      return (
        <div>
          <p className="fp-p">
            <strong>Reparación</strong> basada en diagnóstico: alternadores, motores de partida,
            tableros y tarjetas electrónicas. Calibración y pruebas finales con garantía.
          </p>
          <p className="fp-note">Aplicamos lo más conveniente: <strong>mantenimiento y/o reparación</strong>.</p>
        </div>
      );
  }
  return null;
};

/* =========================
   COMPONENT
========================= */
const Inicio: React.FC = () => {
  const navigate = useNavigate();

  // Hero carousel
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    timer.current = window.setInterval(() => setIdx(i => (i + 1) % slides.length), 5000);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, []);

  // Logos duplicados para efecto "infinito"
  const track = useMemo(() => [...clientLogos, ...clientLogos], []);

  // Popover state
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<React.ReactNode>(null);

  const gridRef = useRef<HTMLUListElement>(null);

  const openPopover = (title: string, el: HTMLElement) => {
    setContent(getFeatureContent(title));
    setAnchorEl(el);
    setOpen(true);
  };
  const closePopover = () => setOpen(false);

  // Clicks en features
  const handleFeatureClick = (featureTitle: string) => {
    if (featureTitle === 'SERVICIO OFICIAL') navigate('/servicios');
  };

  // Cerrar si se presiona Escape mientras está sobre el grid
  const onGridKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closePopover();
  };

  // Cerrar cuando el mouse sale del grid completo (no entre hijos)
  const onGridMouseLeave = () => closePopover();

  // Cerrar cuando el foco sale del grid (no entre hijos)
  const onGridBlur = (e: React.FocusEvent<HTMLUListElement>) => {
    const next = e.relatedTarget as Node | null;
    if (!next || !gridRef.current?.contains(next)) {
      closePopover();
    }
  };

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

      {/* ============== FEATURES STRIP ============== */}
      <section className="features-strip">
        <div className="container">
          <h2 className="features-title">Nuestros Servicios</h2>
          <ul
            className="features-grid"
            ref={gridRef}
            onMouseLeave={onGridMouseLeave}
            onBlur={onGridBlur}
            onKeyDown={onGridKeyDown}
          >
            {features.map(f => (
              <li
                key={f.title}
                className="feature-card"
                onClick={() => handleFeatureClick(f.title)}
                onMouseEnter={(e) => openPopover(f.title, e.currentTarget as HTMLElement)}
                onFocus={(e) => openPopover(f.title, e.currentTarget as HTMLElement)}
                aria-label={`Ir a ${f.title}`}
                role="group"
                tabIndex={0}
              >
                <span className="feature-icon">{renderIcon(f.icon)}</span>
                <span className="feature-title">{f.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Popover flotante (portal al body) */}
      <FeaturePopover open={open} anchorEl={anchorEl}>
        {content}
      </FeaturePopover>

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

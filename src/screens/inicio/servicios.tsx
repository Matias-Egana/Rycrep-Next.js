import React, { useMemo, useState } from "react";

/**
 * RycrepServices.jsx
 * Componente estético e interactivo para mostrar el portafolio de servicios de Rycrep.
 * - Búsqueda por texto
 * - Filtros por etiquetas
 * - Navegación por categorías
 * - Acordeones expandibles con bullets
 * - CTA de contacto (WhatsApp/Email)
 *
 * Uso:
 * <RycrepServices phoneWhatsApp="56912345678" email="contacto@rycrep.cl" companyName="Rycrep" />
 */

const PALETTE = {
  bg: "#0B1615",
  card: "#0F2220",
  muted: "#7AA69A",
  border: "#1F3935",
  green: "#1AA77A",
  greenDark: "#0D6A51",
  amber: "#E9B15F",
  light: "#EAF4F1",
};

const SERVICES = [
  {
    id: "carga-arranque",
    title: "Carga y Arranque",
    subtitle: "\nAlternadores y Motores de Partida (12–24 V)",
    tags: ["eléctrico", "minería", "taller", "overhaul"],
    bullets: [
      "Diagnóstico, reparación, mantención y overhaul de alternadores.",
      "Diagnóstico, reparación, mantención y overhaul de motores de partida eléctricos.",
      "Limpieza por ultrasonido, reemplazo de rodamientos/bujes, rectificado de colectores.",
      "Trazabilidad de pruebas e informe técnico de entrega.",
    ],
  },
  {
    id: "equipos-apoyo",
    title: "Equipos Autónomos/Estacionarios",
    subtitle: "\nGeneradores, Torres de Iluminación y Soldadoras",
    tags: ["mecánica diésel", "eléctrico", "overhaul", "mantención"],
    bullets: [
      "Mantenimiento preventivo/correctivo y overhaul de grupos electrógenos.",
      "Mantención integral de torres de iluminación (motor, alternador, tablero, luminarias).",
      "Servicio para soldadoras autónomas y eléctricas (rectificadores, excitación, tableros).",
      "Protocolos de prueba funcional y entrega con checklist.",
    ],
  },
  {
    id: "electronica-industrial",
    title: "Electrónica Industrial y de Potencia",
    subtitle: "\nTarjetas, Fuentes, Módulos Inteligentes, HMI/SCADA/DCS",
    tags: ["electrónica", "SCADA", "HMI", "I+D"],
    bullets: [
      "Reparación y diseño de tarjetas electrónicas industriales (control y potencia).",
      "Diseño/implementación de SCADA y DCS; integración de sensores, transductores y actuadores.",
      "HMI: PanelView/PC industriales tipo TFT/LCD.",
      "Diseño y construcción de fuentes de poder y módulos inteligentes.",
      "Simulación y ensayo previo a puesta en servicio.",
    ],
  },
  {
    id: "laboratorio-diesel",
    title: "Laboratorio Diésel (Inyección)",
    subtitle: "\nBombas e Inyectores Bosch, Denso, Siemens, Delphi – incl. Common Rail",
    tags: ["diésel", "inyección", "banco de prueba", "ultrasonido"],
    bullets: [
      "Diagnóstico y calibración de bombas/inyectores rotativos y Common Rail.",
      "Extracción especializada de inyectores y limpieza por ultrasonido.",
      "Calibración en banco y ajuste de parámetros de fábrica.",
      "Scanner automotriz/industrial para lectura y borrado de fallas.",
    ],
  },
  {
    id: "electrico-industrial",
    title: "Servicio Eléctrico Industrial",
    subtitle: "\nSubestaciones – Alta y Baja Tensión",
    tags: ["industrial", "eléctrico", "subestaciones"],
    bullets: [
      "Mantención preventiva y correctiva de subestaciones eléctricas.",
      "Inspecciones, termografías y pruebas de funcionamiento.",
      "Gestión documental y protocolos de seguridad.",
    ],
  },
  {
    id: "mecanica-diesel",
    title: "Mecánica Diésel Aplicada",
    subtitle: "\nMotores de distintos fabricantes según equipo atendido",
    tags: ["diésel", "mecánica", "generadores", "soldadoras"],
    bullets: [
      "Reparación y mantención de motores diésel ligados a generadores, torres y soldadoras.",
      "Cambio de periféricos, ajuste de parámetros y pruebas de carga.",
    ],
  },
  {
    id: "modalidades",
    title: "Modalidades y Entregables",
    subtitle: "\nPreventivo, Correctivo y Overhaul + Logística",
    tags: ["QA", "logística", "trazabilidad"],
    bullets: [
      "Programas de mantenimiento preventivo y correctivo.",
      "Overhaul completo con checklist de fábrica.",
      "Informes técnicos, fotos y curvas de prueba.",
      "Abastecimiento y despacho a todo Chile cuando aplica.",
    ],
  },
];

const EXCLUSIONES = [
  "Motores de partida neumáticos (Ingersoll Rand)",
  "Mantención integral de maquinaria pesada de mina (palas, camiones de extracción y flota completa)",
];

function useTagUniverse() {
  return useMemo(() => {
    const set = new Set<string>();
    SERVICES.forEach((s) => s.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);
}

export default function RycrepServices({
  phoneWhatsApp = "56900000000",
  email = "contacto@rycrep.cl",
  companyName = "Rycrep",
}: {
  phoneWhatsApp?: string;
  email?: string;
  companyName?: string;
}) {
  const allTags = useTagUniverse();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const [expandAll, setExpandAll] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter((s) => {
      const hitQ = !q
        || s.title.toLowerCase().includes(q)
        || s.subtitle.toLowerCase().includes(q)
        || s.bullets.some((b) => b.toLowerCase().includes(q));
      const hitTags = activeTags.length === 0 || activeTags.every((t) => s.tags.includes(t));
      return hitQ && hitTags;
    });
  }, [query, activeTags]);

  const whatsappURL = `https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(
    `Hola ${companyName}, quisiera cotizar servicios. Categoría: ${
      SERVICES.find((s) => s.id === activeId)?.title || "General"
    }`
  )}`;

  return (
    <div className="ryc-wrapper">
      <style>{CSS}</style>

      {/* HERO */}
      <section className="ryc-hero">
        <div className="ryc-hero__text">
          <h1>{companyName} – Servicios</h1>
          <p>
            Mantenimiento preventivo/correctivo y overhaul para equipos eléctricos, diésel y
            electrónica industrial. Laboratorios con bancos de prueba, trazabilidad y foco minero/industrial.
          </p>

        </div>

      </section>

      {/* CONTROLES */}
      <section className="ryc-controls">

        <div className="ryc-actions">
          <button
            className="btn btn--small"
            onClick={() => setExpandAll((v) => !v)}
            aria-pressed={expandAll}
          >
            {expandAll ? "Colapsar todo" : "Expandir todo"}
          </button>
          <button
            className="btn btn--small btn--ghost"
            onClick={() => { setQuery(""); setActiveTags([]); }}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* TAGS */}
      <section className="ryc-tags">
        {allTags.map((t) => {
          const active = activeTags.includes(t);
          return (
            <button
              key={t}
              className={`tag ${active ? "tag--active" : ""}`}
              onClick={() =>
                setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
              }
            >
              {t}
            </button>
          );
        })}
      </section>

      {/* LAYOUT */}
      <section className="ryc-grid">
        <nav className="ryc-nav" aria-label="Categorías">
          {filtered.map((s) => (
            <button
              key={s.id}
              className={`nav-item ${activeId === s.id ? "is-active" : ""}`}
              onClick={() => setActiveId(s.id)}
            >
              <span className="dot" />
              <div>
                <strong>{s.title}</strong>
                <small>{s.subtitle}</small>
              </div>
            </button>
          ))}
        </nav>

        <div className="ryc-content">
          {filtered.map((s) => (
            <article key={s.id} id={s.id} className={`ryc-card ${activeId === s.id ? "is-visible" : ""}`}>
              <header className="ryc-card__header">
                <div>
                  <h2>{s.title}</h2>
                  <p className="muted">{s.subtitle}</p>
                </div>
                <div className="ryc-card__chips">
                  {s.tags.map((tag) => (
                    <span key={tag} className="chip">{tag}</span>
                  ))}
                </div>
              </header>

              <Accordion bullets={s.bullets} expandAll={expandAll} />

            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Accordion({ bullets, expandAll }: { bullets: string[]; expandAll: boolean }) {
  const [open, setOpen] = useState(expandAll);
  React.useEffect(() => setOpen(expandAll), [expandAll]);
  return (
    <div className={`acc ${open ? "acc--open" : ""}`}>
      <button className="acc__toggle" onClick={() => setOpen((v) => !v)}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="currentColor" d="M12 4v16m8-8H4"/>
        </svg>
        {open ? "Ocultar detalle" : "Ver detalle"}
      </button>
      <ul className="acc__content">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

const CSS = `
/* Paleta corporativa (claro) */
.ryc-wrapper{
  --bg:#ffffff;
  --card:#ffffff;
  --muted:#4b5563;      /* gris texto secundario */
  --border:#e5e7eb;     /* gris borde */
  --brand:#1b2240;      /* azul corporativo */
  --brandDark:#121732;  /* azul más oscuro para hover */
  --accent:#f7f8fb;     /* gris suave para fondos */
  --text:#1b2240;       /* color de texto principal */
  color:var(--text);
  background:var(--bg);
  font-family: 'Montserrat', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  padding:24px;
}

/* HERO */
.ryc-hero{display:grid;grid-template-columns:1.6fr .8fr;gap:24px;align-items:center;margin-bottom:20px}
.ryc-hero h1{font-size:28px;margin:0 0 8px;color:var(--text)}
.ryc-hero p{color:var(--muted);margin:0}
.ryc-cta{margin-top:16px;display:flex;gap:12px}

/* Botones */
.btn{
  border:1px solid var(--border);
  background:var(--card);
  padding:10px 14px;
  border-radius:10px;
  color:var(--text);
  cursor:pointer;
  transition:all .2s ease;
  font-weight:600;
  text-decoration:none;
  display:inline-flex;align-items:center;gap:8px
}
.btn:hover{transform:translateY(-1px);border-color:var(--brand)}
.btn--primary{background:var(--brand);color:#fff;border-color:var(--brand)}
.btn--primary:hover{background:var(--brandDark);border-color:var(--brandDark)}
.btn--ghost{background:transparent;color:var(--brand);border-color:var(--brand)}
.btn--small{padding:8px 12px;font-size:14px}

/* KPIs */
.ryc-kpis{
  list-style:none;margin:0;padding:14px;background:var(--card);
  border:1px solid var(--border);border-radius:12px;display:grid;gap:8px
}
.ryc-kpis li{display:flex;gap:10px;align-items:center;color:var(--muted)}
.ryc-kpis span{
  display:inline-block;min-width:48px;text-align:center;
  background:var(--accent);padding:6px 8px;border-radius:8px;
  color:var(--brand);border:1px solid var(--border);font-weight:700
}

/* Controles */
.ryc-controls{display:flex;gap:12px;align-items:center;margin:16px 0}
.ryc-search{
  flex:1;background:var(--card);border:1px solid var(--border);
  padding:12px 14px;border-radius:10px;color:var(--text)
}
.ryc-actions{display:flex;gap:8px}

/* Tags */
.ryc-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.tag{
  padding:6px 10px;border:1px solid var(--border);border-radius:999px;
  background:var(--card);color:var(--text);cursor:pointer
}
.tag--active{
  border-color:var(--brand);background:var(--accent);
  color:var(--brand);box-shadow:0 0 0 2px rgba(27,34,64,.08) inset
}

/* Layout */
.ryc-grid{display:grid;grid-template-columns:320px 1fr;gap:16px}

/* Navigation (categorías) */
.ryc-nav{
  background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:8px;position:sticky;top:12px;height:max-content
}
.nav-item{
  width:100%;text-align:left;border:none;background:transparent;color:var(--text);
  padding:12px;border-radius:10px;display:flex;gap:12px;align-items:flex-start;cursor:pointer
}
.nav-item:hover{background:var(--accent)}
.nav-item .dot{width:9px;height:9px;border-radius:999px;background:var(--border);margin-top:6px}
.nav-item.is-active{outline:2px solid var(--brand);background:#eef1f7}
.nav-item.is-active .dot{background:var(--brand)}

/* Cards */
.ryc-content{display:grid;gap:16px}
.ryc-card{
  background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:16px;opacity:.9;transform:scale(.995);transition:all .2s ease;
  box-shadow:0 2px 10px rgba(0,0,0,.04)
}
.ryc-card.is-visible{opacity:1;transform:scale(1)}
.ryc-card__header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.ryc-card h2{margin:0 0 6px;color:var(--text)}
.muted{color:var(--muted);margin:0}
.ryc-card__chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{
  background:var(--accent);border:1px solid var(--border);
  color:var(--brand);padding:4px 8px;border-radius:8px;font-size:12px
}

/* Acordeón */
.acc{margin-top:10px}
.acc__toggle{
  display:inline-flex;gap:8px;align-items:center;background:transparent;
  border:1px solid var(--border);color:var(--text);padding:8px 10px;border-radius:8px;cursor:pointer
}
.acc__toggle:hover{border-color:var(--brand)}
.acc__content{margin:10px 0 0 0;padding-left:18px;display:none}
.acc--open .acc__content{display:block}
.acc__content li{margin:6px 0;color:var(--text)}

/* Footer tarjeta */
.ryc-card__footer{display:flex;gap:10px;margin-top:14px}

/* Exclusions */
.ryc-exclusions{
  margin-top:18px;background:#fafafa;border:1px solid var(--border);
  border-radius:12px;padding:14px
}
.ryc-exclusions h3{margin:0 0 8px;color:var(--text)}
.ryc-exclusions li{color:var(--text)}

/* Footer general */
.ryc-footer{margin-top:18px;color:var(--muted)}
.ryc-footer a{color:var(--brand)}

/* Responsive */
@media (max-width:980px){
  .ryc-hero{grid-template-columns:1fr}
  .ryc-grid{grid-template-columns:1fr}
}
`;

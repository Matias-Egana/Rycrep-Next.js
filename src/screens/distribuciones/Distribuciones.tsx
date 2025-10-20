import React from "react";
import { Link } from "react-router-dom";
import "./Distribuciones.css";

// Logos
import bosch from "../../assets/distribuciones/bosch.jpg";
import delcoremy from "../../assets/distribuciones/delcoremy.jpg";
import denso from "../../assets/distribuciones/denso.jpg";
import leece from "../../assets/distribuciones/leece.png";
import niehoff from "../../assets/distribuciones/niehoff.png";
import nikko from "../../assets/distribuciones/nikko.jpg";
import prelub from "../../assets/distribuciones/prelub.png";
import sawafuji from "../../assets/distribuciones/sawafuji.jpg";
import tdi from "../../assets/distribuciones/tdi.jpg";
import bussman from "../../assets/distribuciones/bussman.png";

type Brand = {
  key: string;
  name: string;
  logo: string;
  alt: string;
  desc: string;
  highlights: string[];
  filterValue: string; // Debe coincidir con ProductList.brands[]
  featured?: boolean;  // Para resaltar Niehoff
};

const BRANDS: Brand[] = [
  {
    key: "niehoff",
    name: "C.E. Niehoff & Co.",
    logo: niehoff,
    alt: "Logo C.E. Niehoff & Co.",
    desc: "Alternadores brushless heavy-duty y gestión de energía para condiciones extremas.",
    highlights: ["Alta eficiencia", "Brushless", "Servicio severo"],
    filterValue: "Niehoff",
    featured: true, // ⭐ NIEHOFF destacada
  },
  {
    key: "nikko",
    name: "NIKKO",
    logo: nikko,
    alt: "Logo Nikko",
    desc: "Motores de arranque y alternadores para maquinaria pesada. Torque alto y confiabilidad.",
    highlights: ["Arranque pesado", "Durabilidad", "OEM japonés"],
    filterValue: "Nikko",
  },
  {
    key: "delcoremy",
    name: "Delco Remy",
    logo: delcoremy,
    alt: "Logo Delco Remy",
    desc: "Sistemas de arranque y carga para vehículos comerciales e industriales.",
    highlights: ["Flotas", "Alta durabilidad", "Soporte global"],
    filterValue: "Delco Remy",
  },
  {
    key: "denso",
    name: "DENSO",
    logo: denso,
    alt: "Logo Denso",
    desc: "Alternadores y arrancadores OEM de precisión y alta fiabilidad.",
    highlights: ["Confiabilidad", "Eficiencia", "OEM"],
    // OJO: tu ProductList usa 'Delso' en brands[]; usamos ese valor para que filtre.
    filterValue: "Delso",
  },
  {
    key: "bussman",
    name: "BUSSMAN",
    logo: bussman,
    alt: "Logo Bussman",
    desc: "Soluciones de protección eléctrica confiables para aplicaciones industriales y automotrices.",
    highlights: ["Fusibles", "Aplicaciones industriales", "Automotriz y flota"],
    filterValue: "Bussman",
  },
  {
  key: "tdi",
  name: "TDI",
  logo: tdi,
  alt: "Logo TDI",
  desc: "Arranque neumático por turbina para grandes motores diésel. Seguro y libre de chispa.",
  highlights: ["Air starters", "Seguridad", "Motores grandes"],
  filterValue: "TDI",
  },
  {
    key: "bosch",
    name: "BOSCH",
    logo: bosch,
    alt: "Logo Bosch",
    desc: "Líder global en sistemas de arranque y carga. Robustez y repuestos disponibles.",
    highlights: ["Líder global", "Robustez", "Cobertura"],
    filterValue: "Bosch",
  },
  {
    key: "leece",
    name: "Leece-Neville",
    logo: leece,
    alt: "Logo Leece-Neville",
    desc: "Alternadores de alto amperaje para buses, camiones y servicio severo.",
    highlights: ["Alto amperaje", "Heavy-duty", "Flotas"],
    filterValue: "Leece-Neville",
  },
  {
    key: "sawafuji",
    name: "SAWAFUJI",
    logo: sawafuji,
    alt: "Logo Sawafuji",
    desc: "Alternadores y arrancadores confiables para entornos exigentes.",
    highlights: ["Confiabilidad", "Servicio severo", "Industria"],
    filterValue: "Sawafuji",
  },
  {
    key: "prelub",
    name: "PRELUB",
    logo: prelub,
    alt: "Logo Prelub",
    desc: "Prelubricación que protege el motor diésel al arranque reduciendo desgaste.",
    highlights: ["Protección motor", "Prelubricación", "Diésel"],
    filterValue: "Prelub",
  },
];

const productosHref = (brandFilter: string) =>
  `/productos?brand=${encodeURIComponent(brandFilter)}`;

export default function Distribuciones() {
  return (
    <section className="dist-page">
      <header className="dist-header">
        <h1>Estas son nuestras <span>distribuciones</span></h1>
        <p>Presiona una para ver sus productos.</p>
      </header>

      <div className="dist-grid">
        {BRANDS.map((b) => (
          <Link
            key={b.key}
            to={productosHref(b.filterValue)}
            className={`dist-card ${b.featured ? "featured" : ""}`}
            aria-label={`Ver productos de ${b.name}`}
          >
            {b.featured && (
              <div className="featured-badge" aria-hidden="true">
                <span>Representamos a</span>
              </div>
            )}

            <div className="dist-logo">
              <img src={b.logo} alt={b.alt} loading="lazy" />
            </div>

            <div className="dist-body">
              <h3 className="dist-name">{b.name}</h3>
              <p className="dist-desc">{b.desc}</p>
              <ul className="dist-tags" aria-label="Atributos destacados">
                {b.highlights.map((t) => (
                  <li className="tag" key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="dist-cta">
              <span className="btn">Ver productos</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

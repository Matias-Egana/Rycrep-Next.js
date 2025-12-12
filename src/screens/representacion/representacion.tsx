import React from "react";
import { useNavigate } from "react-router-dom";
import "./representaciones.css";

// Importa tus imágenes
import logo from "../../assets/representacion/logo_ce.webp";
import buildingBg from "../../assets/representacion/niehoff.webp";
import alt1 from "../../assets/representacion/alternadores/alternador1.webp";
import alt2 from "../../assets/representacion/alternadores/alternador2.webp";
import alt3 from "../../assets/representacion/alternadores/alternador3.webp";

// Nuevo componente: botón "Ver video" que abre YouTube
import YouTubeAutoplayVideo from "../../components/representaciones/YoutubeAutoplayVideo";

type NiehoffBannerProps = {
  logoSrc: string;
  buildingBgSrc: string;
  alternator1Src: string;
  alternator2Src: string;
  alternator3Src: string;
};

const Representacion: React.FC<NiehoffBannerProps> = ({
  logoSrc,
  buildingBgSrc,
  alternator1Src,
  alternator2Src,
  alternator3Src,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/productos"); // Ruta a la que quieres ir
  };

  return (
    <section className="niehoff-banner">
      {/* Topbar */}
      <div className="nb-topbar">
        <div className="nb-logo">
          <img src={logoSrc} alt="C.E. Niehoff & Co." />
        </div>
        <div className="nb-claim">
          <span className="nb-claim-pill">Rycrep × Niehoff</span>
          <span className="nb-claim-text">
            Somos el <strong>distribuidor exclusivo</strong> de Niehoff &amp; Co. para Latinoamérica
          </span>
        </div>
      </div>
      <div className="nb-ribbon" aria-hidden="true" />

      {/* Hero */}
      <div
        className="nb-hero"
        style={{ backgroundImage: `url(${buildingBgSrc})` }}
      >
        <div className="nb-overlay" aria-hidden="true" />
        <div className="nb-hero-inner">
          <div className="nb-hero-left">
            <h3 className="nb-hero-title">Consulta por nuestros productos Niehoff.</h3>

            <button className="nb-cta" onClick={handleClick}>
              Ver Productos
            </button>
          </div>

          {/* ¡NO tocamos la posición ni tamaño de las imágenes! */}
          <div className="nb-hero-right" aria-label="Galería de alternadores">
            <img className="alt alt-a" src={alternator1Src} alt="Alternador 1" />
            <img className="alt alt-b" src={alternator2Src} alt="Alternador 2" />
            <img className="alt alt-c" src={alternator3Src} alt="Alternador 3" />
          </div>
        </div>
      </div>

      {/* Bloque: ¿Quién es Niehoff? */}
      <section className="nb-about">
        <div className="nb-about-inner">
          <h2 className="title">
            ¿Quién es <span>Niehoff</span>?
          </h2>
          <p className="lead">
            C.E. Niehoff &amp; Co. es referente mundial en <strong>alternadores brushless de alto desempeño</strong>,
            diseñados para condiciones extremas: polvo, vibración, humedad y ciclos de trabajo prolongados.
          </p>

          <div className="nb-panels">
            <article className="panel">
              <div className="panel-ico" aria-hidden>⚡</div>
              <h3>Eficiencia y estabilidad</h3>
              <p>
                Regulación eléctrica precisa, rendimiento superior y menor mantenimiento. Ideales para flotas donde la energía
                estable es crítica para la electrónica embarcada.
              </p>
            </article>
            <article className="panel">
              <div className="panel-ico" aria-hidden>🛡️</div>
              <h3>Construcción heavy-duty</h3>
              <p>
                Ingeniería pensada para <em>duty cycles</em> severos y altas temperaturas. Componentes sellados y robustos para
                maximizar vida útil en terreno.
              </p>
            </article>
            <article className="panel">
              <div className="panel-ico" aria-hidden>🤝</div>
              <h3>Rycrep + Niehoff</h3>
              <p>
                La alianza que distingue a Rycrep: soporte local, repuestos, asesoría técnica y especificación correcta para cada aplicación.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 🔽 NUEVO DIV — botón "Ver video" (abre YouTube) */}
      <YouTubeAutoplayVideo
        url="https://www.youtube.com/watch?v=100kV-T8VlA"
        title="Ver video"
      />

      {/* Bloque: Aplicaciones y marcas */}
      <section className="nb-uses">
        <div className="nb-uses-inner">
          <h2 className="title">Aplicaciones en maquinaria líder</h2>
          <p className="muted">
            Usados en <strong>equipos de tracción</strong> y <strong>equipos de movimiento de tierra</strong> de:
          </p>

          <ul className="brand-row" aria-label="Marcas">
            <li className="brand-chip">Komatsu</li>
            <li className="brand-chip">Liebherr</li>
            <li className="brand-chip">Caterpillar</li>
          </ul>

          <div className="nb-bullets">
            <div className="bullet">
              <span className="dot" />
              <p>Integración habitual con <strong>motores Cummins, Detroit y Caterpillar.</strong> <strong>Motores diésel de alto rendimiento</strong>.</p>
            </div>
            <div className="bullet">
              <span className="dot" />
              <p>Rendimiento estable para sistemas hidráulicos, control, iluminación de alto consumo y electrónica avanzada.</p>
            </div>
            <div className="bullet">
              <span className="dot" />
              <p>Soporte y provisión a través de <strong>Rycrep</strong>: especificación, suministro y postventa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bloque CTA ancho */}
      <section className="nb-cta-wide" id="productos">
        <div className="nb-cta-inner">
          <h3>
            La conexión con <span>Niehoff</span> es nuestro mejor sello.
          </h3>
          <p>
            Cuéntanos tu aplicación (voltaje, consumo, duty cycle y motor). Te ayudamos a seleccionar el alternador ideal.
          </p>
          <a href="/contacto" className="nb-cta alt-cta">Hablar con un especialista</a>
        </div>
      </section>
    </section>
  );
};

// Llamada del componente ya con imágenes importadas
export default function RepresentacionWrapper() {
  return (
    <Representacion
      logoSrc={logo}
      buildingBgSrc={buildingBg}
      alternator1Src={alt1}
      alternator2Src={alt2}
      alternator3Src={alt3}
    />
  );
}

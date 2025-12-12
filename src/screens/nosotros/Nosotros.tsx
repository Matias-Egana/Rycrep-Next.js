import React, { useEffect } from 'react';
import './nosotros.css';

import teamPhoto from '../../assets/nosotros/portada.webp';   // NO se mueve
import teamPhoto2 from '../../assets/nosotros/ceo2.webp';

const Nosotros: React.FC = () => {
  // Animación: marca como visible cada item al entrar en viewport
  useEffect(() => {
    document.documentElement.classList.add('io-ready');

    const items = document.querySelectorAll<HTMLElement>('.ns-tl-item');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="nosotros">
      {/* Imagen 1 (no tocar) */}
      <div className="nosotros-photo">
        <img src={teamPhoto} alt="Equipo" />
      </div>

      {/* Intro */}
      <h2 className="nosotros-title">Sobre Nosotros</h2>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Somos una empresa dedicada a las ventas técnicas, soporte técnico especializado, mantenimiento
          y reparación de equipos electromecánicos. Nuestro propósito es brindar soluciones
          rápidas y confiables para la minería, industria y transporte, con foco en disponibilidad operacional
          y continuidad de servicio.
        </p>
      </div>

      {/* Cinta de valores */}
      <div className="ns-band">
        <div className="ns-stat">
          <div className="ns-k">Desde 1982</div>
          <div className="ns-l">Trayectoria</div>
        </div>
        <div className="ns-stat">
          <div className="ns-k">Antofagasta</div>
          <div className="ns-l">Oficina principal</div>
        </div>
        <div className="ns-stat">
          <div className="ns-k">Servicio integral</div>
          <div className="ns-l">Reparación y repuestos</div>
        </div>
      </div>

      {/* Propuesta de valor */}
      <div className="ns-grid">
        <article className="ns-card">
          <h3>Representaciones y suministro</h3>
          <p>Integramos marcas de prestigio en alternadores, motores de arranque, 
            implementos de seguridad para maquinaria y equipos, así como soluciones eléctricas. 
            Acercamos estos productos a las operaciones de nuestros clientes mediante ventas a
            nivel nacional e internacional, garantizando disponibilidad y soporte técnico 
            especializado. Destacamos a C.E. Niehoff & Co., junto con Delco Remy y Eaton Bussmann, 
            como nuestras principales marcas representadas.
          </p>
        </article>
        <article className="ns-card">
          <h3>Mantenimiento y diagnóstico</h3>
          <p>
            Taller y terreno: mantenimiento preventivo/correctivo, overhaul y pruebas funcionales.
            Procedimientos claros, trazabilidad y foco en minimizar detenciones no programadas.
          </p>
        </article>
        <article className="ns-card">
          <h3>Ingeniería aplicada</h3>
          <p>
            Soporte en especificación, compatibilidad electromecánica y dimensionamiento de sistemas de carga,
            además de capacitación a equipos de mantenimiento.
          </p>
        </article>
      </div>

      {/* Pilar: Transparencia y vinculación */}
      <div className="ns-pillar ns-reveal">
        <div className="ns-pillar-ico" aria-hidden>🤝</div>
        <p>
          Planteamos como pilar fundamental la <strong>transparencia</strong> y la
          <strong> vinculación directa</strong> con nuestros clientes y trabajadores,
          fortaleciendo los lazos que permitirán fundar <strong>cimientos sólidos</strong> en el
          mercado <strong>minero</strong>, <strong>pesquero</strong> y de <strong>transporte</strong>.
        </p>
      </div>

      {/* Misión */}
      <h2 className="nosotros-title">Nuestra misión</h2>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Ofrecer <strong>servicios de alta calidad</strong> en el <strong>menor plazo</strong>, satisfacer a plenitud los
          requerimientos y <strong>superar expectativas</strong>, forjando relaciones comerciales de largo plazo.
        </p>
      </div>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Lo logramos con un <strong>equipo multidisciplinario</strong>, un <strong>ambiente de trabajo seguro</strong> y
          <strong> cumplimiento</strong> de leyes y normas, apoyados por <strong>tecnología de vanguardia</strong>.
        </p>
      </div>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Impulsamos la <strong>mejora continua</strong> y la certificación en <strong>Calidad</strong>, 
          <strong> Medio Ambiente</strong> y <strong>Seguridad y Salud Ocupacional</strong>, como sello de nuestra seriedad.
        </p>
      </div>

      {/* Imagen 2 (no tocar) + título superior animado */}
      <div className="nosotros-photo captioned">
        <span className="ns-photo-title" role="note">
          Gustavo Reyes, CEO de RYCREP en la sede de Niehoff, Chicago 2024
        </span>
        <img src={teamPhoto2} alt="Equipo" />
      </div>

      {/* Visión */}
      <h2 className="nosotros-title">Nuestra Visión</h2>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Ser los <strong>mejores representantes</strong> de productos, con <strong>servicios integrales</strong> y
          formulación de <strong>proyectos industriales</strong> a nivel nacional e internacional.
        </p>
      </div>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Responder a las necesidades de nuestros clientes <strong>desarrollando proyectos</strong> basados en
          <strong> confiabilidad</strong> y <strong>tecnología aplicada</strong>, construyendo una identificación genuina con cada uno.
        </p>
      </div>

      {/* Historia (SOLO la línea de tiempo; sin imagen lateral) */}
      <h2 className="nosotros-title">Nuestra Historia</h2>
      <div className="ns-tl-layout">
        {/* Columna: Línea de tiempo (única) */}
        <section className="ns-tl-main">
          <section className="ns-timeline" aria-label="Línea de tiempo de la empresa">
            {/* 1982 */}
            <article className="ns-tl-item">
              <span className="ns-tl-dot" aria-hidden />
              <div className="ns-tl-year">1982</div>
              <div className="ns-tl-card">
                <h3>Inicio de representaciones</h3>
                <p>Comenzamos la representación y distribución de productos eléctricos para movimiento de tierra y transporte.</p>
              </div>
            </article>

            {/* 1987 */}
            <article className="ns-tl-item">
              <span className="ns-tl-dot" aria-hidden />
              <div className="ns-tl-year">1987</div>
              <div className="ns-tl-card">
                <h3>Servicios de mantenimiento</h3>
                <p>Overhaul y mantenimiento de generadores, torres de iluminación, soldadoras, motores de partida y alternadores (12/24V).</p>
              </div>
            </article>
            {/* 2005 */}
            <article className="ns-tl-item">
              <span className="ns-tl-dot" aria-hidden />
              <div className="ns-tl-year">2005</div>
              <div className="ns-tl-card">
                <h3>Certificaciones y alianzas</h3>
                <p>
                  La empresa cuenta con certificaciones <strong>ISO 9001</strong>, <strong>ISO 14001</strong> e <strong>ISO 18000</strong>, lo que refleja altos
                  estándares en gestión de calidad y medioambiente. Además, es un <strong>Centro Autorizado de Servicio (CAS)</strong>,
                  y mantiene alianzas con marcas tecnológicas de clase mundial.
                </p>
              </div>
            </article>

            {/* 2008 */}
            <article className="ns-tl-item">
              <span className="ns-tl-dot" aria-hidden />
              <div className="ns-tl-year">2008</div>
              <div className="ns-tl-card">
                <h3>Servicio electrónico industrial</h3>
                <p>Reparación y diseño de tarjetas industriales (SCADA/DCS y módulos inteligentes) con soporte especializado.</p>
              </div>
            </article>

            {/* 2009 - Proyecto destacado */}
            <article className="ns-tl-item is-featured">
              <span className="ns-tl-dot" aria-hidden />
              <div className="ns-tl-year">2009</div>
              <div className="ns-tl-card">
                <div className="ns-badge">Proyecto destacado</div>
                <h3>Sala Carga de Baterías (para camiones de extracción y equipo movimiento tierra)</h3>
                <p>
                  Acondicionamiento integral conforme a normas para operación segura y eficiente.
                  Implementamos <strong>sistema de carga simultánea</strong> hoy en 4 compañías mineras (I–IV Región).
                </p>
                <ul className="ns-tl-bullets">
                  <li>Ventilación y extracción para mitigar gases del electrolito.</li>
                  <li>Puertas antipánico y detección/supresión de incendios.</li>
                  <li>Ducha y lavaojos para emergencias por exposición a ácidos.</li>
                </ul>
              </div>
            </article>

            {/* 2018 */}
            <article className="ns-tl-item">
              <span className="ns-tl-dot" aria-hidden />
              <div className="ns-tl-year">2018</div>
              <div className="ns-tl-card">
                <h3>Laboratorio de inyección diésel</h3>
                <p>Se consolida el laboratorio de inyección diésel con soporte técnico especializado para pruebas y calibración.</p>
              </div>
            </article>
          </section>
        </section>
      </div>

      {/* Cierre */}
      <div className="ns-cta">
        <a className="ns-btn" href="/contacto">Conversemos sobre tu operación</a>
      </div>
    </section>
  );
};

export default Nosotros;

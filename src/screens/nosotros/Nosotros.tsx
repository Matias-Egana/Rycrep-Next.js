import React, { useEffect } from 'react';
import './nosotros.css';

import teamPhoto from '../../assets/nosotros/portada.jpeg';   // NO se mueve
import teamPhoto2 from '../../assets/nosotros/ceo.jpg';       // NO se mueve
// Eliminada la imagen final (timeline.png)

const Nosotros: React.FC = () => {
  // Animación: marca como visible cada item al entrar en viewport
  useEffect(() => {
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
          Somos una empresa dedicada al soporte técnico especializado, mantenimiento
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
          <div className="ns-l">Cobertura Norte</div>
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
          <p>
            Integramos marcas de prestigio en alternadores, motores de partida y soluciones eléctricas,
            acercándolas a la operación local con disponibilidad y soporte técnico. La relación con C.E. Niehoff &amp; Co.
            es parte clave de nuestro sello.
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
            Soporte en especificación, compatibilidad eléctrica y dimensionamiento de sistemas de carga,
            además de capacitación a equipos de mantenimiento.
          </p>
        </article>
      </div>

      {/* Misión */}
      <h2 className="nosotros-title">Nuestra misión</h2>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Ofrecer servicios de alta calidad al menor plazo posible, superando expectativas y construyendo
          relaciones de largo plazo.
        </p>
      </div>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Contamos con una fuerza laboral multidisciplinaria, un ambiente de trabajo seguro y cumplimiento
          de normativa chilena, apoyados por tecnología de punta.
        </p>
      </div>

      {/* Imagen 2 (no tocar) + título superior animado */}
      <div className="nosotros-photo captioned">
        <span className="ns-photo-title" role="note">
          Gustavo Reyes, CEO de RYCREP junto a la ministra de minería Aurora Williams, 2025
        </span>
        <img src={teamPhoto2} alt="Equipo" />
      </div>

      {/* Visión */}
      <h2 className="nosotros-title">Nuestra Visión</h2>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Ser referentes en representación de productos, servicios integrales y formulación de
          proyectos industriales a nivel nacional e internacional.
        </p>
      </div>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Responder a las necesidades de nuestros clientes con soluciones confiables y tecnológicas
          que fortalezcan relaciones de largo plazo.
        </p>
      </div>

      {/* Seguridad */}
      <section className="ns-section" id="seguridad">
        <h2 className="ns-title">Compromiso con la Seguridad</h2>
        <div className="ns-sec-grid">
          <div className="ns-sec-item">
            <div className="ns-sec-ico" aria-hidden>🛡️</div>
            <h3>Primero las personas</h3>
            <p>
              Cultura preventiva, charlas de 5 minutos, permisos de trabajo y análisis de riesgos.
              La integridad del equipo y clientes es intransable.
            </p>
          </div>
          <div className="ns-sec-item">
            <div className="ns-sec-ico" aria-hidden>🔒</div>
            <h3>Control de energías (LOTO)</h3>
            <p>
              Bloqueo/etiquetado, verificación de ausencia de tensión y herramientas aisladas;
              pruebas y registros de cada intervención.
            </p>
          </div>
          <div className="ns-sec-item">
            <div className="ns-sec-ico" aria-hidden>📋</div>
            <h3>Cumplimiento normativo</h3>
            <p>
              Alineados a normativa eléctrica vigente (SEC) y buenas prácticas de la industria.
              Capacitación continua y trazabilidad documental.
            </p>
          </div>
        </div>
      </section>

      {/* Medioambiente */}
      <section className="ns-section" id="medioambiente">
        <h2 className="ns-title">Medioambiente y Sostenibilidad</h2>
        <div className="ns-env">
          <div className="ns-env-block">
            <div className="ns-dot" />
            <p>Gestión responsable de residuos (baterías, aceites, solventes, embalajes) con segregación y gestores autorizados.</p>
          </div>
          <div className="ns-env-block">
            <div className="ns-dot" />
            <p>Reparación sobre reemplazo cuando es viable, extendiendo la vida útil y reduciendo huella de reposición.</p>
          </div>
          <div className="ns-env-block">
            <div className="ns-dot" />
            <p>Promoción de tecnologías de alta eficiencia en carga/arranque para operaciones más estables y eficientes.</p>
          </div>
        </div>
      </section>

      {/* Historia: LÍNEA DE TIEMPO ANIMADA */}
      <h2 className="nosotros-title">Nuestra Historia</h2>
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
            <h3>Sala Carga de Baterías (Container 20/40 pies)</h3>
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

        {/* 2025 - NUEVO hito con el texto de la imagen */}
        <article className="ns-tl-item">
          <span className="ns-tl-dot" aria-hidden />
          <div className="ns-tl-year">2025</div>
          <div className="ns-tl-card">
            <h3>Certificaciones y alianzas</h3>
            <p>
              La empresa cuenta con certificaciones <strong>ISO 9001</strong> e <strong>ISO 14001</strong>, lo que refleja altos
              estándares en gestión de calidad y medioambiente. Además, es un <strong>Centro Autorizado de Servicio (CAS)</strong>,
              y mantiene alianzas con marcas tecnológicas de clase mundial.
            </p>
          </div>
        </article>
      </section>

      {/* (Eliminada la foto final) */}

      {/* Cierre */}
      <div className="ns-cta">
        <a className="ns-btn" href="/contacto">Conversemos sobre tu operación</a>
      </div>
    </section>
  );
};

export default Nosotros;

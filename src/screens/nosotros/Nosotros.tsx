import React from 'react';
import './nosotros.css';
import teamPhoto from '../../assets/nosotros/portada.jpeg'; // tu imagen
import teamPhoto2 from '../../assets/nosotros/portada2.jpg'; // tu imagen
import teamPhoto3 from '../../assets/nosotros/timeline.png'; // tu imagen

const Nosotros: React.FC = () => {
  return (
    <section className="nosotros">
      <div className="nosotros-photo">
        <img src={teamPhoto} alt="Equipo" />
      </div>
      <h2 className="nosotros-title">Sobre Nosotros</h2>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>
          Somos una empresa dedicada al soporte técnico especializado, mantenimiento
          y reparación de equipos electromecánicos.<br/>Nuestro objetivo es brindar soluciones
          rápidas y confiables, garantizando la satisfacción de nuestros clientes.
        </p>
      </div>
      <h2 className="nosotros-title">Nuestra misión</h2>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>Ofrecer servicios de alta calidad al menor plazo posible, para satisfacer a plenitud los requerimientos, 
          maximizando las utilidades del servicio y superando las expectativas de nuestros clientes estableciendo 
          relaciones comerciales a largo plazo.<br />
        </p>
      </div>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>Para lograrlo hemos integrado una fuerza laboral multidisciplinaria calificada, asegurando 
          un ambiente de trabajo satisfactorio y seguro, cumpliendo con las leyes, normas y reglamentos 
          que rigen en nuestro país, con equipos de avanzada tecnología.
        </p>
      </div>
      <div className="nosotros-photo">
        <img src={teamPhoto2} alt="Equipo" />
      </div>
      <h2 className="nosotros-title">Nuestra Visión</h2>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>Ser los mejores representantes de productos, prestación de servicios integrales y formulación
           de proyectos Industriales a nivel nacional e Internacional.</p>
      </div>
      <div className="nosotros-content">
        <span className="nosotros-arrow">→</span>
        <p>Responder a las necesidades de nuestros clientes desarrollando proyectos para las empresas 
          aplicando los conceptos de confiabilidad y tecnología intelectual para lograr una 
          identificación de nuestra empresa con nuestros clientes.</p> 
      </div>
      <h2 className="nosotros-title">Nuestra Historia</h2>
      <div className="nosotros-photo">
        <img src={teamPhoto3} alt="Equipo" />
      </div>
    </section>
  );
};

export default Nosotros;
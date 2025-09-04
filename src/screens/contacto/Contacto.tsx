import React from 'react';
import styles from './contacto.module.css';

const contacto: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Formulario */}
      <div className={styles.formSection}>
        <h2 className={styles.title}>¿Cómo podemos ayudarte?</h2>
        <p className={styles.subtitle}>
          ¿Buscas un producto específico? ¿Buscas una cotización? <br />
          ¡Contáctanos!
        </p>

        <form className={styles.form}>
          <input type="text" placeholder="Nombre" />
          <input type="text" placeholder="Apellidos" />
          <input type="email" placeholder="Correo electrónico" className={styles.fullWidth} />
          <input type="tel" placeholder="Teléfono" />
          <input type="text" placeholder="Empresa" />
          <input type="text" placeholder="Ciudad" />
          <select>
            <option value="">Región</option>
            <option value="Arica y Parinacota">Arica y Parinacota</option>
            <option value="Tarapacá">Tarapacá</option>
            <option value="Antofagasta">Antofagasta</option>
            <option value="Atacama">Atacama</option>
            <option value="Coquimbo">Coquimbo</option>
            <option value="Valparaíso">Valparaíso</option>
            <option value="Metropolitana">Metropolitana de Santiago</option>
            <option value="O'Higgins">Libertador General Bernardo O'Higgins</option>
            <option value="Maule">Maule</option>
            <option value="Ñuble">Ñuble</option>
            <option value="Biobío">Biobío</option>
            <option value="La Araucanía">La Araucanía</option>
            <option value="Los Ríos">Los Ríos</option>
            <option value="Los Lagos">Los Lagos</option>
            <option value="Aysén">Aysén del General Carlos Ibáñez del Campo</option>
            <option value="Magallanes">Magallanes y de la Antártica Chilena</option>
          </select>
          <textarea placeholder="Mensaje" className={styles.fullWidth}></textarea>
          <button type="submit" className={styles.button}>Enviar</button>
        </form>
      </div>

      {/* Mapa */}
      <div className={styles.mapSection}>
        <iframe
          title="Ubicación Antofagasta"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.616082058979!2d-70.3988129244794!3d-23.65274776303859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96ae2e0c9d9e7e3f%3A0x3f9f7c2c7e1e6e6e!2sEl%20Oro%207956%2C%20Antofagasta%2C%20Chile!5e0!3m2!1ses-419!2scl!4v1693512345678"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default contacto;


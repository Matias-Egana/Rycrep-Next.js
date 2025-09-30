import React, { useState } from 'react';
import styles from './contacto.module.css';

const Contacto: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    empresa: '',
    ciudad: '',
    region: '',
    mensaje: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/send-contacto/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('✅ Mensaje enviado con éxito.');
        setFormData({
          nombre: '',
          apellidos: '',
          email: '',
          telefono: '',
          empresa: '',
          ciudad: '',
          region: '',
          mensaje: '',
        });
      } else {
        setStatus('❌ Error al enviar el mensaje.');
      }
    } catch (error) {
      setStatus('⚠️ Ocurrió un problema en la conexión.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2 className={styles.title}>¿Cómo podemos ayudarte?</h2>
        <p className={styles.subtitle}>
          ¿Buscas un producto específico? ¿Buscas una cotización? <br />
          ¡Contáctanos!
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className={styles.fullWidth}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="empresa"
            placeholder="Empresa"
            value={formData.empresa}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={formData.ciudad}
            onChange={handleChange}
          />
          <select name="region" value={formData.region} onChange={handleChange}>
            <option value="">Región</option>
            <option value="Arica y Parinacota">Arica y Parinacota</option>
            <option value="Tarapacá">Tarapacá</option>
            <option value="Antofagasta">Antofagasta</option>
            <option value="Atacama">Atacama</option>
            <option value="Coquimbo">Coquimbo</option>
            <option value="Valparaíso">Valparaíso</option>
            <option value="Metropolitana">Metropolitana de Santiago</option>
            <option value="O'Higgins">O'Higgins</option>
            <option value="Maule">Maule</option>
            <option value="Ñuble">Ñuble</option>
            <option value="Biobío">Biobío</option>
            <option value="La Araucanía">La Araucanía</option>
            <option value="Los Ríos">Los Ríos</option>
            <option value="Los Lagos">Los Lagos</option>
            <option value="Aysén">Aysén</option>
            <option value="Magallanes">Magallanes</option>
          </select>
          <textarea
            name="mensaje"
            placeholder="Mensaje"
            className={styles.fullWidth}
            value={formData.mensaje}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
      </div>

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
        />
      </div>
    </div>
  );
};

export default Contacto;

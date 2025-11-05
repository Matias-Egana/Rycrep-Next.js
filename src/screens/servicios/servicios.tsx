import React from 'react';
import './servicios.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Servicios: React.FC = () => {
  const electronica = [
    "Mantenimiento de Control e Instrumentación",
    "Diseño de Sistemas SCADA DCS",
    "Montaje de Sistemas de Control",
    "Instalación de Redes de Comunicación",
    "Tarjetas de control",
    "Pruebas VFC, VCM, PM&ST",
    "Diseño Electromecánico, otros",
    "Tarjetas de control"
  ];

  const electrico = [
    "Construcción y mantenimiento de Redes de distribución de energía Subterránea",
    "Montaje de Subestaciones eléctricas",
    "Instalaciones de Media Tensión",
    "Instalaciones de Salas Eléctricas",
    "Instalaciones de fuerza",
    "Armado y Modificación de tableros eléctricos",
    "Montaje de Motores Eléctricos",
    "Sistemas de Control",
    "Módulos de Control SIMATIC, SIEMENS, ABB",
    "Módulos de control de variadores de frecuencia",
    "Módulos de control de PLC (Allen Bradley, Siemens, otros)",
    "Pantallas HMI"
  ];

  const electromecanica = [
    "Reparación de Motores Eléctricos",
    "Motores Monofásicos Trifásicos",
    "Alternadores: Diferentes Marcas de 6 a 32 Volts",
    "Motores de Partida Eléctricos desde 6 a 32 Volts",
    "Motores de Partida Neumáticos (Ingersoll Rand)",
    "Motores de Partida Turbina (TDI)",
    "Equipos de Apoyo",
    "Soldadoras Eléctricas-Autónomas",
    "Grupos Electrógenos",
    "Torres de Iluminación",
    "Compresores Estacionarios - Autónomos",
    "Herramientas Eléctricas",
    "Partes y Piezas Automotrices",
    "Instrumentos eléctricos y electrónicos (tarjetas)",
    "Overhaul de equipos Diesel (Caterpillar, Cummins, Perkins, Deutz, Kubota, Lamborghini, Iveco)" 
  ];

  const otrosServicios = [
    "Puentes Grúas con Control Electrónico",
    "Plantas Concentradoras",
    "Plantas SX",
    "Naves EW",
    "Salas Eléctricas",
    "Maquinarias y Equipos para la Minería",
    "(Palas, Perforadoras, Camiones, Equipos de apoyo en general)"
  ];

  return (
    <div className="page">
      <h1 className="main-title">Mantenimientos Preventivos - Predictivos - Correctivos</h1>
      <p className="subtitle">Brindamos servicios en las siguientes áreas</p>

      {/* Electrónica */}
      <div className="row electronica">
        <h2>Electrónica</h2>
        <div className="lista-cuadro">
          <ul>
            {electronica.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Eléctrico */}
      <div className="row electrico">
        <h2>Eléctrico</h2>
        <div className="lista-cuadro">
          <ul>
            {electrico.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Electromecánica */}
      <div className="row electromecanica">
        <h2>Electromecánica</h2>
        <div className="lista-cuadro">
          <ul>
            {electromecanica.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Otros Servicios */}
      <div className="row otrosServicios">
        <h2>Otros Servicios</h2>
        <div className="lista-cuadro">
          <ul>
            {otrosServicios.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Servicios;

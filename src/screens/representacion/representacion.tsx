import React from "react";
import { useNavigate } from "react-router-dom";
import "./representaciones.css";

// Importa tus imágenes
import logo from "../../assets/representacion/logo_ce.png";
import buildingBg from "../../assets/representacion/niehoff.jpg";
import alt1 from "../../assets/representacion/alternadores/alternador1.png";
import alt2 from "../../assets/representacion/alternadores/alternador2.png";
import alt3 from "../../assets/representacion/alternadores/alternador3.png";

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
      {/* Barra superior */}
      <div className="nb-topbar">
        <div className="nb-logo">
          <img src={logoSrc} alt="C.E. Niehoff & Co." />
        </div>
        <div className="nb-claim">
          Somos el distribuidor exclusivo de Niehoff &amp; Co. para Latinoamérica
        </div>
      </div>

      {/* Hero inferior */}
      <div
        className="nb-hero"
        style={{ backgroundImage: `url(${buildingBgSrc})` }}
      >
        {/* Capa oscura azulada */}
        <div className="nb-overlay" aria-hidden="true" />

        <div className="nb-hero-inner">
          <div className="nb-hero-left">
            <h3 className="nb-hero-title">
              Consulta por nuestros productos Niehoff.
            </h3>

            <button className="nb-cta" onClick={handleClick}>
              Ver Productos
            </button>
          </div>

          <div className="nb-hero-right" aria-label="Galería de alternadores">
            <img className="alt alt-a" src={alternator1Src} alt="Alternador 1" />
            <img className="alt alt-b" src={alternator2Src} alt="Alternador 2" />
            <img className="alt alt-c" src={alternator3Src} alt="Alternador 3" />
          </div>
        </div>
      </div>
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

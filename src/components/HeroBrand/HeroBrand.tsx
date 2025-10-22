import React from "react";
import styles from "./HeroBrand.module.css";

/**
 * brandKey: clave normalizada (niehoff, tdi, segbosch, rc, etc.)
 * label: nombre visible (Niehoff, TDI, SEG (Bosch), R&C, ...)
 */
type Props = {
  brandKey?: string;
  label?: string;
};

/** Imágenes soportadas por marca (agrega más si quieres) */
const HERO_IMAGES: Record<string, string> = {
  // TDI: imagen que me diste
  tdi: "https://i.imgur.com/8Tg8sDo.png",
  americansuperior: "https://i.imgur.com/Ty869ob.png",
  niehoff: "https://i.imgur.com/BKDSg4V.png"

  // Niehoff: usa la que quieras (ejemplo)
};

const HeroBrand: React.FC<Props> = ({ brandKey, label }) => {
  if (!brandKey) return null;
  const img = HERO_IMAGES[brandKey];
  if (!img) return null; // si no hay imagen para esa marca, no se muestra el hero

  return (
    <section className={styles.hero}>
      <img className={styles.bg} src={img} alt={label ?? brandKey} />
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <h1 className={styles.title}>
          Productos de <span className={styles.brand}>{label ?? brandKey.toUpperCase()}</span>
        </h1>
      </div>
    </section>
  );
};

export default HeroBrand;

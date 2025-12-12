import React from 'react';
import styles from './CategoryGrid.module.css';
import { Link } from 'react-router-dom';

import motoresImg from '../../assets/CategoryGrid/motores.webp';
import alternadorImg from '../../assets/CategoryGrid/alternadores.webp';
import bateriasImg from '../../assets/CategoryGrid/baterias.webp';
import lucesImg from '../../assets/CategoryGrid/luces.webp';
import fusiblesImg from '../../assets/CategoryGrid/fusibles.webp';
import seguridadImg from '../../assets/CategoryGrid/seguridad.webp';

const normalizeCategory = (cat: string) => {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s\/]/g, "_");
};

const images = [
  { name: 'Motores', image: motoresImg },
  { name: 'Alternadores', image: alternadorImg },
  { name: 'Baterías', image: bateriasImg },
  { name: 'Fusibles', image: fusiblesImg },
  { name: 'Luminaria', image: lucesImg },
  { name: 'Seguridad', image: seguridadImg },
];

const loopImages = [...images, ...images];

const CategoryGrid: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Encuentra lo que estás buscando</h2>
      <div className={styles.carouselWrapper}>
        <div className={styles.carousel}>
          {loopImages.map((item, idx) => (
            <Link 
              key={idx} 
              to={`/productos?category=${normalizeCategory(item.name)}`} 
              className={styles.link}
            >
              <div className={styles.slide}>
                <img src={item.image} alt={item.name} />
                <p className={styles.categoryName}>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;

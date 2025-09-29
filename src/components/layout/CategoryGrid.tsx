import React from 'react';
import styles from './CategoryGrid.module.css';
import { Link } from 'react-router-dom';

// importa las imágenes
import motoresImg from '../../assets/CategoryGrid/motores.jpg';
import alternadorImg from '../../assets/CategoryGrid/alternador.png';
import bateriasImg from '../../assets/CategoryGrid/baterias.png';
import lucesImg from '../../assets/CategoryGrid/luces.png';
import fusiblesImg from '../../assets/CategoryGrid/fusibles.png';
import seguridadImg from '../../assets/CategoryGrid/seguridad.png';

const images = [
  { name: 'Motores', image: motoresImg, path: '/products/motores' },
  { name: 'Alternadores', image: alternadorImg, path: '/products/alternadores' },
  { name: 'Baterías', image: bateriasImg, path: '/products/baterias' },
  { name: 'Fusibles', image: fusiblesImg, path: '/products/repuestos' },
  { name: 'Luminaria', image: lucesImg, path: '/products/focos' },
  { name: 'Seguridad', image: seguridadImg, path: '/products/seguridad' },
];

const loopImages = [...images, ...images];

const CategoryGrid: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Encuentra lo que estás buscando</h2>
      <div className={styles.carouselWrapper}>
        <div className={styles.carousel}>
          {loopImages.map((item, idx) => (
            <Link key={idx} to={item.path} className={styles.link}>
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
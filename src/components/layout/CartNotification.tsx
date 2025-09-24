// src/presentation/components/CartNotification.tsx
import React from 'react';
import styles from './CartNotification.module.css';

interface NotificationProps {
  product: {
    name: string;
    images: string[];
    product_code: string;
    quantity: number;
  };
}

const CartNotification: React.FC<NotificationProps> = ({ product }) => {
  return (
    <div className={styles.notification}>
      <img src={product.images[0]} alt={product.name} className={styles.productImage} />
      <div className={styles.details}>
        <p>Producto añadido:</p>
        <h4>{product.name}</h4>
        <p>Código: {product.product_code}</p>
        <p>Cantidad: {product.quantity}</p>
      </div>
    </div>
  );
};

export default CartNotification;

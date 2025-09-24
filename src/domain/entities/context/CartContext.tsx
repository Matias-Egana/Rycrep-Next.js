import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartProduct {
  name: string;
  images: string[];
  product_code: string;
  quantity: number;
}

interface Notification {
  visible: boolean;
  product: CartProduct;
}

interface CartContextType {
  cart: CartProduct[];
  notification?: Notification;
  addToCart: (product: CartProduct) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function CartProvider({ children }: Props) {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState<Notification | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartProduct) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(p => p.product_code === product.product_code);

      if (existingIndex >= 0) {
        // Producto ya existe: sumamos cantidad
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + product.quantity,
        };

        // Producto exacto del carrito para la notificación
        const updatedProduct = updated[existingIndex];
        setNotification({ visible: true, product: updatedProduct });
        setTimeout(() => setNotification(undefined), 3000);

        return updated;
      } else {
        // Nuevo producto
        setNotification({ visible: true, product });
        setTimeout(() => setNotification(undefined), 3000);

        return [...prev, product];
      }
    });
  };

  const clearCart = () => setCart([]);

  const getTotalItems = () => cart.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, notification, addToCart, clearCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
}

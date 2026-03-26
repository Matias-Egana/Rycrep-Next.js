"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { z } from "zod";

const STORAGE_KEY = "cart";

const cartProductSchema = z.object({
  name: z.string(),
  images: z.array(z.string()),
  product_code: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().nonnegative(),
});

const cartSchema = z.array(cartProductSchema);

export type CartProduct = z.infer<typeof cartProductSchema>;

type CartNotification = {
  visible: boolean;
  product: CartProduct;
};

type CartContextValue = {
  cart: CartProduct[];
  notification?: CartNotification;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productCode: string) => void;
  updateQuantity: (productCode: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function readStoredCart() {
  if (typeof window === "undefined") return [];

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = cartSchema.safeParse(JSON.parse(saved));
    if (!parsed.success) {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed.data;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>(readStoredCart);
  const [notification, setNotification] = useState<CartNotification | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!notification?.visible) return undefined;
    const timeout = window.setTimeout(() => setNotification(undefined), 2800);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  const value = useMemo<CartContextValue>(() => {
    return {
      cart,
      notification,
      addToCart: (product) => {
        setCart((current) => {
          const existingIndex = current.findIndex((item) => item.product_code === product.product_code);
          if (existingIndex >= 0) {
            const updated = [...current];
            const mergedProduct = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + product.quantity,
              price: product.price,
              images: product.images.length > 0 ? product.images : updated[existingIndex].images,
            };
            updated[existingIndex] = mergedProduct;
            setNotification({ visible: true, product: mergedProduct });
            return updated;
          }

          setNotification({ visible: true, product });
          return [...current, product];
        });
      },
      removeFromCart: (productCode) => {
        setCart((current) => current.filter((item) => item.product_code !== productCode));
      },
      updateQuantity: (productCode, quantity) => {
        setCart((current) =>
          current.map((item) =>
            item.product_code === productCode
              ? { ...item, quantity: Math.max(1, Math.floor(quantity) || 1) }
              : item,
          ),
        );
      },
      clearCart: () => setCart([]),
      getTotalItems: () => cart.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => cart.reduce((acc, item) => acc + item.quantity * item.price, 0),
    };
  }, [cart, notification]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }
  return context;
}

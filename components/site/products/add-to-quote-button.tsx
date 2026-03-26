"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/site/cart-context";

type AddToQuoteButtonProps = {
  product: {
    name: string;
    code: string;
    imageUrl: string | null;
    price: number | null;
  };
  className?: string;
  label?: string;
};

export function AddToQuoteButton({
  product,
  className = "",
  label = "Agregar a cotización",
}: AddToQuoteButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return undefined;
    const timeout = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addToCart({
          name: product.name,
          product_code: product.code,
          images: product.imageUrl ? [product.imageUrl] : [],
          quantity: 1,
          price: product.price ?? 0,
        });
        setAdded(true);
      }}
    >
      {added ? "Agregado" : label}
    </button>
  );
}

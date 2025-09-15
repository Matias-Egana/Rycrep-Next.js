// src/views/screens/ProductDetail.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { fetchProductByCode } from "../../presentation/ProductListViewModel";
import type { Product } from "../../domain/entities/Product";
import defaultImage from "../../assets/ryc.svg";
import styles from "./ProductDetail.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = { dots: false, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, arrows: true };

const ProductDetail: React.FC = () => {
  const { product_code } = useParams<{ product_code: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const sliderRef = useRef<Slider>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!product_code) return;
      try {
        const prod = await fetchProductByCode(product_code);
        if (active) setProduct(prod);
      } catch {
        if (active) setProduct(null);
      }
    })();
    return () => { active = false; };
  }, [product_code]);

  if (!product) return <p>Producto no encontrado.</p>;

const computeFinalPrice = (p: Product): number | null => {
  if (!p.oferta) return null;

  if (typeof p.discountPrice === "number" && p.discountPrice > 0) {
    return p.discountPrice;
  }
  if (
    typeof p.discountPercentage === "number" &&
    typeof p.price === "number" &&
    p.price > 0
  ) {
    return Math.round((p.price * (100 - p.discountPercentage)) / 100);
  }
  if (typeof p.price === "number" && p.price > 0) {
    return p.price;
  }
  return null;
};

const finalPrice = computeFinalPrice(product);
const showOld =
  Boolean(product.oferta) &&
  typeof product.discountPercentage === "number" &&
  typeof product.price === "number" &&
  product.price > 0 &&
  finalPrice !== null &&
  finalPrice < product.price;

  const handleThumbnailClick = (index: number) => sliderRef.current?.slickGoTo(index);

  const handleImageZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const { left, top, width, height } = img.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = "scale(2)";
    img.style.transition = "transform 0.2s ease";
  };
  const resetImageZoom = (e?: React.MouseEvent<HTMLImageElement>) => {
    const img = e?.currentTarget || imageRef.current;
    if (!img) return;
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center";
    img.style.transition = "transform 0.2s ease";
  };

  const isOutOfStock = product.stock === 0;
  const hasMultipleImages = (product.images?.length ?? 0) > 1;

  const handleAddToQuote = () => alert(`"${product.name}" añadido a cotización ✅`);

  return (
    <div className={styles.productDetail}>
      <div className={styles.imageSection}>
        {product.oferta && <span className={styles.offerBadge}>OFERTA</span>}

        {hasMultipleImages ? (
          <>
            <Slider ref={sliderRef} {...sliderSettings} className={styles.slider}>
              {product.images.map((image, index) => (
                <div key={index}>
                  <img
                    ref={imageRef}
                    src={image || defaultImage}
                    alt={`${product.name} - imagen ${index + 1}`}
                    className={styles.productImage}
                    onMouseMove={handleImageZoom}
                    onMouseLeave={resetImageZoom}
                  />
                </div>
              ))}
            </Slider>
            <div className={styles.thumbnailContainer}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image || defaultImage}
                  alt={`Miniatura ${index + 1}`}
                  className={styles.thumbnail}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            ref={imageRef}
            src={(product.images && product.images[0]) || defaultImage}
            alt={product.name}
            className={styles.productImage}
            onMouseMove={handleImageZoom}
            onMouseLeave={resetImageZoom}
          />
        )}
      </div>

      <div className={styles.infoSection}>
        <h1>{product.name}</h1>
        <p><strong>Marca:</strong> {product.brand}</p>
        <p><strong>Categoría:</strong> {product.category}</p>

{/* Precio solo si hay oferta y finalPrice válido */}
{finalPrice !== null && (
  <div className={styles.priceRow}>
    {showOld && (
      <span className={styles.originalPrice}>
        ${Number(product.price).toLocaleString()}
      </span>
    )}
    <span className={`${styles.price} ${product.oferta ? styles.priceRed : ''}`}>
      ${finalPrice.toLocaleString()}
    </span>
  </div>
)}


        <p className={styles.description}>{product.description}</p>

        {isOutOfStock && <p className={styles.outOfStock}>Agotado</p>}

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.quoteButton} ${isOutOfStock ? styles.disabled : ""}`}
            onClick={handleAddToQuote}
            disabled={isOutOfStock}
          >
            Añadir a cotización
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

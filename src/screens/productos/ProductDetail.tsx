// src/views/screens/ProductDetail.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { mockProducts } from "../../domain/entities/mockProducts";
import type { Product } from "../../domain/entities/Product";
import defaultImage from "../../assets/ryc.svg";
import styles from "./ProductDetail.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

const ProductDetail: React.FC = () => {
  const { product_code } = useParams<{ product_code: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const sliderRef = useRef<Slider>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const prod = mockProducts.find((p) => p.product_code === product_code) || null;
    setProduct(prod);
  }, [product_code]);

  if (!product) return <p>Producto no encontrado.</p>;

  const getFinalPrice = (product: Product) => {
    if (product.discountPrice != null) return product.discountPrice;
    if (product.discountPercentage != null)
      return Math.round(product.price * (100 - product.discountPercentage) / 100);
    return product.price;
  };

  const handleThumbnailClick = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  // --- Funciones de zoom ---
  const handleImageZoom = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const img = e.currentTarget;
    const { left, top, width, height } = img.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = "scale(2)";
    img.style.transition = "transform 0.2s ease";
  };

  const resetImageZoom = (e?: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const img = e?.currentTarget || imageRef.current;
    if (!img) return;
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center";
    img.style.transition = "transform 0.2s ease";
  };

  const isOutOfStock = product.stock === 0;
  const hasMultipleImages = product.images.length > 1;

  const handleAddToQuote = () => {
    alert(`"${product.name}" Añadido a cotización ✅`);
  };

  return (
    <div className={styles.productDetail}>
      {/* Sección de imágenes */}
      <div className={styles.imageSection}>
        {hasMultipleImages ? (
          <>
            <Slider ref={sliderRef} {...sliderSettings} className={styles.slider}>
              {product.images.map((image, index) => (
                <div key={index}>
                  <img
                    ref={imageRef}
                    src={image || defaultImage}
                    alt={product.name}
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
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            ref={imageRef}
            src={product.images[0] || defaultImage}
            alt={product.name}
            className={styles.productImage}
            onMouseMove={handleImageZoom}
            onMouseLeave={resetImageZoom}
          />
        )}
      </div>

      {/* Sección de información */}
      <div className={styles.infoSection}>
        <h1>{product.name}</h1>
        <p><strong>Marca:</strong> {product.brand}</p>
        <p><strong>Categoría:</strong> {product.category}</p>
        <p className={styles.description}>{product.description}</p>

        {isOutOfStock && <p className={styles.outOfStock}>Agotado</p>}

        {/* Botón de cotización */}
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

import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { fetchProductByCode } from "../../presentation/ProductListViewModel";
import type { Product as APIProduct } from "../../domain/entities/Product";
import { CartContext } from "../../domain/entities/context/CartContext";
import type { CartProduct } from "../../domain/entities/context/CartContext";
import defaultImage from "../../assets/ryc.svg";
import styles from "./ProductDetail.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = { dots: false, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, arrows: true };

/** Extendemos localmente con campos opcionales que ahora puede traer el backend */
type UIProduct = APIProduct & {
  oem_code?: string | null;
  series?: string | null;
  voltage?: string | null;
  amp_rating?: number | null;
  watt_rating?: number | null;
  led_count?: number | null;
  kelvin?: number | null;
  beam_pattern?: string | null;
  lens_color?: string | null;
  attributes?: Record<string, any> | null;
};

const ProductDetail: React.FC = () => {
  const { product_code } = useParams<{ product_code: string }>();
  const [product, setProduct] = useState<UIProduct | null>(null);
  const sliderRef = useRef<Slider>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error("CartContext no encontrado. Asegúrate de envolver tu App con CartProvider.");
  }

  useEffect(() => {
    let active = true;
    (async () => {
      if (!product_code) return;
      try {
        const prod = await fetchProductByCode(product_code);
        if (active) setProduct(prod as UIProduct);
      } catch {
        if (active) setProduct(null);
      }
    })();
    return () => { active = false; };
  }, [product_code]);

  if (!product) return <p>Producto no encontrado.</p>;

  // Si no se puede calcular, devolvemos null (lo tratamos como "sin precio" en UI)
  const computeFinalPrice = (p: UIProduct): number | null => {
    if (!p.oferta) return null;
    if (typeof p.discountPrice === "number" && p.discountPrice > 0) return p.discountPrice;
    if (typeof p.discountPercentage === "number" && typeof p.price === "number" && p.price > 0)
      return Math.round((p.price * (100 - p.discountPercentage)) / 100);
    if (typeof p.price === "number" && p.price > 0) return p.price;
    return null;
  };

  const finalPrice = computeFinalPrice(product);
  const showOld =
    Boolean(product.oferta) &&
    typeof product.discountPercentage === "number" &&
    typeof product.price === "number" &&
    (product.price ?? 0) > 0 &&
    finalPrice !== null &&
    finalPrice < (product.price as number);

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

  const handleAddToQuote = () => {
    // 👉 Permitimos añadir aunque finalPrice sea null; lo normalizamos a 0
    const unitPrice = finalPrice ?? 0;
    const productToCart: CartProduct = {
      name: product.name,
      images: product.images?.length ? product.images : [defaultImage],
      product_code: product.product_code,
      quantity: 1,
      price: unitPrice,
    };
    cartContext.addToCart(productToCart);
  };

  /** Helpers para specs visibles */
  const isPresent = (v: unknown) =>
    v !== null && v !== undefined && !(typeof v === "string" && v.trim() === "");

  const fmt = (v: unknown, unit?: string) => {
    if (!isPresent(v)) return "";
    if (typeof v === "number") return `${v.toLocaleString()}${unit ?? ""}`;
    return `${v}${unit ?? ""}`;
  };

  const baseSpecs: Array<[string, string]> = ([
    ["Código / Modelo", fmt(product.product_code)],
    ["Serie", fmt(product.series)],
    ["P/N OEM", fmt(product.oem_code)],
    ["Voltaje", fmt(product.voltage)],
    ["Amperaje (A)", fmt(product.amp_rating, "")],
    ["Potencia (W)", fmt(product.watt_rating, "")],
    ["LEDs", fmt(product.led_count, "")],
    ["Temperatura de color (K)", fmt(product.kelvin, "")],
    ["Haz / Beam", fmt(product.beam_pattern)],
    ["Color lente", fmt(product.lens_color)],
  ] as [string, string][]).filter(([, value]) => isPresent(value));

  const extraSpecs: Array<[string, string]> = Object.entries(product.attributes ?? {})
    .filter(([, v]) => isPresent(v))
    .map(([k, v]) => {
      const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return [label, typeof v === "number" ? v.toLocaleString() : String(v)];
    });

  const visibleSpecs = [...baseSpecs, ...extraSpecs];

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
          crossOrigin="anonymous"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultImage;
          }}
        />
        )}
      </div>

      <div className={styles.infoSection}>
        <h1>{product.name}</h1>

        {/* Básicos */}
        {isPresent(product.brand) && <p><strong>Marca:</strong> {product.brand}</p>}
        {isPresent(product.category) && <p><strong>Categoría:</strong> {product.category}</p>}

        {/* Precio */}
        {finalPrice !== null && (
          <div className={styles.priceRow}>
            {showOld && (
              <span className={styles.originalPrice}>
                ${Number(product.price).toLocaleString()}
              </span>
            )}
            <span className={`${styles.price} ${product.oferta ? styles.priceRed : ""}`}>
              ${finalPrice.toLocaleString()}
            </span>
          </div>
        )}

        {/* Descripción */}
        {isPresent(product.description) && (
          <p className={styles.description}>{product.description}</p>
        )}

        {/* Especificaciones visibles */}
        {visibleSpecs.length > 0 && (
          <>
            <hr />
            <h3>Especificaciones</h3>
            <dl>
              {visibleSpecs.map(([label, value]) => (
                <div key={label}>
                  <dt><strong>{label}</strong></dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {/* Stock y acción */}
        {isOutOfStock && <p className={styles.outOfStock}>Agotado</p>}

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.quoteButton} ${isOutOfStock ? styles.disabled : ""}`}
            onClick={handleAddToQuote}
            disabled={isOutOfStock}
            title={finalPrice === null ? "Se añadirá con precio 0 (a confirmar)" : "Añadir a cotización"}
          >
            Añadir a cotización
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

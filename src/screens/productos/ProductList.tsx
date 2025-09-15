import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import fetchProductsByCategory from "../../presentation/ProductListViewModel";
import defaultImage from '../../assets/ryc.svg';
import Spinner from '../../components/layout/Spinner';
import type { Product } from '../../domain/entities/Product';
import styles from './ProductList.module.css';

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const categories = [
    'all',
    'alternadores',
    'motores',
    'baterias',
    'fusibles',
    'articulos_seguridad',
    'faroles_luminarias',
  ];

  // IMPORTANTE: respeta los labels actuales (ojo con "Delso")
  const brands = ["Niehoff","Delso","Delco Remy","Nikko","TDI","Bosch","Leece-Neville","Sawafuji","Prelub"];

  // Helper para mostrar bonito
  const categoryLabel = (c: string) => {
    const map: Record<string, string> = {
      all: 'Todas',
      alternadores: 'Alternadores',
      motores: 'Motores',
      baterias: 'Baterías',
      fusibles: 'Fusibles',
      articulos_seguridad: 'Artículos de seguridad',
      faroles_luminarias: 'Faroles/Luminarias',
    };
    return map[c] ?? c;
  };

  // Alias para aceptar Denso/Delso y otras variantes por query
  const brandAlias: Record<string, string> = {
    niehoff: "Niehoff",
    denso: "Delso", // si llega 'denso', lo mapeamos a 'Delso'
    delso: "Delso",
    "delco remy": "Delco Remy",
    nikko: "Nikko",
    tdi: "TDI",
    bosch: "Bosch",
    "leece-neville": "Leece-Neville",
    leeceneville: "Leece-Neville",
    sawafuji: "Sawafuji",
    prelub: "Prelub",
  };

  // Carga inicial
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductsByCategory("all");
        const activeProducts = data.filter(p => p.activated);
        setAllProducts(activeProducts);
        setProducts(activeProducts);
      } catch {
        setError('Error cargando productos.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Aplica filtros cuando cambian selections o la data
  useEffect(() => {
    let filtered = allProducts;
    if (!selectedCategories.includes("all")) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }
    setProducts(filtered);
  }, [selectedCategories, selectedBrands, allProducts]);

  // Bloquea scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Lee ?brand= o ?marca= de la URL y preselecciona
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = (params.get('brand') || params.get('marca') || "").trim();
    if (!raw) return;
    const normalized = raw.toLowerCase();
    const canonical = brandAlias[normalized];
    if (canonical && brands.includes(canonical)) {
      setSelectedBrands([canonical]); // mantenemos categorías en "all"
      setSelectedCategories(["all"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (value === "all") setSelectedCategories(checked ? ["all"] : []);
    else setSelectedCategories(prev => checked ? [...prev.filter(c => c!=="all"), value] : prev.filter(c=>c!==value));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedBrands(prev => checked ? [...prev, value] : prev.filter(b => b !== value));
  };

// Calcula el precio final SOLO si está en oferta y hay un valor > 0.
// Si no, retorna null (para no mostrar nada).
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

  if (loading) return <Spinner />;
  if (error) return <div className={styles.errorMsg}>{error}</div>;

  return (
    <div className={styles.container}>

      {/* Botón hamburguesa */}
      <button
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label={menuOpen ? "Cerrar filtros" : "Abrir filtros"}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <aside className={`${styles.filters} ${menuOpen ? styles.filtersOpen : ''}`}>
        <h2>Filtros</h2>

        <h3>Categorías</h3>
        {categories.map(cat => (
          <label key={cat} className={styles.filterOption}>
            {categoryLabel(cat)}
            <input
              type="checkbox"
              value={cat}
              checked={selectedCategories.includes(cat)}
              onChange={handleCategoryChange}
            />
          </label>
        ))}

        <h3>Marcas</h3>
        {brands.map(brand => (
          <label key={brand} className={styles.filterOption}>
            {brand}
            <input
              type="checkbox"
              value={brand}
              checked={selectedBrands.includes(brand)}
              onChange={handleBrandChange}
            />
          </label>
        ))}
      </aside>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayVisible : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Productos */}
      <main className={styles.products}>
        <h1>Productos</h1>

        <div className={styles.productGrid}>
          {products.length === 0 && <p>No hay productos disponibles.</p>}

{products.map(product => {
  const onSale = Boolean(product.oferta);
  const finalPrice = computeFinalPrice(product);

  // Mostrar tachado SOLO si hay descuento porcentual y precio base > 0 y el final es menor
  const showOld =
    onSale &&
    typeof product.discountPercentage === "number" &&
    typeof product.price === "number" &&
    product.price > 0 &&
    finalPrice !== null &&
    finalPrice < product.price;
  return (
    <div
      key={product.product_code}
      className={`${styles.productCard} ${onSale ? styles.onSale : ''}`}
      onClick={() => navigate(`/productos/${product.product_code}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/productos/${product.product_code}`); }}
      aria-label={`Ver ${product.name}`}
    >
      {onSale && <span className={styles.offerBadge}>OFERTA</span>}

      <img
        src={(product.images && product.images[0]) || defaultImage}
        alt={product.name}
        className={styles.productImage}
        loading="lazy"
      />

      <h3 className={styles.productName}>{product.name}</h3>
      <p className={styles.category}>{categoryLabel(product.category)}</p>
      <p className={styles.brand}>{product.brand}</p>

      {/* Precio: solo si hay oferta y finalPrice válido */}
      {finalPrice !== null && (
        <div className={styles.priceWrapper}>
          {showOld && (
            <span className={styles.originalPrice}>
              ${Number(product.price).toLocaleString()}
            </span>
          )}
          <span className={`${styles.price} ${onSale ? styles.priceRed : ''}`}>
            ${finalPrice.toLocaleString()}
          </span>
        </div>
      )}

      <div className={styles.cardActions}>
        <button
          type="button"
          className={`${styles.addToQuoteBtn} ${styles.isDisabled}`}
          title="Pronto podrás añadir a tu cotizado"
          aria-disabled="true"
          disabled
          onClick={(e) => e.stopPropagation()}
        >
          añadir al cotizado
        </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProductListPage;

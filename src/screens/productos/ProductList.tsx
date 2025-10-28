import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProducts } from "../../presentation/ProductListViewModel";
import defaultImage from '../../assets/ryc.svg';
import Spinner from '../../components/layout/Spinner';
import type { Product } from '../../domain/entities/Product';
import styles from './ProductList.module.css';
import HeroBrand from '../../components/HeroBrand/HeroBrand';

// 👉 Cart
import { CartContext } from "../../domain/entities/context/CartContext";
import type { CartProduct } from "../../domain/entities/context/CartContext";

type CategoryKey =
  | 'all'
  | 'alternadores'
  | 'motores'
  | 'baterias'
  | 'fusibles'
  | 'articulos_seguridad'
  | 'faroles_luminarias';

const categories: CategoryKey[] = [
  'all',
  'alternadores',
  'motores',
  'baterias',
  'fusibles',
  'articulos_seguridad',
  'faroles_luminarias',
];

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

// =============== Helpers ===============
const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\/\s]+/g, "_")
    .trim();

const toCanonCategory = (raw?: string): CategoryKey | 'all' => {
  const alias: Record<string, CategoryKey> = {
    seguridad: 'articulos_seguridad',
    articulos_seguridad: 'articulos_seguridad',
    faroles: 'faroles_luminarias',
    accesorios: 'articulos_seguridad',
  };
  const n = normalize(raw || "");
  const c = (alias as any)[n] ?? n;
  return (categories as readonly string[]).includes(c) ? (c as CategoryKey) : 'all';
};

// Marca → key robusta (para comparar/filtrar de forma estable)
const brandKey = (raw?: string) =>
  (raw || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");

// key → etiqueta visible
const BRAND_LABEL: Record<string, string> = {
  niehoff: 'Niehoff',
  delcoremy: 'Delco Remy',
  denso: 'Denso',
  segbosch: 'SEG (Bosch)',
  nikko: 'Nikko',
  americansuperior: 'American Superior',
  rc: 'R&C',
  peterson: 'Peterson',
  neolite: 'Neolite',
  syfco: 'Syfco',
  bussmann: 'Bussmann',
};

// alias de URL → key
const BRAND_ALIAS_TO_KEY: Record<string, string> = {
  niehoff: 'niehoff',
  denso: 'denso',
  delso: 'denso',
  'delco remy': 'delcoremy',
  delcoremy: 'delcoremy',
  nikko: 'nikko',
  seg: 'segbosch',
  'seg (bosch)': 'segbosch',
  'seg-bosch': 'segbosch',
  bosch: 'segbosch',
  'american superior': 'americansuperior',
  american: 'americansuperior',
  'r&c': 'rc',
  'r c': 'rc',
  ryc: 'rc',
  peterson: 'peterson',
  neolite: 'neolite',
  syfco: 'syfco',
  bussmann: 'bussmann',
};
// ======================================

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Cart
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error("CartContext no encontrado. Asegúrate de envolver tu App con CartProvider.");
  }

  // Productos “activos” crudos (sin filtrar por marca) y productos visibles (filtrados por marca)
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [selectedBrandKeys, setSelectedBrandKeys] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // URL → estado inicial
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const validCategory = toCanonCategory((params.get('category') || '').trim());

    const rawBrand = (params.get('brand') || params.get('marca') || '').trim().toLowerCase();
    const urlBrandKey = BRAND_ALIAS_TO_KEY[rawBrand] ?? brandKey(rawBrand);

    setSelectedCategory(validCategory);
    setSelectedBrandKeys(urlBrandKey ? [urlBrandKey] : []);
  }, [location.search]);

  // FETCH (backend) al cambiar categoría o marcas (filtramos marca también en cliente para robustez)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Si tu backend soporta brandKeys, déjalo; igual filtramos en cliente
        const data = await fetchProducts({
          category: selectedCategory,
          brandKeys: selectedBrandKeys,
        });

        const active = data.filter(p => p.activated);

        if (!alive) return;

        // Guardamos los activos SIN filtrar por marca
        setRawProducts(active);

        // Aplicamos filtro por marca en cliente (OR)
        const filtered =
          selectedBrandKeys.length === 0
            ? active
            : active.filter(p => selectedBrandKeys.includes(brandKey(p.brand)));

        setProducts(filtered);
      } catch {
        if (!alive) return;
        setError('Error cargando productos.');
        setProducts([]);
        setRawProducts([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [selectedCategory, selectedBrandKeys]);

  // Marcas disponibles (desde rawProducts para no “perder” opciones al filtrar)
  const availableBrands = useMemo(() => {
    const byKey = new Map<string, string>();
    rawProducts.forEach(p => {
      const key = brandKey(p.brand);
      if (!key) return;
      const label = BRAND_LABEL[key] ?? (p.brand || '').trim();
      if (!byKey.has(key)) byKey.set(key, label);
    });
    return Array.from(byKey.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [rawProducts]);

  // Hero por marca (solo si hay 1 marca seleccionada)
  const heroBrandKey = selectedBrandKeys.length === 1 ? selectedBrandKeys[0] : undefined;
  const heroBrandLabel =
    heroBrandKey
      ? (availableBrands.find(b => b.key === heroBrandKey)?.label
          ?? BRAND_LABEL[heroBrandKey]
          ?? heroBrandKey.toUpperCase())
      : undefined;

  // Handlers
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const v = value as CategoryKey;
    if (!checked) {
      if (v === selectedCategory) setSelectedCategory('all');
      return;
    }
    setSelectedCategory(v);
    setSelectedBrandKeys([]); // limpiar marcas al cambiar de categoría
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target; // value = brandKey
    setSelectedBrandKeys(prev => checked ? [...prev, value] : prev.filter(k => k !== value));
  };

  const computeFinalPrice = (p: Product): number | null => {
    if (!p.oferta) return null;
    if (typeof p.discountPrice === "number" && p.discountPrice > 0) return p.discountPrice;
    if (typeof p.discountPercentage === "number" && typeof p.price === "number" && p.price > 0)
      return Math.round((p.price * (100 - p.discountPercentage)) / 100);
    if (typeof p.price === "number" && p.price > 0) return p.price;
    return null;
  };

  const handleAddToQuote = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation(); // evita navegar a la ficha
    const unitPrice = computeFinalPrice(p) ?? 0; // permite 0 si no hay precio (como en ProductDetail)
    const item: CartProduct = {
      name: p.name,
      images: p.images?.length ? p.images : [defaultImage],
      product_code: p.product_code,
      quantity: 1,
      price: unitPrice,
    };
    cartContext.addToCart(item);
  };

  if (loading) return <Spinner />;
  if (error) return <div className={styles.errorMsg}>{error}</div>;

  return (
    <>
      {/* HERO SIEMPRE ARRIBA DE TODO */}
      {heroBrandKey && (
        <HeroBrand brandKey={heroBrandKey} label={heroBrandLabel} />
      )}

      {/* Contenedor con filtros + grid de productos */}
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
                checked={selectedCategory === cat}
                onChange={handleCategoryChange}
              />
            </label>
          ))}

          <h3>Marcas</h3>
          {availableBrands.length === 0 ? (
            <p className={styles.mutedSmall}>Sin marcas para esta selección</p>
          ) : (
            availableBrands.map(({ key, label }) => (
              <label key={key} className={styles.filterOption}>
                {label}
                <input
                  type="checkbox"
                  value={key}
                  checked={selectedBrandKeys.includes(key)}
                  onChange={handleBrandChange}
                />
              </label>
            ))
          )}
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
              const showOld =
                onSale &&
                typeof product.discountPercentage === "number" &&
                typeof product.price === "number" &&
                (product.price ?? 0) > 0 &&
                finalPrice !== null &&
                finalPrice < (product.price as number);

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
                  <p className={styles.brand}>{BRAND_LABEL[brandKey(product.brand)] ?? product.brand}</p>

                  {/* Precio: solo si existe (sin fallback) */}
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
                      className={styles.addToQuoteBtn} // azul activo (CSS)
                      title={finalPrice === null ? "Se añadirá con precio 0 (a confirmar)" : "Añadir a cotización"}
                      onClick={(e) => handleAddToQuote(e, product)}
                    >
                      Añadir a cotización
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductListPage;

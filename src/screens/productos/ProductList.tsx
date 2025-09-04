import React, { useState, useEffect } from 'react';
import fetchProductsByCategory from "../../presentation/ProductListViewModel";
import defaultImage from '../../assets/JoyeriaVivianLogo2.jpg';
import Spinner from '../../components/layout/Spinner';
import type { Product } from '../../domain/entities/Product';
import styles from './ProductList.module.css';

const ProductListPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // estado del sidebar

  const categories = ['all', 'alternador', 'motor', 'luces'];
  const brands = [
    "Niehoff",
    "Delso",
    "Delco Remy",
    "Nikko",
    "TDI",
    "Bosch",
    "Leece-Neville",
    "Sawafuji",
    "Prelub",
  ];

  // Carga inicial (solo una vez)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductsByCategory("all");
        setAllProducts(data.filter(p => p.activated));
        setProducts(data.filter(p => p.activated));
      } catch {
        setError('Error cargando productos.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filtrado en frontend (categorías + marcas)
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

  // Bloquear scroll del body cuando el menú está abierto (UX)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (value === "all") {
      setSelectedCategories(checked ? ["all"] : []);
    } else {
      setSelectedCategories(prev => {
        const filtered = prev.filter(c => c !== "all");
        return checked ? [...filtered, value] : filtered.filter(c => c !== value);
      });
    }

    if (window.innerWidth <= 900) {
      setMenuOpen(false);
    }
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedBrands(prev =>
      checked ? [...prev, value] : prev.filter(b => b !== value)
    );

    if (window.innerWidth <= 900) {
      setMenuOpen(false);
    }
  };

  const getFinalPrice = (product: Product) => {
    if (product.discountPrice != null) return product.discountPrice;
    if (product.discountPercentage != null) {
      return Math.round(product.price * (100 - product.discountPercentage) / 100);
    }
    return product.price;
  };

  if (loading) return <Spinner />;
  if (error) return <div className={styles.errorMsg}>{error}</div>;

  return (
    <div className={styles.container}>
      {/* Botón hamburguesa (solo visible en mobile por CSS) */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label={menuOpen ? "Cerrar filtros" : "Abrir filtros"}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`${styles.filters} ${menuOpen ? styles.filtersOpen : ''}`}>
        <h2>Filtros</h2>

        {/* Categorías */}
        <h3>Categorías</h3>
        {categories.map(cat => (
          <label key={cat} className={styles.filterOption}>
            {cat === 'all' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            <input
              type="checkbox"
              value={cat}
              checked={selectedCategories.includes(cat)}
              onChange={handleCategoryChange}
            />
          </label>
        ))}

        {/* Marcas */}
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
        role="button"
        aria-hidden={!menuOpen}
      />

      {/* Productos */}
      <main className={styles.products}>
        <h1>Productos</h1>

        <div className={styles.productGrid}>
          {products.length === 0 && <p>No hay productos disponibles.</p>}

          {products.map(product => (
            <div key={product.product_code} className={styles.productCard}>
              <img
                src={product.images[0] || defaultImage}
                alt={product.name}
                className={styles.productImage}
              />

              <h3>{product.name}</h3>
              <p className={styles.category}>{product.category}</p>
              <p className={styles.brand}>{product.brand}</p>

              {product.discountPrice || product.discountPercentage ? (
                <div className={styles.priceWrapper}>
                  <span className={styles.originalPrice}>
                    ${product.price.toLocaleString()} CLP
                  </span>
                  <span className={styles.discountedPrice}>
                    ${getFinalPrice(product).toLocaleString()} CLP
                  </span>
                </div>
              ) : (
                <p className={styles.price}>
                  ${product.price.toLocaleString()} CLP
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductListPage;

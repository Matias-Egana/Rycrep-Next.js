"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AddToQuoteButton } from "@/components/site/products/add-to-quote-button";
import type { CatalogProduct } from "@/lib/next-catalog";

type CatalogBrowserProps = {
  products: CatalogProduct[];
  total: number;
  currentPage: number;
  pageSize: number;
  selectedCategory: string;
  selectedBrand: string;
  search: string;
};

const categories = [
  { value: "all", label: "Todas" },
  { value: "alternadores", label: "Alternadores" },
  { value: "motores", label: "Motores" },
  { value: "baterias", label: "Baterias" },
  { value: "fusibles", label: "Fusibles" },
  { value: "articulos_seguridad", label: "Seguridad" },
  { value: "faroles_luminarias", label: "Luminaria" },
];

const brands = [
  { value: "all", label: "Todas las marcas" },
  { value: "Niehoff", label: "Niehoff" },
  { value: "Nikko", label: "Nikko" },
  { value: "Delco Remy", label: "Delco Remy" },
  { value: "Denso", label: "Denso" },
  { value: "bosch", label: "SEG (Bosch)" },
  { value: "Bussmann", label: "Bussmann" },
  { value: "TDI", label: "TDI" },
  { value: "Leece-Neville", label: "Leece-Neville" },
  { value: "Sawafuji", label: "Sawafuji" },
  { value: "Prelub", label: "Prelub" },
  { value: "R&C", label: "R&C" },
];

function buildHref({
  pathname,
  searchParams,
  page,
  category,
  brand,
}: {
  pathname: string;
  searchParams: URLSearchParams;
  page?: number;
  category?: string;
  brand?: string;
}) {
  const params = new URLSearchParams(searchParams.toString());
  if (typeof page === "number") params.set("page", String(page));
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (category && category === "all") params.delete("category");
  if (brand && brand === "all") params.delete("brand");
  if (page === 1) params.delete("page");
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function CatalogBrowser({
  products,
  total,
  currentPage,
  pageSize,
  selectedCategory,
  selectedBrand,
  search,
}: CatalogBrowserProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const active = (selectedCategory || "all") === category.value;
          return (
            <Link
              key={category.value}
              href={buildHref({
                pathname,
                searchParams: new URLSearchParams(searchParams.toString()),
                page: 1,
                category: category.value,
                brand: selectedBrand,
              })}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                active
                  ? "bg-[#d62839] text-white shadow-[0_10px_20px_rgba(214,40,57,0.16)]"
                  : "border border-slate-200 bg-white text-[#263160] hover:border-[#d62839]"
              }`}
            >
              {category.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        {brands.map((brand) => {
          const active = (selectedBrand || "all") === brand.value;
          return (
            <Link
              key={brand.value}
              href={buildHref({
                pathname,
                searchParams: new URLSearchParams(searchParams.toString()),
                page: 1,
                category: selectedCategory,
                brand: brand.value,
              })}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                active
                  ? "bg-[#263160] text-white shadow-[0_10px_20px_rgba(38,49,96,0.16)]"
                  : "border border-slate-200 bg-white text-[#263160] hover:border-[#263160]"
              }`}
            >
              {brand.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#d62839]">Catalogo</p>
          <p className="mt-1 text-[1rem] text-[#475569]">
            Mostrando {products.length} de {total} productos
            {selectedCategory !== "all" ? ` en ${selectedCategory}` : ""}
            {selectedBrand !== "all" ? ` de ${selectedBrand}` : ""}.
          </p>
        </div>
        <div className="text-sm text-[#64748b]">Paginacion activa: 10 productos por pagina.</div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-[#475569] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          No encontramos productos para esta categoria{search ? ` o busqueda "${search}"` : ""}.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={`${product.id}-${product.code}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1"
              style={{ transitionDelay: `${index * 35}ms` }}
            >
              <Link href={`/productos/${product.code}`} className="block">
                <div className="overflow-hidden rounded-[18px] bg-slate-100">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-48 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-slate-100 text-sm font-medium text-slate-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#263160]">
                      {product.category}
                    </span>
                    {product.oferta ? (
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#d62839]">
                        Oferta
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 line-clamp-2 text-lg font-extrabold leading-7 text-[#111827]">{product.name}</h2>
                  <p className="mt-2 text-sm font-medium text-[#64748b]">{product.brand}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#475569]">
                    {product.description || "Consulta por disponibilidad y especificacion tecnica."}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Codigo</p>
                      <p className="text-sm font-semibold text-[#111827]">{product.code}</p>
                    </div>
                    {product.price !== null ? (
                      <p className="text-base font-extrabold text-[#d62839]">${product.price.toLocaleString()}</p>
                    ) : (
                      <p className="text-sm font-semibold text-[#263160]">Cotizar</p>
                    )}
                  </div>
                </div>
              </Link>

              <div className="mt-4 flex flex-wrap gap-3">
                <AddToQuoteButton
                  product={product}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#d62839] px-4 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(214,40,57,0.16)] transition hover:-translate-y-0.5 hover:bg-[#b61f2f]"
                />
                <Link
                  href={`/productos/${product.code}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-[#263160] transition hover:border-[#d62839] hover:text-[#d62839]"
                >
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={buildHref({
            pathname,
            searchParams: new URLSearchParams(searchParams.toString()),
            page: Math.max(1, currentPage - 1),
            brand: selectedBrand,
          })}
          aria-disabled={currentPage <= 1}
          className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
            currentPage <= 1
              ? "pointer-events-none border border-slate-200 bg-slate-100 text-slate-400"
              : "bg-[#263160] text-white hover:-translate-y-0.5"
          }`}
        >
          Anterior
        </Link>

        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
          .map((page, index, arr) => (
            <div key={page} className="flex items-center gap-3">
              {index > 0 && arr[index - 1] !== page - 1 ? <span className="text-slate-400">...</span> : null}
              <Link
                href={buildHref({
                  pathname,
                  searchParams: new URLSearchParams(searchParams.toString()),
                  page,
                  brand: selectedBrand,
                })}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  page === currentPage
                    ? "bg-[#d62839] text-white shadow-[0_10px_20px_rgba(214,40,57,0.16)]"
                    : "border border-slate-200 bg-white text-[#263160] hover:border-[#d62839]"
                }`}
              >
                {page}
              </Link>
            </div>
          ))}

        <Link
          href={buildHref({
            pathname,
            searchParams: new URLSearchParams(searchParams.toString()),
            page: Math.min(totalPages, currentPage + 1),
            brand: selectedBrand,
          })}
          aria-disabled={currentPage >= totalPages}
          className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
            currentPage >= totalPages
              ? "pointer-events-none border border-slate-200 bg-slate-100 text-slate-400"
              : "bg-[#263160] text-white hover:-translate-y-0.5"
          }`}
        >
          Siguiente
        </Link>
      </div>
    </div>
  );
}

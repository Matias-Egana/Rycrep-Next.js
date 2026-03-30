import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToQuoteButton } from "@/components/site/products/add-to-quote-button";
import { ProductImageZoom } from "@/components/site/products/product-image-zoom";
import { fetchCatalogProduct } from "@/lib/next-catalog";

type ProductDetailPageProps = {
  params: Promise<{ product_code: string }>;
};

function formatPrice(value: number) {
  return value.toLocaleString("es-CL");
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { product_code } = await params;
  const product = await fetchCatalogProduct(product_code);

  if (!product) notFound();

  return (
    <div className="bg-[#f4f6fb] px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-6">
          <ProductImageZoom src={product.imageUrl} alt={product.name} />
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#263160]">
              {product.category}
            </span>
            {product.oferta ? (
              <span className="rounded-full bg-rose-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#d62839]">
                Oferta
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-[#111827]">{product.name}</h1>
          <div className="mt-4 space-y-2 text-[1rem] leading-8 text-[#475569]">
            <p>
              <strong className="text-[#111827]">Marca:</strong> {product.brand}
            </p>
            <p>
              <strong className="text-[#111827]">Codigo:</strong> {product.code}
            </p>
          </div>

          <div className="mt-6">
            {product.price !== null ? (
              <p className="text-3xl font-extrabold text-[#d62839]">${formatPrice(product.price)}</p>
            ) : (
              <p className="text-xl font-bold text-[#263160]">Precio a consultar</p>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-[1rem] leading-8 text-[#475569]">
              {product.description || "Consulta disponibilidad, compatibilidad y tiempos de entrega con nuestro equipo comercial."}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <AddToQuoteButton
              product={product}
              className="rounded-xl bg-[#d62839] px-6 py-3 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(214,40,57,0.18)] transition hover:-translate-y-0.5 hover:bg-[#20284e]"
              label="Agregar a cotizacion"
            />
            <Link
              href="/cotizacion"
              className="rounded-xl border border-[#d62839] bg-white px-6 py-3 text-base font-extrabold text-[#d62839] transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Ver carrito de cotizacion
            </Link>
            <Link
              href="/contacto"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-extrabold text-[#263160] transition hover:-translate-y-0.5 hover:border-[#d62839]"
            >
              Hablar con especialista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { readStoredCart, useCart, type CartProduct } from "@/components/site/cart-context";

type QuoteFormState = {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  empresa: string;
  ciudad: string;
  region: string;
  mensaje: string;
};

const regions = [
  "Arica y Parinacota",
  "Tarapaca",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaiso",
  "Metropolitana de Santiago",
  "O'Higgins",
  "Maule",
  "Nuble",
  "Biobio",
  "La Araucania",
  "Los Rios",
  "Los Lagos",
  "Aysen",
  "Magallanes",
];

const initialForm: QuoteFormState = {
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  empresa: "",
  ciudad: "",
  region: "",
  mensaje: "",
};

function parseNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function QuoteRequestForm() {
  const { cart, clearCart, removeFromCart, updateQuantity } = useCart();
  const [formData, setFormData] = useState<QuoteFormState>(initialForm);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const cartSource = useMemo<CartProduct[]>(
    () => (cart.length > 0 ? cart : readStoredCart()),
    [cart],
  );

  const effectiveCartProducts = useMemo(
    () =>
      cartSource.map((item) => ({
        name: item.name,
        product_code: item.product_code,
        quantity: Math.max(1, parseNumber(item.quantity) || 1),
        price: 0,
      })),
    [cartSource],
  );

  const totalItems = effectiveCartProducts.reduce((acc, item) => acc + item.quantity, 0);

  function updateForm(name: keyof QuoteFormState, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const sanitizedForm = {
      ...formData,
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      empresa: formData.empresa.trim(),
      ciudad: formData.ciudad.trim(),
      region: formData.region.trim(),
      mensaje: formData.mensaje.trim(),
    };

    if (effectiveCartProducts.length === 0) {
      setStatus({
        type: "error",
        message: "Tu carrito de cotizacion esta vacio. Agrega al menos un producto antes de enviar.",
      });
      return;
    }

    if (sanitizedForm.nombre.length < 2 || sanitizedForm.apellidos.length < 2) {
      setStatus({
        type: "error",
        message: "Ingresa tu nombre y apellidos con al menos 2 caracteres.",
      });
      return;
    }

    const phoneDigits = sanitizedForm.telefono.replace(/\D+/g, "");
    if (phoneDigits.length < 8) {
      setStatus({
        type: "error",
        message: "Ingresa un telefono valido, idealmente con al menos 8 digitos.",
      });
      return;
    }

    if (sanitizedForm.mensaje.length < 8) {
      setStatus({
        type: "error",
        message: "Describe un poco mas tu solicitud para que la cotizacion pueda procesarse correctamente.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userData: sanitizedForm,
            productos: effectiveCartProducts,
            items: effectiveCartProducts,
          }),
        });

        if (!response.ok) {
          const errorJson = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(errorJson?.message || "No fue posible enviar la cotizacion.");
        }

        setFormData(initialForm);
        clearCart();
        setStatus({
          type: "success",
          message: "Solicitud enviada correctamente. Recibimos tus productos y el equipo comercial te contactara pronto.",
        });
      } catch (error) {
        console.error(error);
        setStatus({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Ocurrio un problema al enviar la cotizacion. Intenta nuevamente en unos minutos.",
        });
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <form
        className="rounded-[24px] border border-white/10 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-[#111827]">Solicita tu cotizacion</h2>
        <p className="mt-3 text-[1rem] leading-7 text-[#475569]">
          Completa tus datos y envia directamente los productos guardados en tu carrito de cotizacion. Mantuvimos la UX del flujo anterior, pero con una presentacion mas clara y profesional.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#d62839]" placeholder="Nombre" value={formData.nombre} onChange={(e) => updateForm("nombre", e.target.value)} required />
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#d62839]" placeholder="Apellidos" value={formData.apellidos} onChange={(e) => updateForm("apellidos", e.target.value)} required />
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#d62839] sm:col-span-2" type="email" placeholder="Correo electronico" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} required />
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#d62839]" placeholder="Telefono" value={formData.telefono} onChange={(e) => updateForm("telefono", e.target.value)} required />
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#d62839]" placeholder="Empresa" value={formData.empresa} onChange={(e) => updateForm("empresa", e.target.value)} />
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#d62839]" placeholder="Ciudad" value={formData.ciudad} onChange={(e) => updateForm("ciudad", e.target.value)} />
          <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#d62839]" value={formData.region} onChange={(e) => updateForm("region", e.target.value)}>
            <option value="">Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <textarea className="min-h-36 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#d62839] sm:col-span-2" placeholder="Mensaje adicional, plazos, faena, equipo o condiciones tecnicas." value={formData.mensaje} onChange={(e) => updateForm("mensaje", e.target.value)} required />
        </div>

        <button type="submit" className="mt-6 rounded-xl bg-[#d62839] px-6 py-3 text-base font-bold text-white shadow-[0_14px_28px_rgba(214,40,57,0.18)] transition hover:-translate-y-0.5 hover:bg-[#20284e]" disabled={isPending}>
          {isPending ? "Enviando..." : "Solicitar Cotizacion"}
        </button>

        {status ? (
          <p className={`mt-4 text-sm ${status.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>{status.message}</p>
        ) : null}
      </form>

      <div className="rounded-[24px] border border-white/10 bg-[#263160] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.14)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/60">Carrito de cotizacion</p>
            <h3 className="mt-2 text-2xl font-bold">Productos seleccionados</h3>
            <p className="mt-2 text-sm leading-7 text-white/75">
              Aqui veras exactamente los productos que se enviaran por correo al solicitar la cotizacion.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.14em] text-white/55">Total items</p>
            <p className="mt-1 text-2xl font-extrabold">{totalItems}</p>
          </div>
        </div>

        {effectiveCartProducts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-10 text-center">
            <p className="text-lg font-semibold">Tu carrito esta vacio.</p>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Explora el catalogo, agrega productos y luego vuelve para enviar la solicitud.
            </p>
            <Link href="/productos" className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#263160] transition hover:-translate-y-0.5">
              Ir a productos
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              {cartSource.map((product, index) => (
                <div
                  key={`${product.product_code}-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-white/20 hover:bg-white/8"
                >
                  <div className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/10">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white/55">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-bold leading-6 text-white">{product.name}</h4>
                          <p className="mt-1 text-sm text-white/70">Codigo: {product.product_code}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.product_code)}
                          className="text-sm font-semibold text-rose-200 transition hover:text-white"
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <label className="text-sm font-medium text-white/75">Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => updateQuantity(product.product_code, Number(e.target.value))}
                          className="w-24 rounded-xl border border-white/10 bg-white px-4 py-2 text-[#111827] outline-none transition focus:border-[#d62839]"
                        />
                        <div className="text-sm text-white/60">
                          {product.price > 0 ? `Referencia: $${product.price.toLocaleString()}` : "Precio a consultar"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-sm leading-7 text-white/75">
                Al enviar, se compartiran estos productos junto con tus datos para preparar la cotizacion.
              </p>
              <button
                type="button"
                onClick={clearCart}
                className="rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

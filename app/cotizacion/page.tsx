import { AnimateOnView } from "@/components/site/animate-on-view";
import { QuoteRequestForm } from "@/components/site/quote-request-form";

export default function CotizacionPage() {
  return (
    <div className="bg-[#263160] px-4 py-14 sm:px-6">
      <div className="mx-auto w-full max-w-[1240px]">
        <AnimateOnView className="mb-8 text-center text-white">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Cotizacion</h1>
          <p className="mx-auto mt-4 max-w-4xl text-[1.04rem] leading-8 text-white/75">
            Completa tus datos, revisa los productos guardados en tu carrito de cotizacion y envia tu solicitud. Nuestro equipo comercial recibira el detalle directamente para responderte mas rapido.
          </p>
        </AnimateOnView>
        <AnimateOnView delayMs={100}>
          <QuoteRequestForm />
        </AnimateOnView>
      </div>
    </div>
  );
}

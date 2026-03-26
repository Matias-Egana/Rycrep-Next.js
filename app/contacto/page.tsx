import { AnimateOnView } from "@/components/site/animate-on-view";
import { ContactForm } from "@/components/site/contact-form";

export default function ContactoPage() {
  return (
    <div className="bg-[#263160] px-4 py-14 sm:px-6">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-[1fr_0.95fr]">
        <AnimateOnView>
          <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-8">
            <h1 className="text-4xl font-extrabold text-[#111827] sm:text-5xl">¿Cómo podemos ayudarte?</h1>
            <p className="mt-4 text-[1.04rem] leading-8 text-[#475569]">
              ¿Buscas un producto específico? ¿Necesitas una cotización? Completa el formulario y conversemos.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </AnimateOnView>

        <div className="grid gap-6">
          <AnimateOnView delayMs={80}>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-white backdrop-blur">
              <h2 className="text-2xl font-extrabold">Contacto directo</h2>
              <div className="mt-5 space-y-3 text-[1rem] leading-8 text-white/80">
                <p><strong className="text-white">Dirección:</strong> El Oro 7956, Barrio Industrial, Antofagasta</p>
                <p><strong className="text-white">Correo:</strong> ventas@rycrep.cl</p>
                <p><strong className="text-white">Teléfono:</strong> +56 9 5199 2909</p>
                <p><strong className="text-white">Horario:</strong> Atención comercial y técnica coordinada.</p>
              </div>
            </div>
          </AnimateOnView>

          <AnimateOnView delayMs={160}>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <iframe
                title="Ubicación Antofagasta"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.616082058979!2d-70.3988129244794!3d-23.65274776303859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96ae2e0c9d9e7e3f%3A0x3f9f7c2c7e1e6e6e!2sEl%20Oro%207956%2C%20Antofagasta%2C%20Chile!5e0!3m2!1ses-419!2scl!4v1693512345678"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "540px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </AnimateOnView>
        </div>
      </div>
    </div>
  );
}

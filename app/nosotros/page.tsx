import Image from "next/image";
import Link from "next/link";
import { AnimateOnView } from "@/components/site/animate-on-view";
import portadaImage from "@/src/assets/nosotros/portada.webp";
import ceoImage from "@/src/assets/nosotros/ceo2.webp";

const intro =
  "Somos una empresa dedicada a las ventas técnicas, soporte técnico especializado, mantenimiento y reparación de equipos electromecánicos. Nuestro propósito es brindar soluciones rápidas y confiables para la minería, industria y transporte, con foco en disponibilidad operacional y continuidad de servicio.";

const valueCards = [
  {
    title: "Representaciones y suministro",
    body:
      "Integramos marcas de prestigio en alternadores, motores de arranque, implementos de seguridad y soluciones eléctricas. Destacamos a C.E. Niehoff & Co., Delco Remy y Eaton Bussmann entre nuestras principales representadas.",
  },
  {
    title: "Mantenimiento y diagnóstico",
    body:
      "Trabajamos en taller y terreno con mantenimiento preventivo, correctivo, overhaul y pruebas funcionales, buscando minimizar detenciones no programadas.",
  },
  {
    title: "Ingeniería aplicada",
    body:
      "Apoyamos especificación, compatibilidad electromecánica, dimensionamiento de sistemas de carga y capacitación de equipos de mantenimiento.",
  },
];

const missionItems = [
  "Ofrecer servicios de alta calidad en el menor plazo, satisfacer a plenitud los requerimientos y superar expectativas, forjando relaciones comerciales de largo plazo.",
  "Trabajar con un equipo multidisciplinario, un ambiente seguro y cumplimiento de leyes y normas, apoyados por tecnología de vanguardia.",
  "Impulsar mejora continua y certificación en Calidad, Medio Ambiente y Seguridad y Salud Ocupacional como sello de seriedad.",
];

const visionItems = [
  "Ser los mejores representantes de productos, con servicios integrales y formulación de proyectos industriales a nivel nacional e internacional.",
  "Responder a las necesidades de nuestros clientes desarrollando proyectos basados en confiabilidad y tecnología aplicada, construyendo una identificación genuina con cada uno.",
];

const timeline = [
  {
    year: "1982",
    title: "Inicio de representaciones",
    body: "Comenzamos la representación y distribución de productos eléctricos para movimiento de tierra y transporte.",
  },
  {
    year: "1987",
    title: "Servicios de mantenimiento",
    body: "Overhaul y mantenimiento de generadores, torres de iluminación, soldadoras, motores de partida y alternadores 12/24V.",
  },
  {
    year: "2005",
    title: "Certificaciones y alianzas",
    body: "Se consolidan certificaciones ISO 9001, ISO 14001 e ISO 18000, junto con alianzas con marcas tecnológicas de clase mundial y la figura de Centro Autorizado de Servicio.",
  },
  {
    year: "2008",
    title: "Servicio electrónico industrial",
    body: "Sumamos reparación y diseño de tarjetas industriales, SCADA/DCS y módulos inteligentes con soporte especializado.",
  },
  {
    year: "2009",
    title: "Sala de carga de baterías",
    body: "Acondicionamiento integral conforme a normas para operación segura y eficiente, con sistema de carga simultánea implementado hoy en compañías mineras entre la I y IV Región.",
    featured: true,
  },
  {
    year: "2018",
    title: "Laboratorio de inyección diésel",
    body: "Se consolida el laboratorio de inyección diésel con soporte técnico especializado para pruebas y calibración.",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-[#263160] px-6 py-5 text-center">
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{children}</h2>
    </div>
  );
}

function BulletText({ text }: { text: string }) {
  return (
    <div className="mx-auto flex w-full max-w-[1120px] items-start gap-4 px-4 py-2 sm:px-6">
      <span className="mt-1 text-2xl font-bold text-[#d62839]">→</span>
      <p className="text-left text-[1.03rem] leading-8 text-[#334155] sm:text-[1.08rem]">{text}</p>
    </div>
  );
}

export default function NosotrosPage() {
  return (
    <div className="bg-[#f4f6fb] pb-16">
      <section className="w-full">
        <Image
          src={portadaImage}
          alt="Equipo R&C"
          priority
          placeholder="blur"
          className="h-[260px] w-full object-cover sm:h-[360px] lg:h-[460px]"
        />
      </section>

      <SectionTitle>Sobre Nosotros</SectionTitle>
      <div className="py-6">
        <AnimateOnView>
          <BulletText text={intro} />
        </AnimateOnView>
      </div>

      <section className="mx-auto grid w-full max-w-[1120px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-3">
        {[
          ["Desde 1982", "Trayectoria"],
          ["Antofagasta", "Oficina principal"],
          ["Servicio integral", "Reparación y repuestos"],
        ].map(([value, label], index) => (
          <AnimateOnView key={value} delayMs={index * 90}>
            <article className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xl font-extrabold text-[#111827]">{value}</p>
              <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
            </article>
          </AnimateOnView>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-[1120px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-3">
        {valueCards.map((card, index) => (
          <AnimateOnView key={card.title} delayMs={index * 110}>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-[#111827]">{card.title}</h3>
              <p className="mt-4 text-[0.98rem] leading-8 text-[#475569]">{card.body}</p>
            </article>
          </AnimateOnView>
        ))}
      </section>

      <section className="mx-auto mt-3 w-full max-w-[1120px] px-4 sm:px-6">
        <AnimateOnView>
          <article className="grid gap-4 rounded-2xl border border-slate-200 border-l-[6px] border-l-[#d62839] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 sm:grid-cols-[auto_1fr]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#263160] text-xl text-white">🤝</div>
            <p className="text-[1rem] leading-8 text-[#374151]">
              Planteamos como pilar fundamental la <strong>transparencia</strong> y la <strong>vinculación directa</strong> con nuestros
              clientes y trabajadores, fortaleciendo los lazos que permiten fundar <strong>cimientos sólidos</strong> en el mercado
              <strong> minero</strong>, <strong>pesquero</strong> y de <strong>transporte</strong>.
            </p>
          </article>
        </AnimateOnView>
      </section>

      <div className="mt-10">
        <SectionTitle>Nuestra misión</SectionTitle>
        <div className="py-6">
          {missionItems.map((item, index) => (
            <AnimateOnView key={item} delayMs={index * 90}>
              <BulletText text={item} />
            </AnimateOnView>
          ))}
        </div>
      </div>

      <section className="mx-auto mt-4 w-full max-w-[1240px] px-4 sm:px-6">
        <AnimateOnView>
          <div className="relative overflow-hidden rounded-[22px]">
            <div className="absolute inset-x-4 top-4 z-10 rounded-xl bg-black/72 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.22)] sm:text-base">
              Gustavo Reyes, CEO de RYCREP en la sede de Niehoff, Chicago 2024
            </div>
            <Image
              src={ceoImage}
              alt="Gustavo Reyes, CEO de RYCREP"
              placeholder="blur"
              className="h-[280px] w-full object-cover transition-transform duration-700 hover:scale-[1.02] sm:h-[380px] lg:h-[480px]"
            />
          </div>
        </AnimateOnView>
      </section>

      <div className="mt-10">
        <SectionTitle>Nuestra Visión</SectionTitle>
        <div className="py-6">
          {visionItems.map((item, index) => (
            <AnimateOnView key={item} delayMs={index * 90}>
              <BulletText text={item} />
            </AnimateOnView>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <SectionTitle>Nuestra Historia</SectionTitle>
      </div>

      <section className="mx-auto mt-4 w-full max-w-[1120px] px-4 sm:px-6">
        <div className="relative pl-12 sm:pl-16">
          <div className="absolute bottom-0 left-4 top-0 w-[2px] bg-[linear-gradient(180deg,#111111,#d62839,#111111)] sm:left-6" />
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <AnimateOnView key={item.year + item.title} delayMs={index * 70}>
                <article className="relative">
                  <span className="absolute left-[-2.05rem] top-7 h-4 w-4 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fecdd3,#d62839)] shadow-[0_0_0_3px_rgba(214,40,57,0.12)] sm:left-[-2.55rem]" />
                  <div className="mb-3 inline-block rounded-xl bg-[#111827] px-4 py-2 text-sm font-extrabold text-white">
                    {item.year}
                  </div>
                  <div
                    className={`rounded-2xl border bg-white p-6 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 ${
                      item.featured
                        ? "border-[#d9bf70] ring-2 ring-[#d9bf70]/20"
                        : "border-slate-200"
                    }`}
                  >
                    {item.featured ? (
                      <span className="mb-3 inline-flex rounded-full bg-[linear-gradient(90deg,#d4af37,#f5d366)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1b1b1b]">
                        Proyecto destacado
                      </span>
                    ) : null}
                    <h3 className="text-xl font-bold text-[#111827]">{item.title}</h3>
                    <p className="mt-3 text-[0.98rem] leading-8 text-[#4b5563]">{item.body}</p>
                    {item.featured ? (
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.98rem] leading-8 text-[#374151]">
                        <li>Ventilación y extracción para mitigar gases del electrolito.</li>
                        <li>Puertas antipánico y detección y supresión de incendios.</li>
                        <li>Ducha y lavaojos para emergencias por exposición a ácidos.</li>
                      </ul>
                    ) : null}
                  </div>
                </article>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-10 flex justify-center px-4">
        <AnimateOnView>
          <Link
            href="/contacto"
            className="rounded-xl bg-[#d62839] px-6 py-4 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(214,40,57,0.2)] transition hover:-translate-y-0.5 hover:bg-[#20284e]"
          >
            Conversemos sobre tu operación
          </Link>
        </AnimateOnView>
      </div>
    </div>
  );
}

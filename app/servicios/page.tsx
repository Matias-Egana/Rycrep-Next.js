import Image from "next/image";
import { AnimateOnView } from "@/components/site/animate-on-view";
import electronico1 from "@/src/assets/servicios/electronico1.webp";
import electronico2 from "@/src/assets/servicios/electronico2.webp";
import electromecanica from "@/src/assets/servicios/electromecanica.webp";
import otrosservicios from "@/src/assets/servicios/otrosservicios.webp";

const serviceSections = [
  {
    title: "Electrónica",
    image: electronico1,
    align: "left",
    items: [
      "Mantenimiento de Control e Instrumentación",
      "Diseño de Sistemas SCADA DCS",
      "Montaje de Sistemas de Control",
      "Instalación de Redes de Comunicación",
      "Tarjetas de control",
      "Pruebas VFC, VCM, PM&ST",
      "Diseño Electromecánico y otros",
    ],
  },
  {
    title: "Eléctrico",
    image: electronico2,
    align: "right",
    items: [
      "Construcción y mantenimiento de redes de distribución de energía subterránea",
      "Montaje de Subestaciones eléctricas",
      "Instalaciones de Media Tensión",
      "Instalaciones de Salas Eléctricas",
      "Armado y modificación de tableros eléctricos",
      "Montaje de Motores Eléctricos",
      "Módulos de control SIMATIC, SIEMENS, ABB, Allen Bradley y pantallas HMI",
    ],
  },
  {
    title: "Electromecánica",
    image: electromecanica,
    align: "left",
    items: [
      "Reparación de Motores Eléctricos",
      "Alternadores de 6 a 32 Volts",
      "Motores de Partida eléctricos, neumáticos y turbina",
      "Grupos electrógenos, torres de iluminación y compresores",
      "Herramientas eléctricas y partes automotrices",
      "Overhaul de equipos Diesel Caterpillar, Cummins, Perkins, Deutz, Kubota y otros",
    ],
  },
  {
    title: "Otros Servicios",
    image: otrosservicios,
    align: "right",
    items: [
      "Puentes grúas con control electrónico",
      "Plantas Concentradoras",
      "Plantas SX y Naves EW",
      "Salas Eléctricas",
      "Maquinarias y equipos para minería",
      "Palas, perforadoras, camiones y equipos de apoyo en general",
    ],
  },
];

export default function ServiciosPage() {
  return (
    <div className="bg-[#263160] pb-8">
      <section className="px-4 py-10 text-center text-white sm:px-6">
        <AnimateOnView className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Mantenimientos Preventivos - Predictivos - Correctivos</h1>
          <p className="mt-4 text-lg leading-8 text-white/75">Brindamos servicios en las siguientes áreas.</p>
        </AnimateOnView>
      </section>

      <div className="space-y-0">
        {serviceSections.map((section, index) => (
          <section key={section.title} className="relative min-h-[420px] overflow-hidden">
            <Image src={section.image} alt={section.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
            <div className={`relative mx-auto flex min-h-[420px] w-full max-w-[1320px] px-6 py-12 ${section.align === "right" ? "justify-end text-right" : "justify-start text-left"}`}>
              <AnimateOnView delayMs={index * 70} className="flex max-w-[680px] flex-col">
                <h2 className="inline-block border-b-2 border-b-[#00bfff] pb-2 text-3xl font-extrabold uppercase text-[#00bfff]">{section.title}</h2>
                <div className={`mt-6 rounded-2xl bg-[rgba(0,191,255,0.18)] p-6 backdrop-blur ${section.align === "right" ? "ml-auto" : ""}`}>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className={`text-[1rem] leading-8 text-slate-100 ${section.align === "right" ? "flex flex-row-reverse gap-3" : "flex gap-3"}`}>
                        <span className="mt-[0.62rem] h-2.5 w-2.5 flex-none bg-[#00bfff]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnView>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

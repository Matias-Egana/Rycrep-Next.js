import Image from "next/image";
import Link from "next/link";
import { AnimateOnView } from "@/components/site/animate-on-view";
import bosch from "@/src/assets/distribuciones/bosch.webp";
import delcoremy from "@/src/assets/distribuciones/delcoremy.webp";
import denso from "@/src/assets/distribuciones/denso.webp";
import leece from "@/src/assets/distribuciones/leece.webp";
import niehoff from "@/src/assets/distribuciones/niehoff.webp";
import nikko from "@/src/assets/distribuciones/nikko.webp";
import prelub from "@/src/assets/distribuciones/prelub.webp";
import sawafuji from "@/src/assets/distribuciones/sawafuji.webp";
import tdi from "@/src/assets/distribuciones/tdi.webp";
import bussman from "@/src/assets/distribuciones/bussman.webp";

const brands = [
  { key: "niehoff", name: "C.E. Niehoff & Co.", logo: niehoff, desc: "Alternadores brushless heavy-duty y gestión de energía para condiciones extremas.", highlights: ["Alta eficiencia", "Brushless", "Servicio severo"], href: "/productos?brand=Niehoff", featured: true },
  { key: "nikko", name: "NIKKO", logo: nikko, desc: "Motores de arranque y alternadores para maquinaria pesada con alto torque y confiabilidad.", highlights: ["Arranque pesado", "Durabilidad", "OEM japonés"], href: "/productos?brand=Nikko" },
  { key: "delcoremy", name: "Delco Remy", logo: delcoremy, desc: "Soluciones para vehículos comerciales e industriales con respaldo global.", highlights: ["Flotas", "Alta durabilidad", "Soporte global"], href: "/productos?brand=Delco%20Remy" },
  { key: "denso", name: "DENSO", logo: denso, desc: "Alternadores y arrancadores OEM de precisión y alta fiabilidad.", highlights: ["Confiabilidad", "Eficiencia", "OEM"], href: "/productos?brand=Delso" },
  { key: "bussman", name: "BUSSMAN", logo: bussman, desc: "Protección eléctrica confiable para aplicaciones industriales y automotrices.", highlights: ["Fusibles", "Industria", "Automotriz"], href: "/productos?brand=Bussman" },
  { key: "tdi", name: "TDI", logo: tdi, desc: "Arrancadores de aire de turbina para motores medianos y grandes en aplicaciones desafiantes.", highlights: ["Air starters", "Seguridad", "Motores grandes"], href: "/productos?brand=TDI" },
  { key: "bosch", name: "BOSCH", logo: bosch, desc: "Líder global en sistemas de arranque y alternadores para transporte y minería.", highlights: ["Líder global", "Robustez", "Cobertura"], href: "/productos?brand=Bosch" },
  { key: "leece", name: "Leece-Neville", logo: leece, desc: "Alternadores de alto amperaje para transporte terrestre, marino y minero.", highlights: ["Alto amperaje", "Heavy-duty", "Flotas"], href: "/productos?brand=Leece-Neville" },
  { key: "sawafuji", name: "SAWAFUJI", logo: sawafuji, desc: "Alternadores y arrancadores confiables para entornos exigentes.", highlights: ["Confiabilidad", "Servicio severo", "Industria"], href: "/productos?brand=Sawafuji" },
  { key: "prelub", name: "PRELUB", logo: prelub, desc: "Bombas de prelubricación para reducir desgaste en arranque y proteger motores heavy duty.", highlights: ["Protección motor", "Prelubricación", "Diésel"], href: "/productos?brand=Prelub" },
];

export default function DistribucionesPage() {
  return (
    <div className="bg-[#fbfbfb] px-4 pb-16 pt-8 sm:px-6">
      <div className="mx-auto w-full max-w-[1120px]">
        <AnimateOnView className="text-center">
          <h1 className="text-4xl font-extrabold text-[#111827] sm:text-5xl">
            Estas son nuestras <span className="text-[#e11d48]">distribuciones</span>
          </h1>
          <p className="mt-3 text-[1.02rem] leading-8 text-[#475569]">Presiona una para ver sus productos y líneas destacadas.</p>
          <div className="mx-auto mt-5 h-[3px] w-40 rounded-full bg-[linear-gradient(90deg,#111111,#e11d48,#111111)]" />
        </AnimateOnView>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {brands.map((brand, index) => (
            <AnimateOnView key={brand.key} delayMs={index * 60}>
              <Link
                href={brand.href}
                className={`group relative grid h-full gap-4 rounded-2xl border bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)] ${
                  brand.featured ? "border-[#d4af37] ring-2 ring-[#d4af37]/15" : "border-slate-200"
                }`}
              >
                {brand.featured ? (
                  <span className="absolute left-3 top-3 rounded-lg bg-[linear-gradient(90deg,#d4af37,#f5d366)] px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#1b1b1b]">
                    Representamos a
                  </span>
                ) : null}
                <div className="mt-4 flex h-[92px] items-center justify-center rounded-xl bg-white">
                  <Image src={brand.logo} alt={brand.name} className="max-h-[72px] w-auto object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#111827]">{brand.name}</h2>
                  <p className="mt-3 text-[0.94rem] leading-7 text-[#475569]">{brand.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {brand.highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-extrabold text-[#111]">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex justify-center">
                  <span className="rounded-xl bg-[#e11d48] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_20px_rgba(225,29,72,0.18)] transition group-hover:bg-[#9f1239]">
                    Ver productos
                  </span>
                </div>
              </Link>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { AnimateOnView } from "@/components/site/animate-on-view";
import logo from "@/src/assets/representacion/logo_ce.webp";
import buildingBg from "@/src/assets/representacion/niehoff.webp";
import alt1 from "@/src/assets/representacion/alternadores/alternador1.webp";
import alt2 from "@/src/assets/representacion/alternadores/alternador2.webp";
import alt3 from "@/src/assets/representacion/alternadores/alternador3.webp";

const panels = [
  {
    icon: "⚡",
    title: "Eficiencia y estabilidad",
    body: "Regulación eléctrica precisa, rendimiento superior y menor mantenimiento. Ideales para flotas donde la energía estable es crítica.",
  },
  {
    icon: "🛡️",
    title: "Construcción heavy-duty",
    body: "Ingeniería pensada para duty cycles severos, altas temperaturas y trabajo continuo en condiciones extremas.",
  },
  {
    icon: "🤝",
    title: "Rycrep + Niehoff",
    body: "Soporte local, repuestos, asesoría técnica y especificación correcta para cada aplicación.",
  },
];

const bullets = [
  "Integración habitual con motores Cummins, Detroit y Caterpillar en aplicaciones de alto rendimiento.",
  "Rendimiento estable para sistemas hidráulicos, control, iluminación de alto consumo y electrónica avanzada.",
  "Soporte y provisión a través de Rycrep: especificación, suministro y postventa.",
];

export default function RepresentacionesPage() {
  return (
    <div className="bg-white pb-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-[1120px] gap-5 px-4 py-5 sm:px-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
            <Image src={logo} alt="C.E. Niehoff & Co." className="h-12 w-auto object-contain" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-center md:justify-start md:text-left">
            <span className="rounded-full bg-[linear-gradient(90deg,#7f1d1d,#e11d48)] px-4 py-2 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
              Rycrep × Niehoff
            </span>
            <p className="text-[1.02rem] font-medium leading-7 text-[#1f2937]">
              Somos el <strong>distribuidor exclusivo</strong> de Niehoff &amp; Co. para Latinoamérica.
            </p>
          </div>
        </div>
        <div className="h-[3px] bg-[linear-gradient(90deg,#111111,#e11d48,#111111)]" />
      </section>

      <section className="relative overflow-hidden">
        <Image src={buildingBg} alt="Niehoff" priority placeholder="blur" className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[520px]" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0">
          <div className="mx-auto grid h-full w-full max-w-[1120px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <AnimateOnView className="flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Consulta por nuestros productos Niehoff.</h1>
                <p className="mt-4 max-w-xl text-lg leading-8 text-white/85">
                  Alternadores brushless heavy-duty, soporte técnico local y especificación precisa para aplicaciones severas.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/productos" className="rounded-xl bg-[#e11d48] px-6 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(225,29,72,0.24)] transition hover:-translate-y-0.5 hover:bg-[#9f1239]">
                    Ver Productos
                  </Link>
                  <Link href="/contacto" className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                    Hablar con especialista
                  </Link>
                </div>
              </div>
            </AnimateOnView>

            <AnimateOnView delayMs={120} className="flex items-center justify-center">
              <div className="flex min-h-[170px] max-w-[720px] items-center justify-center rounded-2xl bg-black/40 px-8 py-6 backdrop-blur">
                <Image src={alt1} alt="Alternador 1" className="-mr-8 h-[120px] w-auto object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.3)]" />
                <Image src={alt2} alt="Alternador 2" className="-mr-8 h-[132px] w-auto object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.3)]" />
                <Image src={alt3} alt="Alternador 3" className="h-[124px] w-auto object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.3)]" />
              </div>
            </AnimateOnView>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-[1120px]">
          <AnimateOnView>
            <h2 className="text-4xl font-extrabold text-[#111827]">¿Quién es <span className="bg-[linear-gradient(90deg,#9f1239,#e11d48)] bg-clip-text text-transparent">Niehoff</span>?</h2>
            <p className="mt-4 max-w-4xl text-[1.05rem] leading-8 text-[#374151]">
              C.E. Niehoff &amp; Co. es referente mundial en <strong>alternadores brushless de alto desempeño</strong>, diseñados para polvo, vibración,
              humedad y ciclos de trabajo prolongados.
            </p>
          </AnimateOnView>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {panels.map((panel, index) => (
              <AnimateOnView key={panel.title} delayMs={index * 100}>
                <article className="rounded-2xl border border-rose-100 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1">
                  <div className="text-2xl">{panel.icon}</div>
                  <h3 className="mt-4 text-xl font-bold text-[#111827]">{panel.title}</h3>
                  <p className="mt-3 text-[0.98rem] leading-8 text-[#4b5563]">{panel.body}</p>
                </article>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0b0b0b] px-4 py-12 text-white sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(225,29,72,0.16),transparent_55%)]" />
        <div className="relative mx-auto flex w-full max-w-[1120px] justify-center">
          <Link href="https://www.youtube.com/watch?v=100kV-T8VlA" target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#e11d48,#9f1239)] px-6 py-3 text-base font-extrabold text-white shadow-[0_14px_28px_rgba(0,0,0,0.26)] transition hover:-translate-y-0.5">
            Ver video
          </Link>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-[1120px]">
          <AnimateOnView>
            <h2 className="text-4xl font-extrabold text-[#111827]">Aplicaciones en maquinaria líder</h2>
            <p className="mt-4 text-[1.02rem] leading-8 text-[#4b5563]">
              Usados en equipos de tracción y movimiento de tierra de Komatsu, Liebherr y Caterpillar.
            </p>
          </AnimateOnView>
          <AnimateOnView delayMs={80}>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Komatsu", "Liebherr", "Caterpillar"].map((brand) => (
                <span key={brand} className="rounded-full bg-[#111827] px-4 py-2 text-sm font-extrabold text-white">
                  {brand}
                </span>
              ))}
            </div>
          </AnimateOnView>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {bullets.map((bullet, index) => (
              <AnimateOnView key={bullet} delayMs={index * 100}>
                <article className="flex gap-3 rounded-2xl border border-rose-200 border-dashed bg-[#fafafa] p-5">
                  <span className="mt-2 h-3 w-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fecdd3,#e11d48)] shadow-[0_0_0_2px_rgba(225,29,72,0.16)]" />
                  <p className="text-[0.98rem] leading-8 text-[#374151]">{bullet}</p>
                </article>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(90deg,#0b0b0b,#1f1f1f)] px-4 py-16 text-white sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(225,29,72,0.16),transparent_60%)]" />
        <AnimateOnView className="relative mx-auto w-full max-w-[1120px] text-center">
          <h2 className="text-4xl font-extrabold">La conexión con <span className="text-rose-200">Niehoff</span> es nuestro mejor sello.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[1.05rem] leading-8 text-white/85">
            Cuéntanos tu aplicación, voltaje, consumo y duty cycle. Te ayudamos a seleccionar el alternador ideal.
          </p>
          <div className="mt-8">
            <Link href="/contacto" className="rounded-xl bg-[#e11d48] px-6 py-3 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(225,29,72,0.24)] transition hover:-translate-y-0.5 hover:bg-[#9f1239]">
              Hablar con un especialista
            </Link>
          </div>
        </AnimateOnView>
      </section>
    </div>
  );
}

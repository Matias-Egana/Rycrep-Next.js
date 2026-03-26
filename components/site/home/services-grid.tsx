"use client";

import Link from "next/link";
import { useState } from "react";
import { ServiceDetailModal } from "@/components/site/home/service-detail-modal";
import type { HomeService } from "@/components/site/home/types";

type ServicesGridProps = {
  services: HomeService[];
};

export function ServicesGrid({ services }: ServicesGridProps) {
  const [selectedService, setSelectedService] = useState<HomeService | null>(null);
  const [modalTab, setModalTab] = useState<"images" | "video">("images");

  return (
    <>
      <section className="bg-[#263160] py-16 lg:py-20">
        <div className="mx-auto w-[min(100%-24px,1260px)] bg-white px-6 py-10 shadow-[0_30px_70px_rgba(15,23,42,0.2)] sm:px-10 lg:px-14">
          <div className="mx-auto h-[6px] w-[136px] overflow-hidden rounded-full bg-[#20284e]">
            <div className="h-full w-1/2 bg-[#c52f2f]" />
          </div>

          <div className="mx-auto mt-6 max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-black sm:text-5xl">
              Servicios Industriales y Mineros
            </h2>
            <p className="mt-4 text-base leading-8 text-black/80 sm:text-lg">
              Mantenimiento integral eléctrico, electrónico y diésel. Control y automatización con foco en
              seguridad, trazabilidad y disponibilidad operacional.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden border border-[#3a4366] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative h-[165px] overflow-hidden bg-[#d9dde7]">
                  {service.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#dbe1ea] text-sm font-medium text-[#1f2a44]">
                      Imagen de {service.title}
                    </div>
                  )}
                </div>

                <div className="min-h-[68px] bg-[#cf2f2f] px-4 py-3 text-[0.88rem] font-bold uppercase leading-5 tracking-[0.01em] text-white">
                  {service.subtitle ?? service.title}
                </div>

                <div className="space-y-4 px-4 py-4">
                  <h3 className="min-h-[72px] text-[1.08rem] font-extrabold leading-8 text-[#101828] sm:text-[1.1rem]">
                    {service.title}
                  </h3>
                  <p className="min-h-[90px] text-[0.97rem] leading-8 text-[#1f2937]">
                    {service.summary}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setModalTab("images");
                        setSelectedService(service);
                      }}
                      className="rounded-md bg-[#20284e] px-4 py-3 text-base font-semibold text-white shadow-[0_10px_20px_rgba(197,47,47,0.12)] transition hover:-translate-y-0.5"
                    >
                      Ver más
                    </button>
                    {service.videoUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setModalTab("video");
                          setSelectedService(service);
                        }}
                        className="rounded-md border border-[#20284e] bg-white px-4 py-3 text-base font-semibold text-[#20284e] shadow-[0_10px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-[#f7f8fc]"
                      >
                        Ver video
                      </button>
                    ) : (
                      <Link
                        href="/servicios"
                        className="rounded-md border border-[#20284e] bg-white px-4 py-3 text-base font-semibold text-[#20284e] shadow-[0_10px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-[#f7f8fc]"
                      >
                        Más info
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ServiceDetailModal
        open={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        initialTab={modalTab}
      />
    </>
  );
}

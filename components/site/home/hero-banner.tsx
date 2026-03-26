"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { StaticImageData } from "next/image";
import type { HomeHeroSlide } from "@/components/site/home/types";

type HeroBannerProps = {
  slides: HomeHeroSlide[];
  seal: StaticImageData;
};

export function HeroBanner({ slides, seal }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-[#f3f4f8]">
      <div className="relative h-[430px] sm:h-[540px] lg:h-[860px]">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              priority={index === 0}
              placeholder="blur"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,45,0.18),rgba(18,24,45,0.38))]" />
          </div>
        ))}

        <div className="absolute left-[4.5%] top-[8%] z-10 sm:left-[5.5%]">
          <Image
            src={seal}
            alt="Excelencia desde 1982"
            priority
            className="h-[150px] w-[150px] object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.28)] sm:h-[180px] sm:w-[180px] lg:h-[250px] lg:w-[250px]"
          />
        </div>

        <div className="absolute inset-x-5 bottom-[14%] z-10 flex justify-center text-center sm:inset-x-10 lg:bottom-[20%]">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold leading-[1.06] text-white drop-shadow-[0_8px_24px_rgba(15,23,42,0.22)] sm:text-5xl lg:text-[4.2rem]">
              {slides[activeIndex]?.title}
            </h1>
            <p className="mt-5 text-xl text-white/95 sm:text-2xl">{slides[activeIndex]?.subtitle}</p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contacto"
                className="rounded-xl bg-white/96 px-6 py-3 text-base font-semibold text-[#232c57] shadow-[0_10px_30px_rgba(0,0,0,0.14)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Cotiza Ahora
              </Link>
            </div>
            <div className="mt-8 flex justify-center gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Ir al slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-3.5 w-3.5 rounded-full border-2 border-white transition ${index === activeIndex ? "bg-white" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { HomeCategory } from "@/components/site/home/types";

type CategoryCarouselProps = {
  categories: HomeCategory[];
};

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const loop = [...categories, ...categories];

  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="mx-auto w-[min(100%-24px,1780px)] rounded-none bg-[#263160] px-6 py-14 sm:px-10 lg:px-16 lg:py-24">
        <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">
          Encuentra lo que estás buscando
        </h2>

        <div className="mt-10 overflow-hidden">
          <div className="flex min-w-max gap-8 [animation:home-marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
            {loop.map((category, index) => (
              <Link
                key={`${category.title}-${index}`}
                href={category.href}
                className="group flex h-[210px] w-[210px] flex-none flex-col items-center justify-center rounded-2xl bg-[#fbfbfd] px-4 py-5 text-center shadow-[0_18px_40px_rgba(15,23,42,0.14)] transition-transform duration-300 hover:-translate-y-1"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  className="h-[110px] w-[110px] object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <p className="mt-5 text-[1.08rem] font-medium text-[#263160]">{category.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

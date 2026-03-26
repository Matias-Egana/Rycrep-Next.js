import Image from "next/image";
import type { StaticImageData } from "next/image";

type TrustLogo = {
  name: string;
  image: StaticImageData;
};

type TrustStripProps = {
  logos: TrustLogo[];
};

export function TrustStrip({ logos }: TrustStripProps) {
  const loop = [...logos, ...logos];

  return (
    <section className="bg-white pt-16">
      <div className="mx-auto w-[min(100%-24px,1780px)] bg-white px-6 pb-14 pt-4 sm:px-10">
        <h2 className="text-center text-3xl font-semibold text-black sm:text-4xl">Confían en nosotros</h2>
        <div className="mt-10 overflow-hidden">
          <div className="flex min-w-max items-center gap-16 [animation:home-marquee_26s_linear_infinite] hover:[animation-play-state:paused]">
            {loop.map((logo, index) => (
              <div key={`${logo.name}-${index}`} className="flex h-[120px] w-[260px] flex-none items-center justify-center">
                <Image src={logo.image} alt={logo.name} className="max-h-[110px] w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

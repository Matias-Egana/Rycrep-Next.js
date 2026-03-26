import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/site/icons";

type SectionPageProps = {
  eyebrow: string;
  title: string;
  copy: string;
  image: {
    src: Parameters<typeof Image>[0]["src"];
    alt: string;
  };
  highlights: string[];
  children: ReactNode;
};

export function SectionPage({ eyebrow, title, copy, image, highlights, children }: SectionPageProps) {
  return (
    <div className="section">
      <div className="shell space-y-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="section-title max-w-4xl">{title}</h1>
            <p className="section-copy">{copy}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="panel flex items-start gap-3 px-4 py-4 text-sm text-[color:var(--color-muted)]">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-none text-[color:var(--color-brand)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/contacto" className="primary-button">
                Hablar con un especialista
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/productos" className="secondary-button">
                Ver catálogo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-4 rounded-[32px] bg-[color:var(--color-brand-glow)] blur-3xl" />
            <div className="panel-strong relative overflow-hidden p-3">
              <Image
                src={image.src}
                alt={image.alt}
                className="h-[420px] w-full rounded-[24px] object-cover"
                placeholder="blur"
                priority
              />
            </div>
          </div>
        </section>

        {children}
      </div>
    </div>
  );
}

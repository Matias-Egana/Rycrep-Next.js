import type { StaticImageData } from "next/image";

export type HomeCategory = {
  title: string;
  href: string;
  image: StaticImageData;
};

export type HomeHeroSlide = {
  image: StaticImageData;
  title: string;
  subtitle: string;
};

export type HomeService = {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  images?: string[];
  videoUrl?: string;
  blocks?: {
    label: string;
    items: string[];
  }[];
};

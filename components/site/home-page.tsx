import servicesData from "@/src/data/services.json";
import motoresImg from "@/src/assets/CategoryGrid/motores.webp";
import alternadoresImg from "@/src/assets/CategoryGrid/alternadores.webp";
import bateriasImg from "@/src/assets/CategoryGrid/baterias.webp";
import lucesImg from "@/src/assets/CategoryGrid/luces.webp";
import fusiblesImg from "@/src/assets/CategoryGrid/fusibles.webp";
import seguridadImg from "@/src/assets/CategoryGrid/seguridad.webp";
import heroSeal from "@/src/assets/hero/Sello.webp";
import heroSlideA from "@/src/assets/hero/Niehoff & Co.webp";
import heroSlideB from "@/src/assets/hero/slide1.webp";
import heroSlideC from "@/src/assets/hero/slide2.webp";
import heroSlideD from "@/src/assets/hero/slide3.webp";
import { CategoryCarousel } from "@/components/site/home/category-carousel";
import { HeroBanner } from "@/components/site/home/hero-banner";
import { ServicesGrid } from "@/components/site/home/services-grid";
import { TrustStrip } from "@/components/site/home/trust-strip";
import { clientLogos } from "@/components/site/content";
import type { HomeCategory, HomeHeroSlide, HomeService } from "@/components/site/home/types";

const categories: HomeCategory[] = [
  { title: "Baterias", image: bateriasImg, href: "/productos?category=baterias" },
  { title: "Fusibles", image: fusiblesImg, href: "/productos?category=fusibles" },
  { title: "Luminaria", image: lucesImg, href: "/productos?category=faroles_luminarias" },
  { title: "Seguridad", image: seguridadImg, href: "/productos?category=articulos_seguridad" },
  { title: "Motores", image: motoresImg, href: "/productos?category=motores" },
  { title: "Alternadores", image: alternadoresImg, href: "/productos?category=alternadores" },
];

const heroSlides: HomeHeroSlide[] = [
  {
    image: heroSlideB,
    title: "Mantención y reparación de equipo electromecánico",
    subtitle: "Servicios Integrales",
  },
  {
    image: heroSlideC,
    title: "Cotiza nuestros productos originales de Niehoff & Co.",
    subtitle: "Representaciones oficiales y respaldo de fábrica",
  },
  {
    image: heroSlideD,
    title: "Soporte técnico especializado para operación minera",
    subtitle: "Diagnóstico, mantenimiento y continuidad operacional",
  },
  {
    image: heroSlideA,
    title: "Somos representantes oficiales de Niehoff en Chile",
    subtitle: "Cobertura técnica y comercial en el norte del país",
  },
];

const services = (servicesData as HomeService[])
  .filter((service) =>
    [
      "carga-arranque",
      "equipos-autonomos",
      "electronica-industrial",
      "servicio-electrico",
      "mecanica-diesel",
      "modalidades-trabajo",
      "container-baterias",
    ].includes(service.id),
  )
  .slice(0, 7);

export function HomePage() {
  return (
    <div className="bg-white">
      <HeroBanner slides={heroSlides} seal={heroSeal} />
      <CategoryCarousel categories={categories} />
      <ServicesGrid services={services} />
      <TrustStrip logos={clientLogos} />
    </div>
  );
}

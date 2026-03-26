import type { StaticImageData } from "next/image";
import heroBackdrop from "@/src/assets/hero/Niehoff & Co.webp";
import serviceImage from "@/src/assets/servicios/electromecanica.webp";
import contactImage from "@/src/assets/nosotros/portada.webp";
import ceoImage from "@/src/assets/nosotros/ceo2.webp";
import komatsuLogo from "@/src/assets/logos/komatsu.webp";
import sqmLogo from "@/src/assets/logos/sqm.webp";
import codelcoLogo from "@/src/assets/logos/codelco.webp";
import bhpLogo from "@/src/assets/logos/bhp.webp";
import amLogo from "@/src/assets/logos/antofagasta-minerals.webp";
import collahuasiLogo from "@/src/assets/logos/collahuasi.webp";
import cumminsLogo from "@/src/assets/logos/cummins.webp";
import aesgenerLogo from "@/src/assets/logos/aesgener.webp";

export type NavItem = {
  href: string;
  label: string;
};

export type BrandCard = {
  name: string;
  country: string;
  description: string;
  accent?: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon: "shield" | "bolt" | "clock" | "globe" | "box" | "wrench" | "cpu";
  tag?: string;
};

export type CategoryCard = {
  title: string;
  items: string[];
};

export const navItems: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/representaciones", label: "Representaciones" },
  { href: "/distribuciones", label: "Distribuciones" },
  { href: "/servicios", label: "Servicios" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
];

export const heroStats = [
  "Trazabilidad completa por proyecto",
  "Respuesta técnica en menos de 24 horas",
  "Cobertura minera en el norte de Chile",
];

export const trustMetrics = [
  { value: "+15", label: "años apoyando faenas" },
  { value: "24h", label: "para despachos críticos" },
  { value: "7", label: "líneas técnicas integradas" },
];

export const clientLogos: { name: string; image: StaticImageData }[] = [
  { name: "Komatsu", image: komatsuLogo },
  { name: "SQM", image: sqmLogo },
  { name: "Codelco", image: codelcoLogo },
  { name: "BHP", image: bhpLogo },
  { name: "Antofagasta Minerals", image: amLogo },
  { name: "Collahuasi", image: collahuasiLogo },
  { name: "Cummins", image: cumminsLogo },
  { name: "AES Andes", image: aesgenerLogo },
];

export const brands: BrandCard[] = [
  {
    name: "Niehoff & Co.",
    country: "Alemania",
    description: "Sistemas de bobinado, alternadores y soluciones para operación minera continua.",
    accent: "Principal",
  },
  {
    name: "Leroy-Somer",
    country: "Francia",
    description: "Motores eléctricos y alternadores industriales para continuidad operacional.",
  },
  {
    name: "Stamford / AvK",
    country: "Reino Unido",
    description: "Alternadores para grupos electrógenos y sistemas críticos de respaldo.",
  },
  {
    name: "Cummins",
    country: "EE.UU.",
    description: "Potencia diésel, repuestos y soporte técnico para equipos de alto ciclo.",
  },
  {
    name: "Siemens",
    country: "Alemania",
    description: "Automatización, electrónica industrial y continuidad digital de planta.",
  },
  {
    name: "Schneider Electric",
    country: "Francia",
    description: "Gestión de energía, control y soluciones de automatización robustas.",
  },
];

export const distributionPillars: FeatureCard[] = [
  {
    title: "Repuestos originales",
    description: "Stock técnico priorizado para piezas críticas con despacho coordinado desde Antofagasta.",
    icon: "box",
  },
  {
    title: "Importación directa",
    description: "Relación directa con fabricante para acortar tiempos, asegurar compatibilidad y evitar intermediarios.",
    icon: "globe",
  },
  {
    title: "Garantía de fábrica",
    description: "Cada suministro se entrega con respaldo documental y validación técnica del fabricante.",
    icon: "shield",
  },
  {
    title: "Cobertura nacional",
    description: "Operación logística enfocada en minería, energía, talleres de mantenimiento y contratistas EPC.",
    icon: "clock",
  },
];

export const serviceCards: FeatureCard[] = [
  {
    title: "Carga y arranque",
    description: "Diagnóstico, reparación y overhaul de alternadores y motores de partida de alto ciclo.",
    icon: "bolt",
    tag: "Popular",
  },
  {
    title: "Equipos autónomos",
    description: "Mantención preventiva y correctiva de grupos electrógenos, compresores y torres de iluminación.",
    icon: "shield",
    tag: "Especialidad",
  },
  {
    title: "Electrónica y control",
    description: "Diseño, reparación y pruebas de PLC, DCS, variadores, HMI y sistemas SCADA.",
    icon: "cpu",
  },
  {
    title: "Eléctrico industrial",
    description: "Montaje, retrofit y soporte en MT/BT, tableros, fuerza y control para faenas mineras.",
    icon: "wrench",
  },
  {
    title: "Mecánica diésel",
    description: "Pruebas de carga, overhauls y reacondicionamiento para líneas de potencia crítica.",
    icon: "box",
  },
  {
    title: "Sala de carga",
    description: "Infraestructura habilitada para baterías y componentes con foco en seguridad operacional.",
    icon: "shield",
    tag: "Exclusivo",
  },
];

export const productCategories: CategoryCard[] = [
  {
    title: "Equipos eléctricos",
    items: ["Alternadores industriales", "Motores de arranque", "Transformadores", "Variadores de frecuencia"],
  },
  {
    title: "Electrónica industrial",
    items: ["PLC y controladores", "Paneles HMI", "Sensores y transmisores", "Módulos SCADA/DCS"],
  },
  {
    title: "Mecánica y diésel",
    items: ["Motores reconstruidos", "Kits de overhaul", "Filtración técnica", "Compresores de aire"],
  },
];

export const processSteps = [
  {
    title: "Levantamiento técnico",
    description: "Entendemos criticidad, contexto operacional y el componente exacto antes de cotizar.",
  },
  {
    title: "Definición de solución",
    description: "Priorizamos continuidad operacional: reparación, reemplazo o suministro directo.",
  },
  {
    title: "Seguimiento y trazabilidad",
    description: "Acompañamos fabricación, importación, pruebas y entrega con información clara para tu equipo.",
  },
];

export const companyHighlights = [
  "Representantes oficiales con relación directa de fábrica.",
  "Atención comercial y técnica unificada para reducir fricción.",
  "Diseño centrado en rapidez de lectura, claridad y conversión.",
];

export const pageIntros = {
  nosotros: {
    eyebrow: "Compañía",
    title: "Una operación técnica diseñada para responder con claridad, respaldo y velocidad.",
    copy:
      "R&C Representaciones combina soporte comercial, ingeniería aplicada e importación directa para resolver necesidades críticas en minería, energía e industria pesada.",
  },
  representaciones: {
    eyebrow: "Marcas oficiales",
    title: "Fabricantes globales, relación directa y soporte local que sí aterriza en terreno.",
    copy:
      "La estrategia comercial se apoya en alianzas con fabricantes líderes para asegurar disponibilidad, compatibilidad y acompañamiento técnico durante todo el ciclo del equipo.",
  },
  distribuciones: {
    eyebrow: "Abastecimiento",
    title: "Importación e inventario técnico pensados para continuidad operacional.",
    copy:
      "La nueva estructura prioriza mensajes cortos, decisión rápida y evidencia de confianza para convertir mejor sin perder profundidad técnica.",
  },
  servicios: {
    eyebrow: "Capacidades",
    title: "Servicios industriales con foco en seguridad, trazabilidad y reducción de detenciones.",
    copy:
      "Desde electrónica avanzada hasta potencia diésel, la experiencia se organiza para que cada visitante encuentre rápidamente su solución.",
  },
  productos: {
    eyebrow: "Catálogo",
    title: "Una vitrina más clara para equipos, repuestos y líneas técnicas prioritarias.",
    copy:
      "El catálogo queda listo para evolucionar hacia filtros, fichas dinámicas y conexión con tu backend, pero ya con una base visual y estructural mucho más robusta.",
  },
  contacto: {
    eyebrow: "Contacto",
    title: "Conversemos desde una interfaz más clara, rápida y orientada a conversión.",
    copy:
      "El formulario y los canales de contacto se reorganizan para eliminar fricción, dar confianza y mejorar la experiencia móvil desde la primera interacción.",
  },
};

export const siteImages = {
  heroBackdrop,
  serviceImage,
  contactImage,
  ceoImage,
};

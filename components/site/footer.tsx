"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import certifications from "@/src/assets/Certificaciones/certificaciones.webp";

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.1 20.45H3.54V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm-.2 1.8A3.75 3.75 0 0 0 3.8 7.55v8.9a3.75 3.75 0 0 0 3.75 3.75h8.9a3.75 3.75 0 0 0 3.75-3.75v-8.9a3.75 3.75 0 0 0-3.75-3.75h-8.9Zm9.65 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.86A5.14 5.14 0 1 1 6.86 12 5.14 5.14 0 0 1 12 6.86Zm0 1.8A3.34 3.34 0 1 0 15.34 12 3.34 3.34 0 0 0 12 8.66Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.12 11.93v-8.44H7.08v-3.5h3.04V9.41c0-3.02 1.79-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.33l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://www.linkedin.com/company/rycrep/",
    label: "LinkedIn",
    bg: "#0a66c2",
    icon: <LinkedinIcon />,
  },
  {
    href: "https://www.instagram.com/rycrepresentacionesyservicios",
    label: "Instagram",
    bg: "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 52%, #6228d7 100%)",
    icon: <InstagramIcon />,
  },
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    bg: "#1877f2",
    icon: <FacebookIcon />,
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/cms") || pathname.startsWith("/setup")) return null;

  return (
    <footer className="mt-0 bg-white text-[#232c57]">
      <section className="border-t border-white/10 bg-[#232c57] text-white">
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-center">
          <div className="flex justify-center lg:justify-start">
            <Image
              src={certifications}
              alt="Certificaciones"
              width={240}
              className="h-auto w-[220px] rounded-[6px] shadow-[0_10px_24px_rgba(0,0,0,0.2)] sm:w-[240px]"
            />
          </div>

          <div className="text-center">
            <p className="text-sm leading-6 text-white/90">
              <span className="block">El Oro 7956 Barrio Industrial,</span>
              <span className="block">Antofagasta</span>
            </p>
            <a
              href="tel:+56951992909"
              className="mt-3 inline-flex text-[1.85rem] font-extrabold tracking-[-0.03em] text-white transition hover:text-[#f2f4ff]"
            >
              +56 9 5199 2909
            </a>
          </div>

          <div className="flex flex-col items-center gap-3 lg:items-end">
            <p className="text-[1.4rem] font-bold tracking-[-0.03em] text-white/75">Síguenos</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.28)]"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{ background: social.bg }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <Link
              href="/contacto"
              className="text-[1.15rem] font-extrabold tracking-[-0.03em] text-white transition hover:text-white/80"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}

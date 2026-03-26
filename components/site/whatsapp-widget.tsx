"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type WhatsAppContact = {
  phone: string;
  label: string;
  defaultMessage: string;
  accentColor: string;
};

const contacts: WhatsAppContact[] = [
  {
    label: "Ventas",
    phone: "56951992909",
    defaultMessage: "¡Hola, equipo de Ventas! Necesito información comercial 😊",
    accentColor: "#25D366",
  },
  {
    label: "Ventas Técnicas",
    phone: "56982298903",
    defaultMessage: "Hola, Ventas Técnicas. Tengo una duda técnica sobre el producto.",
    accentColor: "#128C7E",
  },
];

function sanitizePhone(raw: string) {
  return raw.replace(/\D+/g, "");
}

function buildWhatsAppUrl(phone: string, text: string) {
  return `https://wa.me/${sanitizePhone(phone)}?text=${encodeURIComponent(text)}`;
}

function WhatsAppGlyph({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M20.52 3.48A11.86 11.86 0 0 0 12.01 0C5.38 0 .03 5.35.03 11.97c0 2.11.55 4.2 1.6 6.03L0 24l6.2-1.6c1.78.97 3.8 1.49 5.83 1.49h.01c6.63 0 12-5.35 12-11.97 0-3.2-1.24-6.2-3.52-8.45zM12.04 21.3h-.01c-1.8 0-3.56-.48-5.1-1.38l-.37-.22-3.68.95.98-3.59-.24-.37a9.6 9.6 0 0 1-1.5-5.05c0-5.29 4.31-9.6 9.62-9.6 2.56 0 4.97 1 6.78 2.8a9.55 9.55 0 0 1 2.83 6.8c0 5.29-4.31 9.6-9.61 9.6zm5.58-7.16c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.97 1.18-.18.2-.36.23-.66.08-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.47-1.73-1.64-2.02-.17-.3-.02-.46.13-.61.13-.13.3-.33.45-.49.15-.16.2-.28.3-.48.1-.2.05-.38-.02-.53-.08-.15-.69-1.67-.95-2.29-.25-.6-.5-.52-.69-.53h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.13 3.25 5.16 4.55.72.31 1.29.49 1.73.63.73.23 1.39.2 1.92.12.59-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WhatsAppWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeContact = useMemo(() => contacts[activeIndex] ?? contacts[0], [activeIndex]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (pathname.startsWith("/cms") || pathname.startsWith("/setup")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[75] sm:bottom-6 sm:right-6">
      <div
        className={`absolute bottom-[78px] right-0 w-[min(90vw,400px)] origin-bottom-right rounded-[24px] border border-black/10 bg-white text-[#111827] shadow-[0_28px_70px_rgba(15,23,42,0.22)] transition-all duration-300 ${
          open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start gap-4 border-b border-black/8 px-5 py-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppGlyph />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[2rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#111827]">
              ¿Con quién quieres hablar?
            </h3>
            <p className="mt-2 text-[1rem] leading-7 text-slate-500">
              Elige el canal adecuado para ayudarte mejor
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-3xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            onClick={() => setOpen(false)}
            aria-label="Cerrar WhatsApp"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <p className="text-[1.04rem] leading-7 text-slate-600">Elige con quién quieres hablar:</p>

          <div className="space-y-3">
            {contacts.map((contact, index) => {
              const href = buildWhatsAppUrl(contact.phone, contact.defaultMessage);
              const active = index === activeIndex;

              return (
                <a
                  key={contact.label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className={`grid grid-cols-[40px_1fr_auto] items-center gap-4 rounded-[18px] border bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 ${
                    active ? "border-[color:var(--contact-accent)] shadow-[0_14px_28px_rgba(37,211,102,0.08)]" : "border-slate-200"
                  }`}
                  style={{ ["--contact-accent" as string]: contact.accentColor }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: contact.accentColor }}
                  >
                    <WhatsAppGlyph className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-[1rem] font-extrabold text-[#111827]">{contact.label}</strong>
                    <span className="mt-1 block truncate text-[0.95rem] text-slate-500">
                      {contact.defaultMessage}
                    </span>
                  </span>
                  <span className="text-2xl text-slate-400">→</span>
                </a>
              );
            })}
          </div>

          <div className="rounded-[18px] border border-dashed border-slate-300 bg-[#f9fbf9] p-4 font-mono text-[0.98rem] leading-8 text-[#14532d]">
            {activeContact.defaultMessage}
          </div>

          <p className="text-sm text-slate-500">
            Si usas escritorio, se abrirá <strong>WhatsApp Web</strong>.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Abrir WhatsApp"
        className="relative flex h-[58px] w-[58px] items-center justify-center rounded-[18px] border-2 border-white bg-[#25D366] text-white shadow-[0_16px_32px_rgba(37,211,102,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(37,211,102,0.34)]"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[16px] border border-white/40" />
        <span className="pointer-events-none absolute inset-0 rounded-[16px] bg-[radial-gradient(circle,rgba(255,255,255,0.26)_0%,transparent_62%)] opacity-80 animate-pulse" />
        <WhatsAppGlyph />
      </button>
    </div>
  );
}

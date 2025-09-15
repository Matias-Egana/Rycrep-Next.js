import React, { useEffect, useMemo, useRef, useState } from "react";
import "./WhatsAppWidget.css";

type Position = "bottom-right" | "bottom-left";

type WhatsAppWidgetProps = {
  /** Número en formato E.164 SIN el "+" (ej: "56998765432") */
  phone: string;
  /** Mensaje por defecto para prellenar el chat */
  defaultMessage?: string;
  /** Posición del widget */
  position?: Position;
  /** Abrir popover tras X ms (0 = no autoabrir) */
  autoOpenDelay?: number;
  /** Texto del botón principal */
  ctaLabel?: string;
  /** Título cabecera del popover */
  title?: string;
  /** Subtítulo/estado (ej: “Respondemos rápido”) */
  subtitle?: string;
  /** Color de acento (hex o CSS var) */
  accentColor?: string;
  /** Z-index del widget (por si compite con tu header) */
  zIndex?: number;
  /** Mensaje breve al pasar el mouse por el botón */
  tooltip?: string;
};

function sanitizePhone(raw: string): string {
  // Solo dígitos
  return (raw || "").replace(/\D+/g, "");
}

function buildWhatsAppUrl(phone: string, text: string) {
  const sanitized = sanitizePhone(phone);
  const msg = encodeURIComponent(text || "");
  // wa.me funciona bien en desktop y mobile y evita protocol handlers bloqueados
  return `https://wa.me/${sanitized}?text=${msg}`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

export default function WhatsAppWidget({
  phone,
  defaultMessage = "¡Hola! Vengo desde tu sitio y tengo una consulta.",
  position = "bottom-right",
  autoOpenDelay = 0,
  ctaLabel = "Chatear por WhatsApp",
  title = "¿Hablamos por WhatsApp?",
  subtitle = "Respondemos rápido",
  accentColor = "#25D366",
  zIndex = 60,
  tooltip = "Escríbenos por WhatsApp",
}: WhatsAppWidgetProps) {
  const [open, setOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const firstOpenRef = useRef(false);

  const href = useMemo(
    () => buildWhatsAppUrl(phone, defaultMessage),
    [phone, defaultMessage]
  );

  useEffect(() => {
    if (autoOpenDelay > 0 && !firstOpenRef.current) {
      const t = setTimeout(() => {
        setOpen(true);
        firstOpenRef.current = true;
      }, autoOpenDelay);
      return () => clearTimeout(t);
    }
  }, [autoOpenDelay]);

  return (
    <div
      className={`wa-widget ${position}`}
      style={
        {
          "--wa-accent": accentColor,
          "--wa-z": String(zIndex),
        } as React.CSSProperties
      }
      aria-live="polite"
    >
      {/* Popover */}
      <div
        className={`wa-popover ${open ? "open" : ""} ${
          reducedMotion ? "no-motion" : ""
        }`}
        role="dialog"
        aria-modal="false"
        aria-label="Contactar por WhatsApp"
      >
        <div className="wa-popover__header">
          <div className="wa-popover__avatar" aria-hidden>
            {/* Bubble con el ícono */}
            <WhatsAppIcon />
          </div>
          <div className="wa-popover__titles">
            <strong className="wa-popover__title">{title}</strong>
            <span className="wa-popover__subtitle">{subtitle}</span>
          </div>
          <button
            className="wa-popover__close"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="wa-popover__body">
          <p className="wa-popover__text">
            Te abriremos WhatsApp con este mensaje prellenado:
          </p>
          <div className="wa-popover__msg" aria-label="Mensaje de ejemplo">
            {defaultMessage}
          </div>

          <a
            className="wa-popover__cta"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="whatsapp_cta"
          >
            <WhatsAppIcon />
            <span>{ctaLabel}</span>
          </a>

          <small className="wa-popover__hint">
            Si usas escritorio, se abrirá{" "}
            <strong>Web WhatsApp</strong>.
          </small>
        </div>
      </div>

      {/* Botón flotante */}
      <button
        className="wa-fab"
        aria-label="Abrir contacto WhatsApp"
        onClick={() => setOpen(v => !v)}
        title={tooltip}
      >
        <WhatsAppIcon />
        <span className="wa-fab__pulse" aria-hidden />
      </button>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="wa-icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20.52 3.48A11.86 11.86 0 0 0 12.01 0C5.38 0 .03 5.35.03 11.97c0 2.11.55 4.2 1.6 6.03L0 24l6.2-1.6c1.78.97 3.8 1.49 5.83 1.49h.01c6.63 0 12-5.35 12-11.97 0-3.2-1.24-6.2-3.52-8.45zM12.04 21.3h-.01c-1.8 0-3.56-.48-5.1-1.38l-.37-.22-3.68.95.98-3.59-.24-.37a9.6 9.6 0 0 1-1.5-5.05c0-5.29 4.31-9.6 9.62-9.6 2.56 0 4.97 1 6.78 2.8a9.55 9.55 0 0 1 2.83 6.8c0 5.29-4.31 9.6-9.61 9.6zm5.58-7.16c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.97 1.18-.18.2-.36.23-.66.08-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.47-1.73-1.64-2.02-.17-.3-.02-.46.13-.61.13-.13.3-.33.45-.49.15-.16.2-.28.3-.48.1-.2.05-.38-.02-.53-.08-.15-.69-1.67-.95-2.29-.25-.6-.5-.52-.69-.53h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.13 3.25 5.16 4.55.72.31 1.29.49 1.73.63.73.23 1.39.2 1.92.12.59-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"
        fill="currentColor"
      />
    </svg>
  );
}

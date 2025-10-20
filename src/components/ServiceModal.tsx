import React from "react";
import type { Service } from "../types/services";

/** -----------------------------
 * Iconos (React components SVG)
 * ----------------------------*/
const IconClose: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
  </svg>
);

const IconChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/** -----------------------------
 * Helpers de embed
 * ----------------------------*/
type EmbedProps = {
  src: string;
  allow?: string;
  titleSuffix?: string;
};

function getEmbedProps(rawUrl: string): EmbedProps {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    // si recibimos directamente una URL de embed ya válida, úsala tal cual
    return { src: rawUrl, allow: defaultAllow };
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  // Facebook (cualquier URL pública)
  if (host.includes("facebook.com")) {
    const href = encodeURIComponent(rawUrl);
    const src = `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&width=1280&height=720`;
    return {
      src,
      allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share",
      titleSuffix: " (Facebook)",
    };
  }

  // YouTube (watch?v= o youtu.be o /embed/)
  if (host.includes("youtube.com") || host === "youtu.be") {
    const id =
      url.searchParams.get("v") ||
      (host === "youtu.be" ? url.pathname.slice(1) : "") ||
      (url.pathname.startsWith("/embed/") ? url.pathname.split("/embed/")[1] : "");
    const embed = id ? `https://www.youtube.com/embed/${id}` : rawUrl;
    return {
      src: embed,
      allow: defaultAllow,
      titleSuffix: " (YouTube)",
    };
  }

  // Vimeo (básico)
  if (host.includes("vimeo.com")) {
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[0];
    const embed = id ? `https://player.vimeo.com/video/${id}` : rawUrl;
    return {
      src: embed,
      allow: defaultAllow,
      titleSuffix: " (Vimeo)",
    };
  }

  // Fallback: usar como está
  return { src: rawUrl, allow: defaultAllow };
}

const defaultAllow =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

type Props = {
  open: boolean;
  onClose: () => void;
  service: Service | null;
};

const EmptyImg =
  "https://placehold.co/960x540/FFFFFF/000000?text=Imagen+no+disponible";

export default function ServiceModal({ open, onClose, service }: Props) {
  const [tab, setTab] = React.useState<"imagenes" | "video">("imagenes");
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      setTab("imagenes");
      setIdx(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !service) return null;

  const imgs = service.images?.length ? service.images : [EmptyImg];

  const prev = () => setIdx((p) => (p === 0 ? imgs.length - 1 : p - 1));
  const next = () => setIdx((p) => (p === imgs.length - 1 ? 0 : p + 1));

  // Embed props según proveedor
  const embed = getEmbedProps(service.videoUrl);

  return (
    <div className="svc-modal" role="dialog" aria-modal="true">
      <div className="svc-modal__backdrop" onClick={onClose} />

      <div className="svc-modal__panel" role="document">
        <header className="svc-modal__header">
          <div>
            <h3 className="svc-modal__title">{service.title}</h3>
            {service.subtitle && (
              <p className="svc-modal__subtitle">{service.subtitle}</p>
            )}
          </div>

          {/* Close */}
          <button
            className="svc-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
            type="button"
          >
            <IconClose width={18} height={18} aria-hidden="true" />
          </button>
        </header>

        <div className="svc-modal__tabs">
          <button
            className={`tab ${tab === "imagenes" ? "is-active" : ""}`}
            onClick={() => setTab("imagenes")}
            type="button"
          >
            Imágenes
          </button>
          <button
            className={`tab ${tab === "video" ? "is-active" : ""}`}
            onClick={() => setTab("video")}
            type="button"
          >
            Video
          </button>
        </div>

        <div className="svc-modal__content">
          {tab === "imagenes" ? (
            <div className="gallery">
              <div className="gallery__viewport">
                <img
                  src={imgs[idx]}
                  alt={`${service.title} – imagen ${idx + 1}`}
                />

                {imgs.length > 1 && (
                  <>
                    <button
                      className="gallery__ctrl gallery__ctrl--prev"
                      onClick={prev}
                      aria-label="Anterior"
                      type="button"
                    >
                      <IconChevronLeft width={24} height={24} aria-hidden="true" />
                    </button>
                    <button
                      className="gallery__ctrl gallery__ctrl--next"
                      onClick={next}
                      aria-label="Siguiente"
                      type="button"
                    >
                      <IconChevronRight width={24} height={24} aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              {imgs.length > 1 && (
                <div className="gallery__dots" role="tablist" aria-label="Paginación de imágenes">
                  {imgs.map((_, i) => (
                    <button
                      key={i}
                      className={`dot ${i === idx ? "is-active" : ""}`}
                      onClick={() => setIdx(i)}
                      aria-label={`Ir a imagen ${i + 1}`}
                      type="button"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="video">
              <iframe
                title={`Video ${service.title}${embed.titleSuffix || ""}`}
                src={embed.src}
                allow={embed.allow || defaultAllow}
                allowFullScreen
              />
            </div>
          )}

          <aside className="svc-modal__info">
            <p className="svc-modal__summary">{service.summary}</p>

            {service.blocks.map((b) => (
              <section key={b.label} className="svc-modal__block">
                <h4 className="svc-modal__blockTitle">{b.label}</h4>
                <ul className="svc-modal__list">
                  {b.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </section>
            ))}
          </aside>
        </div>

        <footer className="svc-modal__footer">
          <a
            className="btn btn--primary"
            href="/contacto"
            onClick={(e) => {
              // Si usas router SPA, reemplaza por navigate("/contacto")
              e.stopPropagation();
            }}
          >
            Solicitar cotización
          </a>
          <button className="btn btn--danger" onClick={() => setTab("video")} type="button">
            Ver video
          </button>
        </footer>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { XIcon } from "@/components/site/icons";
import type { HomeService } from "@/components/site/home/types";

type ServiceDetailModalProps = {
  open: boolean;
  onClose: () => void;
  service: HomeService | null;
  initialTab?: "images" | "video";
};

const EMPTY_IMAGE = "https://placehold.co/960x540/FFFFFF/111827?text=Imagen+no+disponible";

function getEmbedUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host.includes("facebook.com")) {
      const href = encodeURIComponent(rawUrl);
      return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&width=1280&height=720`;
    }

    if (host.includes("youtube.com") || host === "youtu.be") {
      const id =
        url.searchParams.get("v") ||
        (host === "youtu.be" ? url.pathname.slice(1) : "") ||
        (url.pathname.startsWith("/embed/") ? url.pathname.split("/embed/")[1] : "");
      return id ? `https://www.youtube.com/embed/${id}` : rawUrl;
    }

    if (host.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : rawUrl;
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
}

export function ServiceDetailModal({
  open,
  onClose,
  service,
  initialTab = "images",
}: ServiceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"images" | "video">(initialTab);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!open) return;
    setActiveTab(initialTab);
    setActiveImage(0);
  }, [open, initialTab, service?.id]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const images = useMemo(() => {
    if (!service?.images?.length) return [EMPTY_IMAGE];
    return service.images;
  }, [service]);

  if (!open || !service) return null;

  const hasVideo = Boolean(service.videoUrl);
  const embedUrl = hasVideo ? getEmbedUrl(service.videoUrl ?? "") : "";

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto px-3 py-4 sm:px-6 sm:py-8">
      <button
        type="button"
        className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Cerrar detalle del servicio"
      />

      <div className="relative z-10 mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-[1380px] flex-col overflow-hidden border-[3px] border-[#20284e] bg-white shadow-[0_40px_90px_rgba(15,23,42,0.3)] sm:max-h-[calc(100vh-4rem)]">
        <header className="shrink-0 border-b-[3px] border-[#cf2f2f] px-5 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-3xl font-extrabold tracking-[-0.03em] text-[#101828] sm:text-4xl">
                {service.title}
              </h3>
              {service.subtitle ? (
                <p className="mt-3 max-w-5xl text-[1rem] leading-8 text-[#334155] sm:text-[1.06rem]">
                  {service.subtitle}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#20284e] text-white transition duration-300 hover:scale-105 hover:bg-[#111a3f]"
              aria-label="Cerrar"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("images")}
              className={`rounded-2xl border-[3px] px-5 py-3 text-[1rem] font-extrabold transition duration-300 ${
                activeTab === "images"
                  ? "border-[#20284e] bg-[#20284e] text-white shadow-[0_10px_24px_rgba(32,40,78,0.16)]"
                  : "border-[#20284e] bg-white text-[#111827] hover:bg-slate-50"
              }`}
            >
              Imágenes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              disabled={!hasVideo}
              className={`rounded-2xl border-[3px] px-5 py-3 text-[1rem] font-extrabold transition duration-300 ${
                activeTab === "video"
                  ? "border-[#20284e] bg-[#20284e] text-white shadow-[0_10px_24px_rgba(32,40,78,0.16)]"
                  : "border-[#20284e] bg-white text-[#111827] hover:bg-slate-50"
              } ${!hasVideo ? "cursor-not-allowed opacity-40" : ""}`}
            >
              Video
            </button>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.8fr]">
            <div className="transition-all duration-300">
              {activeTab === "images" ? (
                <div className="space-y-4 opacity-100 transition-opacity duration-300">
                  <div className="overflow-hidden border-[3px] border-[#20284e] bg-[#f8fafc]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[activeImage]}
                      alt={`${service.title} - imagen ${activeImage + 1}`}
                      className="h-[320px] w-full object-cover transition duration-500 hover:scale-[1.02] sm:h-[440px]"
                    />
                  </div>

                  {images.length > 1 ? (
                    <div className="flex flex-wrap gap-3">
                      {images.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() => setActiveImage(index)}
                          className={`overflow-hidden border-[3px] transition duration-300 ${
                            activeImage === index ? "border-[#cf2f2f]" : "border-[#20284e]/20 hover:border-[#20284e]"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image} alt={`${service.title} miniatura ${index + 1}`} className="h-16 w-24 object-cover sm:h-20 sm:w-28" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : hasVideo ? (
                <div className="overflow-hidden border-[3px] border-[#20284e] bg-black shadow-[0_18px_40px_rgba(15,23,42,0.12)] opacity-100 transition-opacity duration-300">
                  <div className="aspect-video w-full">
                    <iframe
                      title={`Video ${service.title}`}
                      src={embedUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center border-[3px] border-dashed border-[#20284e]/30 bg-slate-50 text-center text-[#475569] sm:min-h-[440px]">
                  No hay video disponible para este servicio.
                </div>
              )}
            </div>

            <aside className="space-y-5 border-[3px] border-[#20284e] bg-white p-5 sm:p-6">
              <p className="text-[1rem] leading-8 text-[#111827] sm:text-[1.02rem]">{service.summary}</p>

              {(service.blocks ?? []).map((block) => (
                <section key={block.label} className="space-y-3">
                  <h4 className="text-[1.05rem] font-extrabold uppercase tracking-[0.01em] text-[#20284e]">
                    {block.label}
                  </h4>
                  <ul className="space-y-3 pl-6 text-[1rem] leading-8 text-[#111827]">
                    {block.items.map((item, index) => (
                      <li key={`${block.label}-${index}`} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </aside>
          </div>
        </div>

        <footer className="shrink-0 flex flex-wrap items-center gap-3 border-t-[3px] border-[#20284e] px-5 py-5 sm:px-8">
          <Link
            href="/cotizacion"
            className="rounded-xl bg-[#20284e] px-5 py-3 text-[1rem] font-extrabold text-white shadow-[0_12px_24px_rgba(32,40,78,0.16)] transition duration-300 hover:-translate-y-0.5"
          >
            Solicitar cotización
          </Link>
          {hasVideo ? (
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className="rounded-xl bg-[#20284e] px-5 py-3 text-[1rem] font-extrabold text-white shadow-[0_12px_24px_rgba(32,40,78,0.16)] transition duration-300 hover:-translate-y-0.5"
            >
              Ver video
            </button>
          ) : null}
        </footer>
      </div>
    </div>
  );
}

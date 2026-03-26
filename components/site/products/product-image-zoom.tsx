"use client";

import { useState } from "react";

type ProductImageZoomProps = {
  src: string | null;
  alt: string;
};

export function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");
  const [active, setActive] = useState(false);

  if (!src) {
    return (
      <div className="flex h-[420px] items-center justify-center bg-slate-100 text-slate-400">
        Sin imagen disponible
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-[22px] bg-slate-100"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setTransformOrigin("50% 50%");
      }}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        setTransformOrigin(`${x}% ${y}%`);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`h-[420px] w-full object-cover transition duration-300 ease-out ${active ? "scale-[1.7]" : "scale-100"}`}
        style={{ transformOrigin }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(15,23,42,0.08)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#263160] shadow-[0_10px_24px_rgba(15,23,42,0.14)] opacity-0 transition duration-300 group-hover:opacity-100">
        Zoom
      </div>
    </div>
  );
}

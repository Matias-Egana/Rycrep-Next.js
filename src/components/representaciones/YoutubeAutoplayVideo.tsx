import { useMemo } from "react";

type Props = {
  /** URL de YouTube: watch?v=..., youtu.be/..., shorts/..., embed/... */
  url: string;
  className?: string;
  /** Texto del botón (por defecto: "Ver video") */
  title?: string;
};

/** Normaliza la URL para que apunte a una vista válida de YouTube (watch o youtu.be) */
function normalizeYouTubeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");

    // youtu.be/<id>  -> lo dejamos tal cual
    if (host === "youtu.be") return u.toString();

    // youtube.com
    if (host.endsWith("youtube.com")) {
      // /watch?v=<id> -> ok
      if (u.pathname === "/watch" && u.searchParams.get("v")) return u.toString();

      // /embed/<id>  -> lo convertimos a /watch?v=<id>
      const m = u.pathname.match(/\/(embed|shorts)\/([a-zA-Z0-9_-]{6,})/);
      if (m) {
        const id = m[2];
        const clean = new URL("https://www.youtube.com/watch");
        clean.searchParams.set("v", id);
        return clean.toString();
      }
    }

    // fallback
    return raw;
  } catch {
    return raw;
  }
}

/**
 * En vez del reproductor, mostramos un pequeño botón que abre YouTube.
 */
export default function YoutubeAutoplayVideo({
  url,
  className,
  title = "Ver video",
}: Props) {
  const finalUrl = useMemo(() => normalizeYouTubeUrl(url), [url]);

  return (
    <div className={`nb-yt-block ${className || ""}`} aria-label="Video destacado">
      <div className="nb-yt-inner">
        <a
          className="nb-yt-btn"
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} en YouTube (se abre en una nueva pestaña)`}
        >
          <svg
            className="nb-yt-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 8l6 4-6 4V8z" />
          </svg>
          {title}
        </a>
      </div>
    </div>
  );
}

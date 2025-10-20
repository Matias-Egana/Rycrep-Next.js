import type { Service } from "../types/services";

type Props = {
  service: Service;
  onOpen: (s: Service) => void;
};

const EmptyImg =
  "https://placehold.co/960x540/FFFFFF/000000?text=Imagen+no+disponible";

export default function ServiceCard({ service, onOpen }: Props) {
  const cover = service.images?.[0] || EmptyImg;

  return (
    <article className="svc-card" aria-labelledby={`${service.id}-h1`}>
      <div className="svc-card__media">
        <img src={cover} alt={`Imagen de ${service.title}`} loading="lazy" />
        <span className="svc-card__tag">{service.subtitle || "Servicio"}</span>
      </div>

      <div className="svc-card__body">
        <h3 id={`${service.id}-h1`} className="svc-card__title">
          {service.title}
        </h3>

        <p className="svc-card__summary">{service.summary}</p>

        <div className="svc-card__cta">
          <button
            className="btn btn--primary"
            onClick={() => onOpen(service)}
            aria-label={`Ver más sobre ${service.title}`}
          >
            Ver más
          </button>

          <button
            className="btn btn--danger"
            onClick={() => onOpen(service)}
            aria-label={`Ver video de ${service.title}`}
          >
            Ver video
          </button>
        </div>
      </div>
    </article>
  );
}

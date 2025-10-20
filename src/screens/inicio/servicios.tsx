import React from "react";
import "./Servicios.css";
import ServiceCard from "../../components/ServiceCard";
import ServiceModal from "../../components/ServiceModal";
import type { Service } from "../../types/services";

// Asegúrate de tener "resolveJsonModule": true en tu tsconfig.json
import services from "../../data/services.json";

export default function Servicios() {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Service | null>(null);

  const handleOpen = (s: Service) => {
    setCurrent(s);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrent(null);
  };

  const top = React.useMemo(
    () => ({
      title: "Servicios Industriales y Mineros",
      lead:
        "Mantenimiento integral eléctrico, electrónico y diésel. " +
        "Control y automatización con foco en seguridad, trazabilidad y disponibilidad operacional.",
    }),
    []
  );

  return (
    <main className="svc">
      <section className="svc-hero">
        <div className="svc-hero__stripe" />
        <h1 className="svc-hero__title">{top.title}</h1>
        <p className="svc-hero__lead">{top.lead}</p>
      </section>

      <section className="svc-grid" aria-label="Listado de servicios">
        {(services as Service[]).map((s) => (
          <ServiceCard key={s.id} service={s} onOpen={handleOpen} />
        ))}
      </section>

      <ServiceModal open={open} onClose={handleClose} service={current} />
    </main>
  );
}

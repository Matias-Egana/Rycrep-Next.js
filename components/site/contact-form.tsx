"use client";

import { useState, useTransition } from "react";

type FormState = {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  empresa: string;
  ciudad: string;
  region: string;
  mensaje: string;
};

const initialState: FormState = {
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  empresa: "",
  ciudad: "",
  region: "",
  mensaje: "",
};

const regions = [
  "Arica y Parinacota",
  "Tarapaca",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaiso",
  "Metropolitana de Santiago",
  "O'Higgins",
  "Maule",
  "Nuble",
  "Biobio",
  "La Araucania",
  "Los Rios",
  "Los Lagos",
  "Aysen",
  "Magallanes",
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(name: keyof FormState, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const sanitizedData = {
      ...formData,
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      empresa: formData.empresa.trim(),
      ciudad: formData.ciudad.trim(),
      region: formData.region.trim(),
      mensaje: formData.mensaje.trim(),
    };

    if (!sanitizedData.telefono) {
      setStatus({
        type: "error",
        message: "Ingresa un telefono valido antes de enviar la solicitud.",
      });
      return;
    }

    if (sanitizedData.nombre.length < 2 || sanitizedData.apellidos.length < 2) {
      setStatus({
        type: "error",
        message: "Ingresa tu nombre y apellidos con al menos 2 caracteres.",
      });
      return;
    }

    if (sanitizedData.mensaje.length < 8) {
      setStatus({
        type: "error",
        message: "Describe un poco mas tu solicitud para poder enviarla correctamente.",
      });
      return;
    }

    const phoneDigits = sanitizedData.telefono.replace(/\D+/g, "");
    if (phoneDigits.length < 8) {
      setStatus({
        type: "error",
        message: "Ingresa un telefono valido, idealmente con al menos 8 digitos.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sanitizedData),
        });

        if (!response.ok) {
          const errorJson = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(errorJson?.message || "No fue posible enviar la solicitud.");
        }

        setFormData(initialState);
        setStatus({
          type: "success",
          message: "Mensaje enviado correctamente. Te contactaremos a la brevedad.",
        });
      } catch (error) {
        console.error(error);
        setStatus({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Hubo un problema al enviar el formulario. Intenta nuevamente en unos minutos.",
        });
      }
    });
  }

  return (
    <form className="panel-strong grid gap-4 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit}>
      <input
        className="rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(event) => handleChange("nombre", event.target.value)}
        required
      />
      <input
        className="rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30"
        placeholder="Apellidos"
        value={formData.apellidos}
        onChange={(event) => handleChange("apellidos", event.target.value)}
        required
      />
      <input
        className="rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30 sm:col-span-2"
        type="email"
        placeholder="Correo electronico"
        value={formData.email}
        onChange={(event) => handleChange("email", event.target.value)}
        required
      />
      <input
        className="rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30"
        placeholder="Telefono"
        value={formData.telefono}
        onChange={(event) => handleChange("telefono", event.target.value)}
        required
      />
      <input
        className="rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30"
        placeholder="Empresa"
        value={formData.empresa}
        onChange={(event) => handleChange("empresa", event.target.value)}
      />
      <input
        className="rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30"
        placeholder="Ciudad"
        value={formData.ciudad}
        onChange={(event) => handleChange("ciudad", event.target.value)}
      />
      <select
        className="rounded-2xl border bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        value={formData.region}
        onChange={(event) => handleChange("region", event.target.value)}
      >
        <option value="">Selecciona una region</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <textarea
        className="min-h-36 rounded-3xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/30 sm:col-span-2"
        placeholder="Cuentanos que necesitas: equipo, marca, plazo, faena o problema tecnico."
        value={formData.mensaje}
        onChange={(event) => handleChange("mensaje", event.target.value)}
        required
      />
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="primary-button" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar solicitud"}
        </button>
        {status ? (
          <p className={`text-sm ${status.type === "success" ? "text-emerald-300" : "text-rose-300"}`}>{status.message}</p>
        ) : (
          <p className="text-sm text-[color:var(--color-muted)]">Tiempo de respuesta comercial estimado: menos de 24 horas.</p>
        )}
      </div>
    </form>
  );
}

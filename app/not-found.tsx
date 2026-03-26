import Link from "next/link";
import { ArrowRightIcon } from "@/components/site/icons";

export default function NotFound() {
  return (
    <div className="section">
      <div className="shell">
        <div className="panel-strong space-y-6 p-10 text-center">
          <span className="eyebrow">404</span>
          <h1 className="section-title">La ruta que buscas no está disponible.</h1>
          <p className="mx-auto max-w-2xl text-[color:var(--color-muted)]">
            La nueva estructura ya está organizada para seguir creciendo, pero esta página todavía no existe en la migración actual.
          </p>
          <div className="flex justify-center">
            <Link href="/" className="primary-button">
              Volver al inicio
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

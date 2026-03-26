"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CmsNavbar } from "@/components/site/cms/cms-navbar";
import { cmsAuth } from "@/lib/cms-auth";

const cards = [
  {
    href: "/cms/productos",
    title: "Productos",
    copy: "Administra catalogo, precios, imagenes y productos en oferta desde una sola tabla editable.",
  },
  {
    href: "/cms/change-password",
    title: "Seguridad",
    copy: "Actualiza tu contrasena con politica reforzada y manten la cuenta protegida.",
  },
];

export function CmsDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) {
      router.replace("/cms/login");
      return;
    }
    if (!cmsAuth.isMfaEnabled()) {
      router.replace("/cms/mfa");
      return;
    }
    setReady(true);
  }, [router]);

  const user = useMemo(() => cmsAuth.getUser(), [ready]);

  if (!ready) return <div className="min-h-screen bg-[#0d132b]" />;

  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <CmsNavbar />
      <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6">
        <div className="rounded-[32px] bg-[linear-gradient(135deg,#18214a_0%,#253469_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] sm:p-10">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
            Panel administrativo
          </span>
          <h1 className="mt-4 text-[2.4rem] font-black tracking-[-0.05em]">
            Hola{user?.username ? `, @${user.username}` : ""}.
          </h1>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e63a39]">
                Modulo
              </p>
              <h2 className="mt-4 text-[1.65rem] font-black tracking-[-0.04em] text-[#111827]">
                {card.title}
              </h2>
              <p className="mt-3 text-[1rem] leading-7 text-slate-500">
                {card.copy}
              </p>
              <span className="mt-6 inline-flex text-sm font-bold text-[#1d2f6f] transition group-hover:translate-x-1">
                Abrir modulo {"->"}
              </span>
            </Link>
          ))}

          {cmsAuth.canManageMfa() ? (
            <Link
              href="/cms/mfa-admin"
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e63a39]">
                Permisos
              </p>
              <h2 className="mt-4 text-[1.65rem] font-black tracking-[-0.04em] text-[#111827]">
                Gestion de MFA
              </h2>
              <p className="mt-3 text-[1rem] leading-7 text-slate-500">
                Resetea el segundo factor de otros usuarios cuando pierdan acceso a su aplicacion autenticadora.
              </p>
              <span className="mt-6 inline-flex text-sm font-bold text-[#1d2f6f] transition group-hover:translate-x-1">
                Administrar {"->"}
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

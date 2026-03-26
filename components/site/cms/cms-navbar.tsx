"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cmsAuth } from "@/lib/cms-auth";

const items = [
  { href: "/cms/productos", label: "Productos" },
  { href: "/cms/change-password", label: "Cambiar contraseña" },
];

export function CmsNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = cmsAuth.getUser();
  const canManageMfa = cmsAuth.canManageMfa();

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#111834]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-white sm:px-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/cms"
            className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-black tracking-[0.14em] text-white transition hover:bg-white/12"
          >
            RYCREP CMS
          </Link>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pathname.startsWith(item.href)
                  ? "bg-white text-[#111834]"
                  : "border border-white/12 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {canManageMfa ? (
            <Link
              href="/cms/mfa-admin"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pathname.startsWith("/cms/mfa-admin")
                  ? "bg-white text-[#111834]"
                  : "border border-white/12 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              Gestionar MFA
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/85">
              @{user.username}
            </span>
          ) : null}
          <button
            type="button"
            className="rounded-full bg-[#e63a39] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#d63333]"
            onClick={() => {
              cmsAuth.clear();
              router.replace("/cms/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

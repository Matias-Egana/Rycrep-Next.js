"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/site/cart-context";
import { navItems } from "@/components/site/content";
import logo from "@/src/assets/inicio/ric-logo.svg";
import { MenuIcon, XIcon } from "@/components/site/icons";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/cms") || pathname.startsWith("/setup")) return null;

  const [open, setOpen] = useState(false);
  const [badgeAnimated, setBadgeAnimated] = useState(false);
  const { getTotalItems, notification } = useCart();
  const totalItems = getTotalItems();

  useEffect(() => {
    if (totalItems <= 0) return undefined;
    setBadgeAnimated(true);
    const timeout = window.setTimeout(() => setBadgeAnimated(false), 380);
    return () => window.clearTimeout(timeout);
  }, [totalItems]);

  const quoteButton = (
    <>
      {totalItems > 0 ? (
        <span
          className={`absolute -right-2 -top-2 z-10 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e32034] px-1.5 text-[0.72rem] font-extrabold text-white shadow-[0_10px_24px_rgba(227,32,52,0.35)] ring-2 ring-[#232c57] transition duration-300 ${
            badgeAnimated ? "scale-[1.15]" : "scale-100"
          }`}
        >
          {totalItems}
        </span>
      ) : null}
      <span className="block text-[1.1rem] font-extrabold leading-none tracking-[-0.03em] text-[#232c57] sm:text-[1.15rem]">
        Cotiza Ahora
      </span>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#232c57] shadow-[0_8px_20px_rgba(16,24,40,0.12)]">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1160px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
            <div className="flex items-center rounded-[10px] bg-white px-2.5 py-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
              <Image src={logo} alt="R&C Representaciones" className="h-[34px] w-auto" priority />
            </div>
          </Link>

          <nav className="hidden items-center gap-3 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-[1.03rem] font-semibold transition-all duration-200 ${
                  isActive(pathname, item.href)
                    ? "bg-white text-[#e63a39] shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                    : "text-white hover:bg-white/8"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cotizacion"
            className="relative hidden h-[54px] w-[154px] items-center justify-center rounded-[14px] bg-white px-5 text-center shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(0,0,0,0.18)] sm:inline-flex"
          >
            {quoteButton}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#232c57] px-4 py-4 lg:hidden">
          <div className="mx-auto max-w-[1160px] space-y-2 rounded-2xl bg-[#1c2448] p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive(pathname, item.href)
                    ? "bg-white text-[#e63a39]"
                    : "text-white hover:bg-white/5"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/cotizacion"
              className="relative mt-2 inline-flex h-[54px] w-full items-center justify-center rounded-[14px] bg-white px-4 text-center shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition-transform duration-300 hover:-translate-y-0.5"
              onClick={() => setOpen(false)}
            >
              {quoteButton}
            </Link>
          </div>
        </div>
      ) : null}

      <div
        className={`pointer-events-none fixed right-4 top-[92px] z-[70] w-[min(92vw,360px)] transition-all duration-500 sm:right-6 sm:top-[98px] ${
          notification?.visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        aria-live="polite"
      >
        {notification?.visible ? (
          <div className="rounded-[18px] border border-slate-200 bg-white p-4 text-[#111827] shadow-[0_20px_38px_rgba(15,23,42,0.18)] backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                {notification.product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={notification.product.images[0]} alt={notification.product.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="px-2 text-center text-[0.7rem] font-semibold text-slate-400">Sin imagen</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-500">Producto añadido:</p>
                <h3 className="mt-1 line-clamp-2 text-[1rem] font-extrabold leading-5 text-[#111827]">
                  {notification.product.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">Código: {notification.product.product_code}</p>
                <p className="mt-1 text-sm text-slate-500">Cantidad: {notification.product.quantity}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

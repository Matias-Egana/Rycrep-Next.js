import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/site/cart-context";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { WhatsAppWidget } from "@/components/site/whatsapp-widget";

export const metadata: Metadata = {
  title: "R&C Representaciones | Soluciones Técnicas para Minería",
  description:
    "Migración a Next.js, Tailwind CSS y TypeScript con una experiencia UX/UI rediseñada para R&C Representaciones.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="text-[color:var(--color-text)] antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppWidget />
        </CartProvider>
      </body>
    </html>
  );
}

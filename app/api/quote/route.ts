import { NextResponse } from "next/server";
import { z } from "zod";

const quoteSchema = z.object({
  userData: z.object({
    nombre: z.string().trim().min(1),
    apellidos: z.string().trim().min(1),
    email: z.string().trim().email(),
    telefono: z.string().trim().min(1),
    empresa: z.string().trim().optional(),
    ciudad: z.string().trim().optional(),
    region: z.string().trim().optional(),
    mensaje: z.string().trim().min(1),
  }),
  productos: z.array(
    z.object({
      name: z.string().optional(),
      product_code: z.string().optional(),
      quantity: z.coerce.number().min(1),
      price: z.coerce.number().nonnegative().optional(),
    }),
  ).min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = quoteSchema.parse(json);
    const backendPayload = {
      userData: payload.userData,
      productos: payload.productos.map((product) => ({
        name: product.name,
        product_code: product.product_code,
        quantity: product.quantity,
        price: product.price ?? 0,
      })),
      items: payload.productos.map((product) => ({
        name: product.name,
        product_code: product.product_code,
        quantity: product.quantity,
        price: product.price ?? 0,
      })),
    };
    const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json({ message: "Falta configurar API_BASE_URL." }, { status: 500 });
    }

    const response = await fetch(`${apiBaseUrl}/send-cotizacion/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload),
      cache: "no-store",
    });

    if (!response.ok) {
      let backendMessage = "El backend rechazo la cotizacion.";

      try {
        const rawText = await response.text();
        try {
          const errorJson = JSON.parse(rawText) as { detail?: string; message?: string };
          backendMessage = errorJson.detail || errorJson.message || backendMessage;
        } catch {
          if (rawText.trim()) backendMessage = rawText.trim();
        }
      } catch {
        // Keep fallback message when backend response is not readable.
      }

      if (response.status === 429) {
        backendMessage = "Demasiados intentos seguidos. Espera un momento antes de volver a enviar la cotizacion.";
      }

      return NextResponse.json({ message: backendMessage }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Revisa los campos obligatorios y el carrito antes de enviar la cotizacion." },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "No fue posible procesar la cotizacion." }, { status: 400 });
  }
}

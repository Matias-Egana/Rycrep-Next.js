import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  nombre: z.string().trim().min(1),
  apellidos: z.string().trim().min(1),
  email: z.string().trim().email(),
  telefono: z.string().trim().min(1),
  empresa: z.string().trim().optional(),
  ciudad: z.string().trim().optional(),
  region: z.string().trim().optional(),
  mensaje: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = contactSchema.parse(json);
    const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { message: "Falta configurar API_BASE_URL o NEXT_PUBLIC_API_BASE_URL." },
        { status: 500 },
      );
    }

    const response = await fetch(`${apiBaseUrl}/send-contacto/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      let backendMessage = "El backend rechazo la solicitud de contacto.";

      try {
        const rawText = await response.text();
        try {
          const errorJson = JSON.parse(rawText) as { detail?: string; message?: string };
          backendMessage = errorJson.detail || errorJson.message || backendMessage;
        } catch {
          if (rawText.trim()) backendMessage = rawText.trim();
        }
      } catch {
        // Keep fallback message when backend response is not JSON.
      }

      if (response.status === 429) {
        backendMessage = "Demasiados intentos seguidos. Espera un momento antes de volver a enviar el formulario.";
      }

      return NextResponse.json({ message: backendMessage }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Revisa los campos obligatorios del formulario antes de enviarlo." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "No fue posible procesar el formulario de contacto." },
      { status: 400 },
    );
  }
}

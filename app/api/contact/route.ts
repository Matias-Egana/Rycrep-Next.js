import { NextResponse } from "next/server";
import { z } from "zod";
import {
  contactBodySchema,
  sanitizeContactData,
  validateContactData,
} from "@/lib/server/public-validation";
import { sendContactEmails } from "@/lib/server/public-mail";

const contactSchema = contactBodySchema.extend({
  mensaje: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = contactSchema.parse(json);
    const validationErrors = validateContactData(payload);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: "Datos invalidos", errors: validationErrors },
        { status: 400 },
      );
    }

    await sendContactEmails(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Revisa los campos obligatorios del formulario antes de enviarlo." },
        { status: 400 },
      );
    }

    console.error("Error al enviar correo de contacto.", error, {
      endpoint: "/api/contact",
    });

    return NextResponse.json(
      { message: "Error al enviar correo." },
      { status: 500 },
    );
  }
}

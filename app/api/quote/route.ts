import { NextResponse } from "next/server";
import { z } from "zod";
import {
  contactBodySchema,
  validateContactData,
} from "@/lib/server/public-validation";
import { sendQuoteEmails } from "@/lib/server/public-mail";

const quoteSchema = z.object({
  userData: contactBodySchema.extend({
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
    const validationErrors = validateContactData(payload.userData);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: "Datos invalidos", errors: validationErrors },
        { status: 400 },
      );
    }

    await sendQuoteEmails(
      payload.userData,
      payload.productos.map((product) => ({
        name: product.name,
        product_code: product.product_code,
        quantity: product.quantity,
        price: product.price ?? 0,
      })),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Revisa los campos obligatorios y el carrito antes de enviar la cotizacion." },
        { status: 400 },
      );
    }

    console.error("Error al enviar cotizacion.", error, {
      endpoint: "/api/quote",
    });

    return NextResponse.json({ message: "Error al enviar cotizacion." }, { status: 500 });
  }
}

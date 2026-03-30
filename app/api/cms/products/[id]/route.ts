import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsStaff } from "@/lib/server/cms-auth";
import { isValidCsrfRequest } from "@/lib/server/cms-csrf";
import { updateCmsProduct } from "@/lib/server/cms-products";

const patchProductSchema = z.object({
  name: z.string().trim().optional(),
  category: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  image_url: z.string().trim().nullable().optional(),
  image: z.string().trim().nullable().optional(),
  price: z.coerce.number().min(0).nullable().optional(),
  oferta: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const auth = await requireCmsStaff(request);
  if (!auth) {
    return NextResponse.json({ detail: "No autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ detail: "ID invalido." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchProductSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ detail: issue?.message || "Datos invalidos." }, { status: 400 });
  }

  try {
    const updated = await updateCmsProduct(productId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ detail: "Producto no encontrado." }, { status: 404 });
  }
}

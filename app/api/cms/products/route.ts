import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsStaff } from "@/lib/server/cms-auth";
import { isValidCsrfRequest } from "@/lib/server/cms-csrf";
import { createCmsProduct, listCmsProducts } from "@/lib/server/cms-products";

const createProductSchema = z.object({
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  brand: z.string().trim().min(1),
  image_url: z.string().trim().optional(),
  image: z.string().trim().nullable().optional(),
  price: z.coerce.number().min(0).nullable().optional(),
  oferta: z.boolean().optional(),
});

export async function GET(request: Request) {
  const auth = await requireCmsStaff(request);
  if (!auth) {
    return NextResponse.json({ detail: "No autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? searchParams.get("q") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "name";
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? searchParams.get("pageSize") ?? "50");

  const result = await listCmsProducts({
    search,
    sortBy,
    order,
    page: Number.isFinite(page) ? page : 1,
    limit: Number.isFinite(limit) ? limit : 50,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const auth = await requireCmsStaff(request);
  if (!auth) {
    return NextResponse.json({ detail: "No autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ detail: issue?.message || "Datos invalidos." }, { status: 400 });
  }

  const created = await createCmsProduct(parsed.data);
  return NextResponse.json(created, { status: 201 });
}

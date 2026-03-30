import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsStaff } from "@/lib/server/cms-auth";
import { isValidCsrfRequest } from "@/lib/server/cms-csrf";
import { confirmMfaForUser } from "@/lib/server/cms-mfa";

const mfaEnableSchema = z.object({
  code: z.string().trim().min(1),
});

export async function POST(request: Request) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const auth = await requireCmsStaff(request);
  if (!auth) {
    return NextResponse.json({ detail: "No autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = mfaEnableSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { detail: "Debes ingresar el codigo MFA de 6 digitos." },
      { status: 400 }
    );
  }

  const ok = await confirmMfaForUser(auth.user.id, parsed.data.code);
  if (!ok) {
    return NextResponse.json({ detail: "Codigo MFA invalido." }, { status: 400 });
  }

  return NextResponse.json({ enabled: true });
}

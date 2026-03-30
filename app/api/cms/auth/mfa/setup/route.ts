import { NextResponse } from "next/server";
import { requireCmsStaff } from "@/lib/server/cms-auth";
import { isValidCsrfRequest } from "@/lib/server/cms-csrf";
import { startMfaSetup } from "@/lib/server/cms-mfa";

export async function POST(request: Request) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const auth = await requireCmsStaff(request);
  if (!auth) {
    return NextResponse.json({ detail: "No autenticado." }, { status: 401 });
  }

  const { otpauthUrl } = await startMfaSetup(auth.user.id, auth.user.username);
  return NextResponse.json({ otpauth_url: otpauthUrl });
}

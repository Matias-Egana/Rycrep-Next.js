import { NextResponse } from "next/server";
import { clearCmsTokenCookie, isValidCsrfRequest } from "@/lib/server/cms-csrf";

export async function POST(request: Request) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const response = new NextResponse(null, { status: 204 });
  clearCmsTokenCookie(response, request);
  return response;
}

import { NextResponse } from "next/server";
import { appendCsrfCookie, issueCsrfToken } from "@/lib/server/cms-csrf";

export async function GET(request: Request) {
  const csrfToken = issueCsrfToken();
  const response = NextResponse.json({ csrfToken });
  appendCsrfCookie(response, request, csrfToken);
  return response;
}

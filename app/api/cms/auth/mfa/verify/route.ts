import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { buildUserPayload, signCmsSessionToken } from "@/lib/server/cms-auth";
import { appendCmsTokenCookie, isValidCsrfRequest } from "@/lib/server/cms-csrf";
import { verifyCmsJwt } from "@/lib/server/cms-jwt";
import { verifyMfaLogin } from "@/lib/server/cms-mfa";
import { getPasswordRotationInfo } from "@/lib/server/cms-password";

const mfaVerifySchema = z.object({
  challenge_token: z.string().min(1),
  code: z.string().trim().min(1),
});

export async function POST(request: Request) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = mfaVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ detail: "Datos incompletos." }, { status: 400 });
  }

  const challenge = verifyCmsJwt(parsed.data.challenge_token);
  if (!challenge || challenge.purpose !== "mfa" || !challenge.sub) {
    return NextResponse.json({ detail: "Token de desafio invalido." }, { status: 400 });
  }

  const user = await prisma.auth_user.findUnique({
    where: { id: Number(challenge.sub) },
  });

  if (!user || !user.is_staff || !user.is_active) {
    return NextResponse.json(
      { detail: "Credenciales invalidas o usuario no autorizado." },
      { status: 401 }
    );
  }

  const ok = await verifyMfaLogin(user.id, parsed.data.code);
  if (!ok) {
    return NextResponse.json({ detail: "Codigo MFA invalido." }, { status: 401 });
  }

  const rotation = getPasswordRotationInfo(user);
  const userPayload = buildUserPayload(user);
  const jwtToken = signCmsSessionToken(user);
  const response = NextResponse.json({
    token: jwtToken,
    user: userPayload,
    password_rotation_warning: rotation.warning,
    password_age_days: rotation.ageDays,
  });
  appendCmsTokenCookie(response, request, jwtToken);
  return response;
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { buildUserPayload, signCmsMfaChallenge, signCmsSessionToken } from "@/lib/server/cms-auth";
import { appendCmsTokenCookie, clearCmsTokenCookie, isValidCsrfRequest } from "@/lib/server/cms-csrf";
import { getPasswordRotationInfo, verifyDjangoPassword } from "@/lib/server/cms-password";
import { getUserMfaConfig } from "@/lib/server/cms-mfa";

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ detail: "Usuario y contrasena son obligatorios." }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const user = await prisma.auth_user.findUnique({ where: { username } });

  if (!user || !user.is_staff || !user.is_active) {
    return NextResponse.json(
      { detail: "Credenciales invalidas o usuario no autorizado." },
      { status: 401 }
    );
  }

  if (!verifyDjangoPassword(password, user.password)) {
    return NextResponse.json(
      { detail: "Credenciales invalidas o usuario no autorizado." },
      { status: 401 }
    );
  }

  const rotation = getPasswordRotationInfo(user);
  const mfaConfig = await getUserMfaConfig(user.id);

  if (!mfaConfig || !mfaConfig.enabled) {
    const token = signCmsSessionToken(user);
    const response = NextResponse.json({
      token,
      user: buildUserPayload(user),
      mfa_required: false,
      password_rotation_warning: rotation.warning,
      password_age_days: rotation.ageDays,
    });
    appendCmsTokenCookie(response, request, token);
    return response;
  }

  const challengeToken = signCmsMfaChallenge(user);
  const response = NextResponse.json({
    mfa_required: true,
    challenge_token: challengeToken,
    user: buildUserPayload(user),
  });
  clearCmsTokenCookie(response, request);
  return response;
}

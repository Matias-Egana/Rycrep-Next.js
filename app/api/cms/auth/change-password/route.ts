import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsStaff, buildUserPayload, signCmsSessionToken } from "@/lib/server/cms-auth";
import { appendCmsTokenCookie, isValidCsrfRequest } from "@/lib/server/cms-csrf";
import {
  hashDjangoPassword,
  validatePasswordStrength,
  verifyDjangoPassword,
} from "@/lib/server/cms-password";
import { prisma } from "@/lib/server/prisma";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
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
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ detail: "Datos incompletos." }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;
  if (!verifyDjangoPassword(currentPassword, auth.user.password)) {
    return NextResponse.json(
      { detail: "La contrasena actual no es valida." },
      { status: 400 }
    );
  }

  if (verifyDjangoPassword(newPassword, auth.user.password)) {
    return NextResponse.json(
      { detail: "La nueva contrasena no puede ser igual a la anterior." },
      { status: 400 }
    );
  }

  const policy = validatePasswordStrength(newPassword, {
    username: auth.user.username,
    email: auth.user.email || undefined,
    fullName: `${auth.user.first_name || ""} ${auth.user.last_name || ""}`.trim() || undefined,
  });

  if (!policy.valid) {
    return NextResponse.json(
      {
        detail: "La nueva contrasena no cumple la politica de seguridad.",
        errors: policy.errors,
      },
      { status: 400 }
    );
  }

  const updated = await prisma.auth_user.update({
    where: { id: auth.user.id },
    data: {
      password: hashDjangoPassword(newPassword),
      password_last_changed: new Date(),
    },
  });

  const token = signCmsSessionToken(updated);
  const response = NextResponse.json({
    message: "Contrasena actualizada correctamente.",
    token,
    user: buildUserPayload(updated),
  });
  appendCmsTokenCookie(response, request, token);
  return response;
}

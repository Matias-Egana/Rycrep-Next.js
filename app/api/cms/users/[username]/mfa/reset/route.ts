import { NextResponse } from "next/server";
import { requireCmsMfaManager } from "@/lib/server/cms-auth";
import { isValidCsrfRequest } from "@/lib/server/cms-csrf";
import { resetMfaForUser } from "@/lib/server/cms-mfa";
import { prisma } from "@/lib/server/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const auth = await requireCmsMfaManager(request);
  if (!auth) {
    return NextResponse.json(
      { detail: "No autorizado para gestionar MFA de usuarios." },
      { status: 403 }
    );
  }

  const { username } = await context.params;
  const trimmed = String(username || "").trim();
  if (!trimmed) {
    return NextResponse.json({ detail: "Nombre de usuario invalido." }, { status: 400 });
  }

  const targetUser = await prisma.auth_user.findUnique({
    where: { username: trimmed },
    select: { id: true, username: true, is_staff: true },
  });

  if (!targetUser || !targetUser.is_staff) {
    return NextResponse.json(
      { detail: "Usuario no encontrado o no es staff." },
      { status: 404 }
    );
  }

  await resetMfaForUser(targetUser.id);

  return NextResponse.json({
    success: true,
    detail: "MFA reseteado para el usuario.",
    userId: targetUser.id,
    username: targetUser.username,
  });
}

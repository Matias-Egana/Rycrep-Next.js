import type { auth_user } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { CMS_TOKEN_COOKIE_NAME } from "@/lib/server/cms-csrf";
import { signCmsJwt, verifyCmsJwt } from "@/lib/server/cms-jwt";

export type CmsUserPayload = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string | null;
  is_staff: boolean;
  is_superuser: boolean;
  can_manage_mfa: boolean;
};

export function buildUserPayload(user: Pick<auth_user, "id" | "username" | "first_name" | "last_name" | "email" | "is_staff" | "is_superuser">): CmsUserPayload {
  return {
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email || null,
    is_staff: user.is_staff,
    is_superuser: user.is_superuser,
    can_manage_mfa: user.is_superuser === true,
  };
}

export function signCmsSessionToken(user: Pick<auth_user, "id" | "username" | "is_staff" | "is_superuser">) {
  return signCmsJwt({
    sub: user.id,
    username: user.username,
    is_staff: user.is_staff,
    is_superuser: user.is_superuser,
    can_manage_mfa: user.is_superuser === true,
  });
}

export function signCmsMfaChallenge(user: Pick<auth_user, "id" | "username" | "is_staff" | "is_superuser">) {
  return signCmsJwt(
    {
      sub: user.id,
      username: user.username,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
      can_manage_mfa: user.is_superuser === true,
      purpose: "mfa",
    },
    5 * 60
  );
}

export function getCmsTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenCookie = cookieHeader
    .split(";")
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith(`${CMS_TOKEN_COOKIE_NAME}=`));

  return tokenCookie ? tokenCookie.slice(CMS_TOKEN_COOKIE_NAME.length + 1) : null;
}

export function readCmsJwtFromRequest(request: Request) {
  const token = getCmsTokenFromRequest(request);
  return token ? verifyCmsJwt(token) : null;
}

export async function getCmsUserFromRequest(request: Request) {
  const jwtPayload = readCmsJwtFromRequest(request);
  if (!jwtPayload?.sub || !jwtPayload.is_staff) return null;

  const user = await prisma.auth_user.findUnique({
    where: { id: Number(jwtPayload.sub) },
  });

  if (!user || !user.is_staff || !user.is_active) {
    return null;
  }

  return { jwtPayload, user };
}

export async function requireCmsStaff(request: Request) {
  const auth = await getCmsUserFromRequest(request);
  if (!auth) {
    return null;
  }
  return auth;
}

export async function requireCmsMfaManager(request: Request) {
  const auth = await getCmsUserFromRequest(request);
  if (!auth?.jwtPayload.can_manage_mfa) {
    return null;
  }
  return auth;
}

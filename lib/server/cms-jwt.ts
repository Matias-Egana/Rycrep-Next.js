import crypto from "crypto";
import { CMS_COOKIE_MAX_AGE, CMS_JWT_SECRET } from "@/lib/server/cms-env";

export type CmsJwtPayload = {
  sub: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
  can_manage_mfa: boolean;
  purpose?: "mfa";
  iat: number;
  exp: number;
};

function encodeBase64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64");
}

function signSegment(value: string) {
  return encodeBase64Url(
    crypto.createHmac("sha256", CMS_JWT_SECRET).update(value).digest()
  );
}

export function signCmsJwt(
  payload: Omit<CmsJwtPayload, "iat" | "exp">,
  expiresInSeconds = CMS_COOKIE_MAX_AGE
) {
  const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = encodeBase64Url(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    } satisfies CmsJwtPayload)
  );
  const signature = signSegment(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifyCmsJwt(token: string): CmsJwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSignature = signSegment(`${header}.${body}`);
  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== actualBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(body).toString("utf8")) as CmsJwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!parsed.exp || parsed.exp < now) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

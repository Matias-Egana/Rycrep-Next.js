import crypto from "crypto";
import type { NextResponse } from "next/server";
import { CMS_COOKIE_MAX_AGE, isSecureCookieRequest } from "@/lib/server/cms-env";

export const CMS_CSRF_COOKIE_NAME = "cms_csrf";
export const CMS_TOKEN_COOKIE_NAME = "cms_token";

export function issueCsrfToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function appendCsrfCookie(response: NextResponse, request: Request, token: string) {
  response.cookies.set(CMS_CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecureCookieRequest(request),
    path: "/",
    maxAge: CMS_COOKIE_MAX_AGE,
  });
}

export function appendCmsTokenCookie(response: NextResponse, request: Request, token: string) {
  response.cookies.set(CMS_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecureCookieRequest(request),
    path: "/",
    maxAge: CMS_COOKIE_MAX_AGE,
  });
}

export function clearCmsTokenCookie(response: NextResponse, request: Request) {
  response.cookies.set(CMS_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecureCookieRequest(request),
    path: "/",
    maxAge: 0,
  });
}

export function clearCsrfCookie(response: NextResponse, request: Request) {
  response.cookies.set(CMS_CSRF_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecureCookieRequest(request),
    path: "/",
    maxAge: 0,
  });
}

export function isValidCsrfRequest(request: Request) {
  const cookieToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith(`${CMS_CSRF_COOKIE_NAME}=`))
    ?.slice(CMS_CSRF_COOKIE_NAME.length + 1);
  const headerToken = request.headers.get("x-csrf-token");

  return !!cookieToken && !!headerToken && cookieToken === headerToken;
}

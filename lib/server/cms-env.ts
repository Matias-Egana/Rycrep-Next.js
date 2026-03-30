const ONE_HOUR_SECONDS = 60 * 60;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required for CMS auth.`);
  }
  return value;
}

export const CMS_JWT_SECRET = requiredEnv("JWT_SECRET");
export const CMS_MFA_APP_NAME = process.env.MFA_APP_NAME?.trim() || "Rycrep CMS";
export const CMS_PASSWORD_ROTATION_DAYS = (() => {
  const raw = process.env.PASSWORD_ROTATION_DAYS?.trim();
  if (!raw) return 180;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 180;
})();

const mfaKeyBase64 = requiredEnv("MFA_ENCRYPTION_KEY");
export const CMS_MFA_KEY = Buffer.from(mfaKeyBase64, "base64");

if (CMS_MFA_KEY.length !== 32) {
  throw new Error("MFA_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
}

export const CMS_COOKIE_MAX_AGE = ONE_HOUR_SECONDS;

export function isSecureCookieRequest(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

import crypto from "crypto";
import type { auth_user } from "@prisma/client";
import { CMS_PASSWORD_ROTATION_DAYS } from "@/lib/server/cms-env";

const DEFAULT_ITERATIONS = 260000;
const COMMON_PASSWORDS = [
  "123456",
  "123456789",
  "password",
  "qwerty",
  "admin",
  "111111",
  "123123",
  "abc123",
];

export type PasswordPolicyContext = {
  username?: string;
  email?: string;
  fullName?: string;
};

export function verifyDjangoPassword(raw: string, djangoHash: string) {
  if (!djangoHash || typeof djangoHash !== "string") return false;
  const parts = djangoHash.split("$");
  if (parts.length !== 4) return false;

  const [algo, iterationsStr, salt, hashB64] = parts;
  if (algo !== "pbkdf2_sha256") return false;

  const iterations = Number.parseInt(iterationsStr, 10);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const derived = crypto.pbkdf2Sync(raw, salt, iterations, 32, "sha256");
  const expected = Buffer.from(hashB64, "base64");

  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}

export function hashDjangoPassword(raw: string, iterations = DEFAULT_ITERATIONS) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.pbkdf2Sync(raw, salt, iterations, 32, "sha256");
  return `pbkdf2_sha256$${iterations}$${salt}$${derived.toString("base64")}`;
}

export function validatePasswordStrength(
  password: string,
  ctx: PasswordPolicyContext = {}
) {
  const errors: string[] = [];
  const pwd = password || "";

  if (pwd.length < 12) errors.push("La contrasena debe tener al menos 12 caracteres.");
  if (!/[A-Z]/.test(pwd)) errors.push("Debe incluir al menos una letra mayuscula.");
  if (!/[a-z]/.test(pwd)) errors.push("Debe incluir al menos una letra minuscula.");
  if (!/\d/.test(pwd)) errors.push("Debe incluir al menos un digito.");
  if (!/[^\w\s]/.test(pwd)) errors.push("Debe incluir al menos un caracter especial.");
  if (COMMON_PASSWORDS.includes(pwd.toLowerCase())) {
    errors.push("La contrasena es demasiado comun o trivial.");
  }

  const candidates = [ctx.username, ctx.email?.split("@")[0], ctx.fullName]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const loweredPassword = pwd.toLowerCase();
  for (const candidate of candidates) {
    if (candidate.length >= 3 && loweredPassword.includes(candidate)) {
      errors.push("La contrasena no debe contener datos personales evidentes.");
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getPasswordRotationInfo(
  user: Pick<auth_user, "password_last_changed" | "date_joined">
) {
  const reference = user.password_last_changed ?? user.date_joined;
  if (!reference) {
    return { warning: false, ageDays: null as number | null };
  }

  const ageMs = Date.now() - reference.getTime();
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));

  return {
    warning: ageDays >= CMS_PASSWORD_ROTATION_DAYS,
    ageDays,
  };
}

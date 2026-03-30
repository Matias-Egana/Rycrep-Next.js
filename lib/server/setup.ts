import crypto from "crypto";
import { prisma } from "@/lib/server/prisma";
import { hashDjangoPassword, validatePasswordStrength } from "@/lib/server/cms-password";

const SETUP_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const SETUP_MAX_ATTEMPTS = 5;

type SetupTokenRow = {
  id: number;
  token: string;
  expires_at: Date;
  used_at: Date | null;
  attempts: number;
  created_at: Date;
};

export async function adminExists() {
  const count = await prisma.auth_user.count({
    where: { is_superuser: true },
  });
  return count > 0;
}

export async function storeSetupToken(token: string, expiresAt: Date) {
  await prisma.setup_tokens.create({
    data: {
      token,
      expires_at: expiresAt,
    },
  });
}

export async function getSetupToken(token: string): Promise<SetupTokenRow | null> {
  return prisma.setup_tokens.findUnique({
    where: { token },
  });
}

export async function markSetupTokenUsed(id: number) {
  await prisma.setup_tokens.update({
    where: { id },
    data: { used_at: new Date() },
  });
}

export async function incrementSetupAttempts(id: number) {
  await prisma.setup_tokens.update({
    where: { id },
    data: { attempts: { increment: 1 } },
  });
}

export async function deleteExpiredTokens() {
  await prisma.setup_tokens.deleteMany({
    where: {
      OR: [
        { expires_at: { lt: new Date() } },
        { used_at: { not: null } },
      ],
    },
  });
}

export async function deleteAllSetupTokens() {
  await prisma.setup_tokens.deleteMany();
}

export async function getLatestValidSetupToken() {
  return prisma.setup_tokens.findFirst({
    where: {
      used_at: null,
      expires_at: { gte: new Date() },
    },
    orderBy: { created_at: "desc" },
  });
}

export async function ensureSetupTokenOnDemand() {
  if (await adminExists()) {
    await deleteAllSetupTokens();
    return null;
  }

  await deleteExpiredTokens();
  const existing = await getLatestValidSetupToken();
  if (existing) {
    return existing;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SETUP_TOKEN_TTL_MS);
  await storeSetupToken(token, expiresAt);

  return getSetupToken(token);
}

export async function validateSetupToken(token: string) {
  const stored = await getSetupToken(token);
  if (!stored) return null;
  if (stored.used_at) return null;

  if (stored.expires_at.getTime() < Date.now()) {
    await deleteExpiredTokens();
    return null;
  }

  if (stored.attempts >= SETUP_MAX_ATTEMPTS) {
    await markSetupTokenUsed(stored.id);
    await deleteExpiredTokens();
    return null;
  }

  return stored;
}

export async function createSetupAdmin(input: {
  username: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.auth_user.count({
    where: {
      OR: [{ username: input.username }, { email: input.email }],
    },
  });

  if (existing > 0) {
    throw new Error("Ya existe un usuario con ese username o email");
  }

  const policy = validatePasswordStrength(input.password, {
    username: input.username,
    email: input.email,
  });

  if (!policy.valid) {
    const message = policy.errors[0] || "Contrasena no cumple la politica de seguridad";
    throw new Error(message);
  }

  await prisma.auth_user.create({
    data: {
      password: hashDjangoPassword(input.password),
      password_last_changed: new Date(),
      last_login: null,
      is_superuser: true,
      username: input.username,
      first_name: "",
      last_name: "",
      email: input.email,
      is_staff: true,
      is_active: true,
      date_joined: new Date(),
    },
  });
}

export function getSetupHomeUrl() {
  const origin = (process.env.FRONTEND_ORIGIN ?? "").trim().replace(/\/+$/, "");
  return origin ? `${origin}/` : "/";
}

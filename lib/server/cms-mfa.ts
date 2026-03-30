import crypto from "crypto";
import { prisma } from "@/lib/server/prisma";
import { CMS_MFA_APP_NAME, CMS_MFA_KEY } from "@/lib/server/cms-env";

const MFA_STEP_SECONDS = 30;
const MFA_DIGITS = 6;
const AES_ALGO = "aes-256-gcm";
const AES_IV_LENGTH = 12;
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function encodeBase32(buffer: Buffer) {
  let bits = "";
  for (const value of buffer) {
    bits += value.toString(2).padStart(8, "0");
  }

  let output = "";
  for (let index = 0; index < bits.length; index += 5) {
    const chunk = bits.slice(index, index + 5).padEnd(5, "0");
    output += BASE32_ALPHABET[Number.parseInt(chunk, 2)];
  }

  return output;
}

function decodeBase32(secret: string) {
  const normalized = secret.toUpperCase().replace(/=+$/g, "").replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index < 0) {
      throw new Error("Invalid base32 secret.");
    }
    bits += index.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }

  return Buffer.from(bytes);
}

function encryptSecret(plain: string) {
  const iv = crypto.randomBytes(AES_IV_LENGTH);
  const cipher = crypto.createCipheriv(AES_ALGO, CMS_MFA_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), encrypted.toString("base64"), tag.toString("base64")].join(":");
}

function decryptSecret(stored: string) {
  const parts = stored.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted MFA secret format.");
  }

  const [ivB64, encryptedB64, tagB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");
  const tag = Buffer.from(tagB64, "base64");

  const decipher = crypto.createDecipheriv(AES_ALGO, CMS_MFA_KEY, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

function generateSecret() {
  return encodeBase32(crypto.randomBytes(20));
}

function totpCode(secret: string, counter: number) {
  const key = decodeBase32(secret);
  const message = Buffer.alloc(8);
  const bigCounter = BigInt(counter);
  message.writeBigUInt64BE(bigCounter);
  const digest = crypto.createHmac("sha1", key).update(message).digest();
  const offset = digest[digest.length - 1] & 0xf;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 10 ** MFA_DIGITS).padStart(MFA_DIGITS, "0");
}

function currentCounter() {
  return Math.floor(Date.now() / 1000 / MFA_STEP_SECONDS);
}

function verifyCode(secret: string, code: string) {
  const token = (code || "").trim();
  if (!/^\d{6}$/.test(token)) return false;
  return totpCode(secret, currentCounter()) === token;
}

export async function getUserMfaConfig(userId: number) {
  return prisma.cms_mfa.findUnique({
    where: { user_id: userId },
  });
}

export async function startMfaSetup(userId: number, username: string) {
  const existing = await prisma.cms_mfa.findUnique({
    where: { user_id: userId },
  });

  if (existing?.enabled && existing.secret) {
    const secretPlain = decryptSecret(existing.secret);
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(`${CMS_MFA_APP_NAME}:${username}`)}?secret=${encodeURIComponent(secretPlain)}&issuer=${encodeURIComponent(CMS_MFA_APP_NAME)}&algorithm=SHA1&digits=${MFA_DIGITS}&period=${MFA_STEP_SECONDS}`;
    return { otpauthUrl, recordId: existing.id };
  }

  const secret = generateSecret();
  const encryptedSecret = encryptSecret(secret);

  const record = await prisma.cms_mfa.upsert({
    where: { user_id: userId },
    update: { secret: encryptedSecret, enabled: false, confirmed_at: null },
    create: { user_id: userId, secret: encryptedSecret, enabled: false, confirmed_at: null },
  });

  const otpauthUrl = `otpauth://totp/${encodeURIComponent(`${CMS_MFA_APP_NAME}:${username}`)}?secret=${encodeURIComponent(secret)}&issuer=${encodeURIComponent(CMS_MFA_APP_NAME)}&algorithm=SHA1&digits=${MFA_DIGITS}&period=${MFA_STEP_SECONDS}`;
  return { otpauthUrl, recordId: record.id };
}

export async function confirmMfaForUser(userId: number, code: string) {
  const record = await prisma.cms_mfa.findUnique({
    where: { user_id: userId },
  });
  if (!record) return false;

  const secret = decryptSecret(record.secret);
  if (!verifyCode(secret, code)) return false;

  await prisma.cms_mfa.update({
    where: { user_id: userId },
    data: {
      enabled: true,
      confirmed_at: new Date(),
    },
  });

  return true;
}

export async function verifyMfaLogin(userId: number, code: string) {
  const record = await prisma.cms_mfa.findUnique({
    where: { user_id: userId },
  });
  if (!record || !record.enabled) return false;

  return verifyCode(decryptSecret(record.secret), code);
}

export async function resetMfaForUser(userId: number) {
  await prisma.cms_mfa.deleteMany({
    where: { user_id: userId },
  });
}

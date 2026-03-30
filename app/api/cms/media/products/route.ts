import crypto from "crypto";
import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsStaff } from "@/lib/server/cms-auth";
import { isValidCsrfRequest } from "@/lib/server/cms-csrf";
import { getProductsDir } from "@/lib/server/media";

const MAX_BYTES = 8 * 1024 * 1024;
const mimeToExt: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const uploadSchema = z.object({
  dataUrl: z.string().min(1),
  filename: z.string().optional(),
});

function safeBaseName(input: unknown) {
  const raw = String(input ?? "product").trim();
  const base = raw.replace(/\.[a-z0-9]{1,5}$/i, "");
  const slug = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return (slug || "product").slice(0, 60);
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Formato invalido. Se espera data URL base64.");
  }

  const mime = match[1].trim().toLowerCase();
  const buffer = Buffer.from(match[2], "base64");
  return { mime, buffer };
}

export async function POST(request: Request) {
  if (!isValidCsrfRequest(request)) {
    return NextResponse.json({ detail: "CSRF invalido." }, { status: 403 });
  }

  const auth = await requireCmsStaff(request);
  if (!auth) {
    return NextResponse.json({ detail: "No autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ detail: "Falta dataUrl." }, { status: 400 });
  }

  try {
    const { mime, buffer } = parseDataUrl(parsed.data.dataUrl);
    const ext = mimeToExt[mime];

    if (!ext) {
      return NextResponse.json(
        { detail: `Tipo de archivo no soportado (${mime}). Usa webp/jpg/png/gif.` },
        { status: 400 }
      );
    }

    if (buffer.length <= 0) {
      return NextResponse.json({ detail: "Archivo vacio." }, { status: 400 });
    }

    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ detail: "Archivo demasiado grande (max 8MB)." }, { status: 413 });
    }

    const dir = getProductsDir();
    await fs.mkdir(dir, { recursive: true });

    const base = safeBaseName(parsed.data.filename);
    const suffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const finalName = `${base}-${suffix}${ext}`;
    const absolutePath = path.join(dir, finalName);
    await fs.writeFile(absolutePath, buffer);

    return NextResponse.json({
      path: `/data/products/${finalName}`,
      filename: finalName,
    });
  } catch (error) {
    return NextResponse.json(
      {
        detail: error instanceof Error ? error.message : "No se pudo subir la imagen.",
      },
      { status: 400 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  adminExists,
  createSetupAdmin,
  deleteAllSetupTokens,
  getSetupHomeUrl,
  incrementSetupAttempts,
  markSetupTokenUsed,
  validateSetupToken,
} from "@/lib/server/setup";

const setupBodySchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(150, "El usuario es demasiado largo.")
    .regex(/^[A-Za-z0-9._-]+$/, "El usuario solo puede contener letras, numeros, punto, guion y guion bajo."),
  email: z.email("Debes ingresar un correo valido.").trim(),
  password: z.string().min(1, "La contrasena es obligatoria."),
  captchaToken: z.string().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const homeUrl = getSetupHomeUrl();

  if (await adminExists()) {
    await deleteAllSetupTokens();
    return NextResponse.json(
      {
        error: "Setup deshabilitado: ya existe un administrador",
        redirectTo: homeUrl,
      },
      { status: 410 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = setupBodySchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message || "Faltan datos requeridos" },
      { status: 400 }
    );
  }

  const stored = await validateSetupToken(token);
  if (!stored) {
    return NextResponse.json(
      { error: "Token invalido", redirectTo: homeUrl },
      { status: 404 }
    );
  }

  try {
    await createSetupAdmin({
      username: parsed.data.username,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    await markSetupTokenUsed(stored.id);
    await deleteAllSetupTokens();

    return NextResponse.json({
      success: true,
      message: "Administrador creado correctamente",
    });
  } catch (error) {
    await incrementSetupAttempts(stored.id);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear el administrador",
      },
      { status: 400 }
    );
  }
}

import "server-only";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import nodemailer from "nodemailer";
import validator from "validator";
import { z } from "zod";

const windowForDOMPurify = new JSDOM("").window as unknown as Window & typeof globalThis;
const DOMPurify = createDOMPurify(windowForDOMPurify);

const sanitizePlainOptions = {
  ALLOWED_TAGS: [] as string[],
  ALLOWED_ATTR: [] as string[],
};

export const contactBodySchema = z.object({
  nombre: z.string().min(2).max(50),
  apellidos: z.string().min(2).max(50),
  email: z.string().email(),
  telefono: z.string().min(3).max(30),
  empresa: z.string().optional(),
  ciudad: z.string().optional(),
  region: z.string().optional(),
  mensaje: z.string().optional(),
});

export type ContactBody = z.infer<typeof contactBodySchema>;

export function sanitizePlain(value: unknown) {
  return DOMPurify.sanitize(String(value ?? "").trim(), sanitizePlainOptions);
}

export type ContactSanitizedData = {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  empresa: string;
  ciudad: string;
  region: string;
  mensaje: string;
};

export function sanitizeContactData(data: unknown): ContactSanitizedData {
  const src = (data ?? {}) as Record<string, unknown>;

  return {
    nombre: sanitizePlain(src.nombre),
    apellidos: sanitizePlain(src.apellidos),
    email: sanitizePlain(src.email),
    telefono: sanitizePlain(src.telefono),
    empresa: sanitizePlain(src.empresa),
    ciudad: sanitizePlain(src.ciudad),
    region: sanitizePlain(src.region),
    mensaje: sanitizePlain(src.mensaje),
  };
}

export function validateContactData(data: ContactBody) {
  const errors: string[] = [];
  const { nombre, apellidos, email, telefono } = sanitizeContactData(data);

  if (!validator.isLength(nombre, { min: 2, max: 50 })) {
    errors.push("Nombre debe contener entre 2 y 50 caracteres");
  }

  if (!validator.isLength(apellidos, { min: 2, max: 50 })) {
    errors.push("Apellidos debe contener entre 2 y 50 caracteres");
  }

  if (!validator.isEmail(email)) {
    errors.push("Email invalido");
  }

  if (!validator.isMobilePhone(telefono, "any")) {
    errors.push("Telefono invalido");
  }

  return errors;
}

export function createMailTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error("Faltan GMAIL_USER o GMAIL_APP_PASSWORD para enviar correos.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    logger: false,
    debug: false,
  });
}

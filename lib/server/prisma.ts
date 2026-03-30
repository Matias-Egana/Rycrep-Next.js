import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPromise: Promise<PrismaClient> | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("Falta configurar DATABASE_URL para usar Prisma dentro de Next.");
  }

  const parsedUrl = new URL(databaseUrl);
  if (!parsedUrl.searchParams.has("connectionLimit")) {
    parsedUrl.searchParams.set("connectionLimit", "5");
  }
  if (!parsedUrl.searchParams.has("acquireTimeout")) {
    parsedUrl.searchParams.set("acquireTimeout", "30000");
  }
  if (!parsedUrl.searchParams.has("allowPublicKeyRetrieval")) {
    parsedUrl.searchParams.set("allowPublicKeyRetrieval", "true");
  }

  return new PrismaClient({
    adapter: new PrismaMariaDb(parsedUrl.toString()),
  });
}

async function getOrCreatePrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (!globalForPrisma.prismaPromise) {
    globalForPrisma.prismaPromise = (async () => {
      const client = createPrismaClient();
      await client.$connect();
      globalForPrisma.prisma = client;
      return client;
    })();
  }

  return globalForPrisma.prismaPromise;
}

export const prisma = await getOrCreatePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPromise = Promise.resolve(prisma);
}

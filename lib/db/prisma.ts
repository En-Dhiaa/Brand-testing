import { PrismaClient } from "@prisma/client";

// On Netlify, the managed Netlify Database (Postgres) connection string is injected as NETLIFY_DB_URL.
// DATABASE_URL remains supported for local development against your own Postgres instance.
const datasourceUrl = process.env.NETLIFY_DB_URL || process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

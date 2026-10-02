import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Ensure writable database path in serverless environments (Netlify / Vercel / AWS Lambda)
if (process.env.NETLIFY || process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const currentDbUrl = process.env.DATABASE_URL || "file:./dev.db";
  if (currentDbUrl.startsWith("file:")) {
    const tmpDbPath = path.join("/tmp", "dev.db");
    const sourceDbPath = path.resolve(process.cwd(), "dev.db");

    try {
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      }
      process.env.DATABASE_URL = `file:${tmpDbPath}`;
    } catch {
      // Fallback silently if /tmp copy fails
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

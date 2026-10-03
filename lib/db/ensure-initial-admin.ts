import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/admin-auth";

/**
 * Creates the initial admin account the first time it's needed, if no admin exists yet.
 * This replaces build-time seeding, since the database isn't migrated until after the build.
 */
export async function ensureInitialAdmin(): Promise<void> {
  const existing = await prisma.adminUser.count();
  if (existing > 0) return;

  const email = (process.env.ADMIN_INITIAL_EMAIL || "dhiaa.org@gmail.com").toLowerCase().trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD || "admin1234.com";
  const passwordHash = await hashPassword(password);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, name: "مدير الهوية البصرية", passwordHash },
  });
}

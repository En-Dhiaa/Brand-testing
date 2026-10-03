import { and, eq, or, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { adminUsers, proposals, systemSettings } from "@/db/schema";

export async function getSetting(key: string) {
  const [setting] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, key))
    .limit(1);
  return setting ?? null;
}

// Finds a proposal by its public ID (e.g. "LC-A8F31E") or internal ID, limited to the given statuses
export async function findProposalByRawId(rawId: string, statuses: string[]) {
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(
      and(
        or(eq(proposals.publicId, rawId.toUpperCase()), eq(proposals.id, rawId)),
        inArray(proposals.status, statuses)
      )
    )
    .limit(1);
  return proposal ?? null;
}

// Creates the initial admin account on first use (replaces the old build-time seed script)
export async function ensureInitialAdmin() {
  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || "dhiaa.org@gmail.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "admin1234.com";

  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, adminEmail))
    .limit(1);
  if (existing) return;

  const passwordHash = await bcrypt.hash(adminPassword, await bcrypt.genSalt(10));
  await db
    .insert(adminUsers)
    .values({ email: adminEmail, name: "مدير الهوية البصرية", passwordHash })
    .onConflictDoNothing({ target: adminUsers.email });
}

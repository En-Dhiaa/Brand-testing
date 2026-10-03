import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || "dhiaa.org@gmail.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "admin1234.com";

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "مدير الهوية البصرية",
    },
    create: {
      email: adminEmail,
      name: "مدير الهوية البصرية",
      passwordHash,
    },
  });
  console.log(`[Seed] Configured admin account securely: ${adminEmail}`);

  // System settings
  const settings = [
    { key: "participation_status", value: "open" },
    { key: "voting_status", value: "open" },
    { key: "comments_status", value: "open" },
    { key: "gallery_status", value: "open" },
    { key: "site_title", value: "استوديو ألوان الشعار - الجامعة اليمنية الإلكترونية" },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("[Seed] Completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

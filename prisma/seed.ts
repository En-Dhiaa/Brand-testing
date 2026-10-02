import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@seu.edu.sa";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminSEU@2026!";

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: "مدير الهوية البصرية",
        passwordHash,
      },
    });
    console.log(`[Seed] Created admin account: ${adminEmail}`);
  } else {
    console.log(`[Seed] Admin account already exists: ${adminEmail}`);
  }

  // System settings
  const settings = [
    { key: "participation_status", value: "open" },
    { key: "voting_status", value: "open" },
    { key: "comments_status", value: "open" },
    { key: "gallery_status", value: "open" },
    { key: "site_title", value: "استوديو ألوان الشعار - الجامعة السعودية الإلكترونية" },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: {},
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

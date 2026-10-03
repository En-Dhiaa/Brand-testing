-- Default system settings (previously inserted by prisma/seed.ts at build time)
INSERT INTO "SystemSetting" ("id", "key", "value", "updatedAt") VALUES
  (gen_random_uuid()::text, 'participation_status', 'open', CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'voting_status', 'open', CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'comments_status', 'open', CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'gallery_status', 'open', CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'site_title', 'استوديو ألوان الشعار - الجامعة اليمنية الإلكترونية', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

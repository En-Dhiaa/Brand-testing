-- Seed default system settings
INSERT INTO "system_settings" ("id", "key", "value") VALUES
  (gen_random_uuid()::text, 'participation_status', 'open'),
  (gen_random_uuid()::text, 'voting_status', 'open'),
  (gen_random_uuid()::text, 'comments_status', 'open'),
  (gen_random_uuid()::text, 'gallery_status', 'open'),
  (gen_random_uuid()::text, 'site_title', 'استوديو ألوان الشعار - الجامعة اليمنية الإلكترونية')
ON CONFLICT ("key") DO NOTHING;

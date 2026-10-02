import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/admin-auth";

async function getAdminSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const settings = await prisma.systemSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return NextResponse.json({ settings: map });
  } catch (error) {
    console.error("[GET /api/admin/settings] Error:", error);
    return NextResponse.json({ error: "تعذر جلب الإعدادات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const allowedKeys = [
      "participation_status",
      "voting_status",
      "comments_status",
      "gallery_status",
      "site_title",
    ];

    for (const [key, value] of Object.entries(body)) {
      if (allowedKeys.includes(key) && typeof value === "string") {
        await prisma.systemSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    await prisma.adminAction.create({
      data: {
        adminEmail: session.email,
        action: "UPDATE_SYSTEM_SETTINGS",
        details: "تحديث إعدادات النظام العامة",
      },
    });

    return NextResponse.json({ success: true, message: "تم حفظ الإعدادات بنجاح" });
  } catch (error) {
    console.error("[POST /api/admin/settings] Error:", error);
    return NextResponse.json({ error: "تعذر حفظ الإعدادات" }, { status: 500 });
  }
}

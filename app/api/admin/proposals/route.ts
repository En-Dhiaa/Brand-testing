import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, like } from "drizzle-orm";
import { db } from "@/db";
import { adminActions, proposals } from "@/db/schema";
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
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // all, PUBLISHED, HIDDEN, DELETED
    const search = searchParams.get("search")?.trim();

    const rows = await db
      .select({
        id: proposals.id,
        publicId: proposals.publicId,
        design: proposals.design,
        status: proposals.status,
        likesCount: proposals.likesCount,
        votesCount: proposals.votesCount,
        commentsCount: proposals.commentsCount,
        createdAt: proposals.createdAt,
      })
      .from(proposals)
      .where(
        and(
          status && status !== "all" ? eq(proposals.status, status) : undefined,
          search ? like(proposals.publicId, `%${search.toUpperCase()}%`) : undefined
        )
      )
      .orderBy(desc(proposals.createdAt));

    const formatted = rows.map((p) => {
      let design;
      try {
        design = JSON.parse(p.design);
      } catch {
        design = null;
      }
      return {
        ...p,
        design,
      };
    });

    return NextResponse.json({ proposals: formatted });
  } catch (error) {
    console.error("[GET /api/admin/proposals] Error:", error);
    return NextResponse.json({ error: "تعذر جلب الاقتراحات" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !["PUBLISHED", "HIDDEN", "DELETED"].includes(status)) {
      return NextResponse.json({ error: "البيانات المدخلة غير صحيحة" }, { status: 400 });
    }

    const [updated] = await db
      .update(proposals)
      .set({ status })
      .where(eq(proposals.id, id))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "الاقتراح غير موجود" }, { status: 404 });
    }

    // Record audit log
    await db.insert(adminActions).values({
      adminEmail: session.email,
      action: `PROPOSAL_STATUS_${status}`,
      targetId: id,
      details: `تحديث حالة الاقتراح ${updated.publicId} إلى ${status}`,
    });

    return NextResponse.json({
      success: true,
      proposal: updated,
      message: `تم تحديث حالة الاقتراح إلى ${status}`,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/proposals] Error:", error);
    return NextResponse.json({ error: "فشل تحديث الاقتراح" }, { status: 500 });
  }
}

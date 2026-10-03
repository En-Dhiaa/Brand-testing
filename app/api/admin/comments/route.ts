import { NextRequest, NextResponse } from "next/server";
import { desc, eq, getColumns } from "drizzle-orm";
import { db } from "@/db";
import { adminActions, comments, proposals } from "@/db/schema";
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
    const status = searchParams.get("status"); // all, APPROVED, HIDDEN, DELETED, PENDING

    const rows = await db
      .select({
        ...getColumns(comments),
        proposal: { id: proposals.id, publicId: proposals.publicId },
      })
      .from(comments)
      .innerJoin(proposals, eq(comments.proposalId, proposals.id))
      .where(status && status !== "all" ? eq(comments.status, status) : undefined)
      .orderBy(desc(comments.createdAt));

    return NextResponse.json({ comments: rows });
  } catch (error) {
    console.error("[GET /api/admin/comments] Error:", error);
    return NextResponse.json({ error: "تعذر جلب التعليقات" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !["APPROVED", "HIDDEN", "DELETED"].includes(status)) {
      return NextResponse.json({ error: "البيانات المدخلة غير صحيحة" }, { status: 400 });
    }

    const [updatedComment] = await db
      .update(comments)
      .set({ status })
      .where(eq(comments.id, id))
      .returning();
    if (!updatedComment) {
      return NextResponse.json({ error: "التعليق غير موجود" }, { status: 404 });
    }

    const [proposal] = await db
      .select({ publicId: proposals.publicId })
      .from(proposals)
      .where(eq(proposals.id, updatedComment.proposalId))
      .limit(1);
    const updated = { ...updatedComment, proposal };

    await db.insert(adminActions).values({
      adminEmail: session.email,
      action: `COMMENT_STATUS_${status}`,
      targetId: id,
      details: `تحديث حالة التعليق على الاقتراح ${proposal?.publicId} إلى ${status}`,
    });

    return NextResponse.json({
      success: true,
      comment: updated,
      message: `تم تحديث حالة التعليق إلى ${status}`,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/comments] Error:", error);
    return NextResponse.json({ error: "فشل تحديث التعليق" }, { status: 500 });
  }
}

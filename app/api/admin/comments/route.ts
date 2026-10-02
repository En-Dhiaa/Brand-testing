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
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // all, APPROVED, HIDDEN, DELETED, PENDING

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        proposal: {
          select: {
            id: true,
            publicId: true,
          },
        },
      },
    });

    return NextResponse.json({ comments });
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

    const updated = await prisma.comment.update({
      where: { id },
      data: { status },
      include: { proposal: { select: { publicId: true } } },
    });

    await prisma.adminAction.create({
      data: {
        adminEmail: session.email,
        action: `COMMENT_STATUS_${status}`,
        targetId: id,
        details: `تحديث حالة التعليق على الاقتراح ${updated.proposal.publicId} إلى ${status}`,
      },
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

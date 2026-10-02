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
    const status = searchParams.get("status"); // all, PUBLISHED, HIDDEN, DELETED
    const search = searchParams.get("search")?.trim();

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (search) {
      where.publicId = { contains: search.toUpperCase() };
    }

    const proposals = await prisma.proposal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        publicId: true,
        design: true,
        status: true,
        likesCount: true,
        votesCount: true,
        commentsCount: true,
        createdAt: true,
      },
    });

    const formatted = proposals.map((p) => {
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

    const updated = await prisma.proposal.update({
      where: { id },
      data: { status },
    });

    // Record audit log
    await prisma.adminAction.create({
      data: {
        adminEmail: session.email,
        action: `PROPOSAL_STATUS_${status}`,
        targetId: id,
        details: `تحديث حالة الاقتراح ${updated.publicId} إلى ${status}`,
      },
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { VISITOR_COOKIE_NAME, getOrCreateVisitorId } from "@/lib/auth/visitor-session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    const visitorId = getOrCreateVisitorId(req.cookies.get(VISITOR_COOKIE_NAME)?.value);

    const proposal = await prisma.proposal.findFirst({
      where: {
        OR: [{ publicId: rawId.toUpperCase() }, { id: rawId }],
        status: "PUBLISHED",
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "الاقتراح غير موجود" }, { status: 404 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        proposalId_visitorId: {
          proposalId: proposal.id,
          visitorId,
        },
      },
    });

    let liked = false;
    let newLikesCount = proposal.likesCount;

    if (existingLike) {
      // Toggle unlike
      const [, updated] = await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.proposal.update({
          where: { id: proposal.id },
          data: {
            likesCount: { decrement: 1 },
          },
        }),
      ]);
      liked = false;
      newLikesCount = Math.max(0, updated.likesCount);
    } else {
      // Add like
      const [, updated] = await prisma.$transaction([
        prisma.like.create({
          data: {
            proposalId: proposal.id,
            visitorId,
          },
        }),
        prisma.proposal.update({
          where: { id: proposal.id },
          data: {
            likesCount: { increment: 1 },
          },
        }),
      ]);
      liked = true;
      newLikesCount = updated.likesCount;
    }

    const res = NextResponse.json({
      success: true,
      liked,
      likesCount: newLikesCount,
      message: liked ? "تمت إضافة الإعجاب" : "تم إلغاء الإعجاب",
    });

    res.cookies.set({
      name: VISITOR_COOKIE_NAME,
      value: visitorId,
      path: "/",
      maxAge: 365 * 24 * 3600,
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error("[POST /api/proposals/[id]/like] Error:", error);
    return NextResponse.json({ error: "تعذر تسجيل الإعجاب" }, { status: 500 });
  }
}

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

    // Check system voting status
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "voting_status" },
    });
    if (setting?.value === "closed") {
      return NextResponse.json(
        { error: "التصويت مغلق حالياً من قبل إدارة الجامعة" },
        { status: 403 }
      );
    }

    const proposal = await prisma.proposal.findFirst({
      where: {
        OR: [{ publicId: rawId.toUpperCase() }, { id: rawId }],
        status: "PUBLISHED",
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "الاقتراح غير موجود" }, { status: 404 });
    }

    // Check if visitor has already voted for this proposal
    const existingVote = await prisma.vote.findUnique({
      where: {
        proposalId_voterId: {
          proposalId: proposal.id,
          voterId: visitorId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "لقد قمت بالتصويت لهذا الاقتراح مسبقاً" },
        { status: 400 }
      );
    }

    // Atomic transaction: create vote and increment count
    const [, updatedProposal] = await prisma.$transaction([
      prisma.vote.create({
        data: {
          proposalId: proposal.id,
          voterId: visitorId,
        },
      }),
      prisma.proposal.update({
        where: { id: proposal.id },
        data: {
          votesCount: { increment: 1 },
        },
      }),
    ]);

    const res = NextResponse.json({
      success: true,
      votesCount: updatedProposal.votesCount,
      message: "تم تسجيل تصويتك بنجاح",
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
    console.error("[POST /api/proposals/[id]/vote] Error:", error);
    return NextResponse.json({ error: "تعذر تسجيل التصويت" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { VISITOR_COOKIE_NAME } from "@/lib/auth/visitor-session";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    if (!rawId) {
      return NextResponse.json({ error: "معرف الاقتراح مطلوب" }, { status: 400 });
    }

    const proposal = await prisma.proposal.findFirst({
      where: {
        OR: [{ publicId: rawId.toUpperCase() }, { id: rawId }],
        status: { in: ["PUBLISHED", "HIDDEN"] }, // Hidden is accessible via direct link for auditing
      },
      include: {
        comments: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            userName: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "الاقتراح غير موجود" }, { status: 404 });
    }

    // Check visitor interactions
    const visitorId = req.cookies.get(VISITOR_COOKIE_NAME)?.value;
    let hasVoted = false;
    let hasLiked = false;

    if (visitorId) {
      const [voteRecord, likeRecord] = await Promise.all([
        prisma.vote.findUnique({
          where: {
            proposalId_voterId: {
              proposalId: proposal.id,
              voterId: visitorId,
            },
          },
        }),
        prisma.like.findUnique({
          where: {
            proposalId_visitorId: {
              proposalId: proposal.id,
              visitorId,
            },
          },
        }),
      ]);
      hasVoted = !!voteRecord;
      hasLiked = !!likeRecord;
    }

    let parsedDesign;
    try {
      parsedDesign = JSON.parse(proposal.design);
    } catch {
      parsedDesign = null;
    }

    return NextResponse.json({
      proposal: {
        id: proposal.id,
        publicId: proposal.publicId,
        design: parsedDesign,
        likesCount: proposal.likesCount,
        votesCount: proposal.votesCount,
        commentsCount: proposal.commentsCount,
        createdAt: proposal.createdAt,
        isLocked: true, // Submitted proposals are permanently immutable
        hasVoted,
        hasLiked,
        comments: proposal.comments,
      },
    });
  } catch (error) {
    console.error("[GET /api/proposals/[id]] Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الاقتراح" }, { status: 500 });
  }
}

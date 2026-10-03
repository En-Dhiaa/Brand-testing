import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { comments, likes, votes } from "@/db/schema";
import { findProposalByRawId } from "@/lib/db/queries";
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

    // Hidden is accessible via direct link for auditing
    const proposal = await findProposalByRawId(rawId, ["PUBLISHED", "HIDDEN"]);

    if (!proposal) {
      return NextResponse.json({ error: "الاقتراح غير موجود" }, { status: 404 });
    }

    // Check visitor interactions
    const visitorId = req.cookies.get(VISITOR_COOKIE_NAME)?.value;
    let hasVoted = false;
    let hasLiked = false;

    if (visitorId) {
      const [[voteRecord], [likeRecord]] = await Promise.all([
        db
          .select({ id: votes.id })
          .from(votes)
          .where(and(eq(votes.proposalId, proposal.id), eq(votes.voterId, visitorId)))
          .limit(1),
        db
          .select({ id: likes.id })
          .from(likes)
          .where(and(eq(likes.proposalId, proposal.id), eq(likes.visitorId, visitorId)))
          .limit(1),
      ]);
      hasVoted = !!voteRecord;
      hasLiked = !!likeRecord;
    }

    const approvedComments = await db
      .select({
        id: comments.id,
        userName: comments.userName,
        content: comments.content,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .where(and(eq(comments.proposalId, proposal.id), eq(comments.status, "APPROVED")))
      .orderBy(desc(comments.createdAt));

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
        comments: approvedComments,
      },
    });
  } catch (error) {
    console.error("[GET /api/proposals/[id]] Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الاقتراح" }, { status: 500 });
  }
}

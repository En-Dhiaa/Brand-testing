import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { proposals, votes } from "@/db/schema";
import { findProposalByRawId, getSetting } from "@/lib/db/queries";
import { VISITOR_COOKIE_NAME, getOrCreateVisitorId } from "@/lib/auth/visitor-session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    const visitorId = getOrCreateVisitorId(req.cookies.get(VISITOR_COOKIE_NAME)?.value);

    // Check system voting status
    const setting = await getSetting("voting_status");
    if (setting?.value === "closed") {
      return NextResponse.json(
        { error: "التصويت مغلق حالياً من قبل إدارة الجامعة" },
        { status: 403 }
      );
    }

    const proposal = await findProposalByRawId(rawId, ["PUBLISHED"]);

    if (!proposal) {
      return NextResponse.json({ error: "الاقتراح غير موجود" }, { status: 404 });
    }

    // Check if visitor has already voted for this proposal
    const [existingVote] = await db
      .select({ id: votes.id })
      .from(votes)
      .where(and(eq(votes.proposalId, proposal.id), eq(votes.voterId, visitorId)))
      .limit(1);

    if (existingVote) {
      return NextResponse.json(
        { error: "لقد قمت بالتصويت لهذا الاقتراح مسبقاً" },
        { status: 400 }
      );
    }

    // Atomic transaction: create vote and increment count
    const updatedProposal = await db.transaction(async (tx) => {
      await tx.insert(votes).values({ proposalId: proposal.id, voterId: visitorId });
      const [row] = await tx
        .update(proposals)
        .set({ votesCount: sql`${proposals.votesCount} + 1` })
        .where(eq(proposals.id, proposal.id))
        .returning({ votesCount: proposals.votesCount });
      return row;
    });

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

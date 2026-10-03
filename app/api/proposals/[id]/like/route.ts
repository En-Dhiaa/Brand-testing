import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { likes, proposals } from "@/db/schema";
import { findProposalByRawId } from "@/lib/db/queries";
import { VISITOR_COOKIE_NAME, getOrCreateVisitorId } from "@/lib/auth/visitor-session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    const visitorId = getOrCreateVisitorId(req.cookies.get(VISITOR_COOKIE_NAME)?.value);

    const proposal = await findProposalByRawId(rawId, ["PUBLISHED"]);

    if (!proposal) {
      return NextResponse.json({ error: "الاقتراح غير موجود" }, { status: 404 });
    }

    const [existingLike] = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(eq(likes.proposalId, proposal.id), eq(likes.visitorId, visitorId)))
      .limit(1);

    let liked = false;
    let newLikesCount = proposal.likesCount;

    if (existingLike) {
      // Toggle unlike
      const updated = await db.transaction(async (tx) => {
        await tx.delete(likes).where(eq(likes.id, existingLike.id));
        const [row] = await tx
          .update(proposals)
          .set({ likesCount: sql`${proposals.likesCount} - 1` })
          .where(eq(proposals.id, proposal.id))
          .returning({ likesCount: proposals.likesCount });
        return row;
      });
      liked = false;
      newLikesCount = Math.max(0, updated.likesCount);
    } else {
      // Add like
      const updated = await db.transaction(async (tx) => {
        await tx.insert(likes).values({ proposalId: proposal.id, visitorId });
        const [row] = await tx
          .update(proposals)
          .set({ likesCount: sql`${proposals.likesCount} + 1` })
          .where(eq(proposals.id, proposal.id))
          .returning({ likesCount: proposals.likesCount });
        return row;
      });
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

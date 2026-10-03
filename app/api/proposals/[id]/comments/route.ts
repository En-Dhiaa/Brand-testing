import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { comments, proposals } from "@/db/schema";
import { findProposalByRawId, getSetting } from "@/lib/db/queries";
import { CreateCommentInputSchema } from "@/lib/validation/proposal-schema";
import { VISITOR_COOKIE_NAME, getOrCreateVisitorId } from "@/lib/auth/visitor-session";

function sanitizeText(input: string): string {
  // Strip HTML tags and script-like tokens
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "'": return "&#39;";
        case '"': return "&quot;";
        case "&": return "&amp;";
        default: return char;
      }
    })
    .trim();
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    const body = await req.json();
    const parseResult = CreateCommentInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "بيانات التعليق غير صالحة",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check system comments status
    const setting = await getSetting("comments_status");
    if (setting?.value === "closed") {
      return NextResponse.json(
        { error: "التعليقات متوقفة حالياً من قبل الإدارة" },
        { status: 403 }
      );
    }

    const proposal = await findProposalByRawId(rawId, ["PUBLISHED"]);

    if (!proposal) {
      return NextResponse.json({ error: "الاقتراح غير موجود" }, { status: 404 });
    }

    const visitorId = getOrCreateVisitorId(req.cookies.get(VISITOR_COOKIE_NAME)?.value);
    const sanitizedName = sanitizeText(parseResult.data.userName || "مشارك");
    const sanitizedContent = sanitizeText(parseResult.data.content);

    const newComment = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(comments)
        .values({
          proposalId: proposal.id,
          visitorId,
          userName: sanitizedName || "مشارك",
          content: sanitizedContent,
          status: "APPROVED",
        })
        .returning();
      await tx
        .update(proposals)
        .set({ commentsCount: sql`${proposals.commentsCount} + 1` })
        .where(eq(proposals.id, proposal.id));
      return created;
    });

    const res = NextResponse.json({
      success: true,
      comment: {
        id: newComment.id,
        userName: newComment.userName,
        content: newComment.content,
        createdAt: newComment.createdAt,
      },
      message: "تم إضافة تعليقك بنجاح",
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
    console.error("[POST /api/proposals/[id]/comments] Error:", error);
    return NextResponse.json({ error: "تعذر إضافة التعليق" }, { status: 500 });
  }
}

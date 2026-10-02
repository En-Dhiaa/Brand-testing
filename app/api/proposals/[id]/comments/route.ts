import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
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
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "comments_status" },
    });
    if (setting?.value === "closed") {
      return NextResponse.json(
        { error: "التعليقات متوقفة حالياً من قبل الإدارة" },
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

    const visitorId = getOrCreateVisitorId(req.cookies.get(VISITOR_COOKIE_NAME)?.value);
    const sanitizedName = sanitizeText(parseResult.data.userName || "مشارك");
    const sanitizedContent = sanitizeText(parseResult.data.content);

    const [newComment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          proposalId: proposal.id,
          visitorId,
          userName: sanitizedName || "مشارك",
          content: sanitizedContent,
          status: "APPROVED",
        },
      }),
      prisma.proposal.update({
        where: { id: proposal.id },
        data: {
          commentsCount: { increment: 1 },
        },
      }),
    ]);

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

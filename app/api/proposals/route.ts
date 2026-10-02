import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CreateProposalInputSchema } from "@/lib/validation/proposal-schema";
import { VISITOR_COOKIE_NAME, getOrCreateVisitorId } from "@/lib/auth/visitor-session";
import crypto from "crypto";

function generatePublicId(): string {
  // Generate random 6-character hex like "LC-A8F31E"
  const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `LC-${randomHex}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = CreateProposalInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "بيانات الاقتراح غير صالحة",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { design } = parseResult.data;

    // Check system participation status
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "participation_status" },
    });
    if (setting?.value === "closed") {
      return NextResponse.json(
        { error: "المشاركة واستقبال الاقتراحات مغلقة حالياً من قبل الإدارة" },
        { status: 403 }
      );
    }

    // Generate unique public ID
    let publicId = generatePublicId();
    let isUnique = false;
    for (let attempts = 0; attempts < 5; attempts++) {
      const existing = await prisma.proposal.findUnique({ where: { publicId } });
      if (!existing) {
        isUnique = true;
        break;
      }
      publicId = generatePublicId();
    }

    if (!isUnique) {
      publicId = `LC-${Date.now().toString(36).toUpperCase()}`;
    }

    // Store immutable proposal snapshot
    const proposal = await prisma.proposal.create({
      data: {
        publicId,
        design: JSON.stringify(design),
        status: "PUBLISHED",
      },
    });

    const visitorId = getOrCreateVisitorId(req.cookies.get(VISITOR_COOKIE_NAME)?.value);

    const response = NextResponse.json(
      {
        success: true,
        publicId: proposal.publicId,
        message: "تم اعتماد وحفظ اقتراحك بنجاح. لا يمكن تعديل الاقتراح بعد اعتماده.",
      },
      { status: 201 }
    );

    // Set visitor cookie if not present
    response.cookies.set({
      name: VISITOR_COOKIE_NAME,
      value: visitorId,
      path: "/",
      maxAge: 365 * 24 * 3600,
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("[POST /api/proposals] Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء حفظ الاقتراح. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search")?.trim();

    const skip = (page - 1) * limit;

    // Filter condition for public gallery
    const whereCondition: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (search) {
      whereCondition.publicId = {
        contains: search.toUpperCase(),
      };
    }

    // Ordering
    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "votes") {
      orderBy = { votesCount: "desc" };
    } else if (sort === "likes") {
      orderBy = { likesCount: "desc" };
    }

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          publicId: true,
          design: true,
          likesCount: true,
          votesCount: true,
          commentsCount: true,
          createdAt: true,
        },
      }),
      prisma.proposal.count({ where: whereCondition }),
    ]);

    const formatted = proposals.map((p) => {
      let parsedDesign;
      try {
        parsedDesign = JSON.parse(p.design);
      } catch {
        parsedDesign = null;
      }
      return {
        id: p.id,
        publicId: p.publicId,
        design: parsedDesign,
        likesCount: p.likesCount,
        votesCount: p.votesCount,
        commentsCount: p.commentsCount,
        createdAt: p.createdAt,
      };
    });

    return NextResponse.json({
      proposals: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/proposals] Error:", error);
    return NextResponse.json({ error: "فشل تحميل الاقتراحات" }, { status: 500 });
  }
}

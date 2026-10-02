import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { normalizeHexColor } from "@/lib/validation/proposal-schema";
import { LogoDesignState } from "@/types/logo";

export async function GET() {
  try {
    const publishedProposals = await prisma.proposal.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        publicId: true,
        design: true,
        votesCount: true,
        likesCount: true,
        commentsCount: true,
        createdAt: true,
      },
    });

    const totalProposals = publishedProposals.length;
    let totalVotes = 0;
    let totalLikes = 0;
    let totalComments = 0;

    let mostVotedProposal: typeof publishedProposals[0] | null = null;
    let mostLikedProposal: typeof publishedProposals[0] | null = null;

    const colorFrequencyMap = new Map<string, number>();

    const recordColor = (hex?: string) => {
      if (!hex) return;
      const normalized = normalizeHexColor(hex);
      const count = colorFrequencyMap.get(normalized) || 0;
      colorFrequencyMap.set(normalized, count + 1);
    };

    for (const p of publishedProposals) {
      totalVotes += p.votesCount;
      totalLikes += p.likesCount;
      totalComments += p.commentsCount;

      if (!mostVotedProposal || p.votesCount > mostVotedProposal.votesCount) {
        if (p.votesCount > 0) {
          mostVotedProposal = p;
        }
      }

      if (!mostLikedProposal || p.likesCount > mostLikedProposal.likesCount) {
        if (p.likesCount > 0) {
          mostLikedProposal = p;
        }
      }

      try {
        const design = JSON.parse(p.design) as LogoDesignState;
        if (design?.parts) {
          for (const key of Object.keys(design.parts) as (keyof typeof design.parts)[]) {
            const part = design.parts[key];
            if (part?.gradient?.enabled && part.gradient.stops) {
              for (const s of part.gradient.stops) {
                recordColor(s.color);
              }
            } else if (part?.color) {
              recordColor(part.color);
            }
          }
        }
        if (design?.background?.color && design.background.type === "solid") {
          recordColor(design.background.color);
        } else if (design?.background?.gradient?.enabled) {
          for (const s of design.background.gradient.stops) {
            recordColor(s.color);
          }
        }
      } catch (err) {
        console.error("Failed to parse design for color analytics:", err);
      }
    }

    // Sort colors by usage frequency
    const totalColorSelections = Array.from(colorFrequencyMap.values()).reduce((a, b) => a + b, 0);
    const topColors = Array.from(colorFrequencyMap.entries())
      .map(([hex, count]) => ({
        hex,
        count,
        percentage: totalColorSelections > 0 ? Math.round((count / totalColorSelections) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const parseProposal = (p: typeof publishedProposals[0] | null) => {
      if (!p) return null;
      let design;
      try {
        design = JSON.parse(p.design);
      } catch {
        design = null;
      }
      return {
        id: p.id,
        publicId: p.publicId,
        design,
        votesCount: p.votesCount,
        likesCount: p.likesCount,
        commentsCount: p.commentsCount,
        createdAt: p.createdAt,
      };
    };

    return NextResponse.json({
      summary: {
        totalProposals,
        totalVotes,
        totalLikes,
        totalComments,
      },
      mostVotedProposal: parseProposal(mostVotedProposal),
      mostLikedProposal: parseProposal(mostLikedProposal),
      topColors,
    });
  } catch (error) {
    console.error("[GET /api/results] Error:", error);
    return NextResponse.json({ error: "تعذر احتساب النتائج والإحصائيات" }, { status: 500 });
  }
}

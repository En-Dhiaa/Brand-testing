import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import {
  FileCheck2,
  Vote,
  Heart,
  MessageSquare,
  Shield,
  Eye,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalProposals, publishedCount, hiddenCount, deletedCount] =
    await Promise.all([
      prisma.proposal.count(),
      prisma.proposal.count({ where: { status: "PUBLISHED" } }),
      prisma.proposal.count({ where: { status: "HIDDEN" } }),
      prisma.proposal.count({ where: { status: "DELETED" } }),
    ]);

  const [totalVotes, totalLikes, totalComments, recentProposals, recentComments] =
    await Promise.all([
      prisma.vote.count(),
      prisma.like.count(),
      prisma.comment.count(),
      prisma.proposal.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          publicId: true,
          status: true,
          votesCount: true,
          likesCount: true,
          createdAt: true,
        },
      }),
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          proposal: { select: { publicId: true } },
        },
      }),
    ]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-white">نظرة عامة على النظام</h1>
        <p className="text-xs text-slate-400 mt-1">
          متابعة مباشرة لنشاط وتفاعل المشاركين مع استوديو ألوان الشعار.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">إجمالي الاقتراحات</span>
            <FileCheck2 className="h-5 w-5 text-brand-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalProposals}</div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
            <span className="text-emerald-400 font-bold">{publishedCount} منشور</span>
            <span>•</span>
            <span className="text-amber-400">{hiddenCount} مخفي</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">إجمالي الأصوات</span>
            <Vote className="h-5 w-5 text-gold-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalVotes}</div>
          <span className="text-[11px] text-slate-400 block mt-2">تصويت فريد</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">إجمالي الإعجابات</span>
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalLikes}</div>
          <span className="text-[11px] text-slate-400 block mt-2">إعجاب مسجل</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">التعليقات والملاحظات</span>
            <MessageSquare className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalComments}</div>
          <span className="text-[11px] text-slate-400 block mt-2">تعليق مشارك</span>
        </div>
      </div>

      {/* Two Columns: Recent Proposals & Recent Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals Card */}
        <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
              <h3 className="font-bold text-sm text-white">أحدث الاقتراحات المعتمدة</h3>
              <Link
                href="/admin/dashboard/proposals"
                className="text-xs font-bold text-gold-400 hover:underline flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-700/60">
              {recentProposals.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-white">{p.publicId}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : p.status === "HIDDEN"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-red-950 text-red-300 border border-red-800"
                      }`}
                    >
                      {p.status === "PUBLISHED" ? "منشور" : p.status === "HIDDEN" ? "مخفي" : "محذوف"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Vote className="h-3.5 w-3.5" />
                      {p.votesCount}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Heart className="h-3.5 w-3.5" />
                      {p.likesCount}
                    </span>
                    <Link
                      href={`/proposals/${p.publicId}`}
                      target="_blank"
                      className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Comments Card */}
        <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
              <h3 className="font-bold text-sm text-white">أحدث التعليقات</h3>
              <Link
                href="/admin/dashboard/comments"
                className="text-xs font-bold text-gold-400 hover:underline flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-700/60">
              {recentComments.map((c) => (
                <div key={c.id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{c.userName}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {c.proposal?.publicId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{c.content}</p>
                </div>
              ))}
              {recentComments.length === 0 && (
                <p className="text-xs text-slate-500 py-6 text-center">لا توجد تعليقات حتى الآن</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

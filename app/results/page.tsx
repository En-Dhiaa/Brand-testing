"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogoDesignState } from "@/types/logo";
import { LogoRenderer } from "@/components/logo/LogoRenderer";
import {
  BarChart3,
  Vote,
  Heart,
  MessageSquare,
  FileCheck2,
  Trophy,
  Palette,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface ResultsData {
  summary: {
    totalProposals: number;
    totalVotes: number;
    totalLikes: number;
    totalComments: number;
  };
  mostVotedProposal: {
    id: string;
    publicId: string;
    design: LogoDesignState;
    votesCount: number;
    likesCount: number;
  } | null;
  mostLikedProposal: {
    id: string;
    publicId: string;
    design: LogoDesignState;
    votesCount: number;
    likesCount: number;
  } | null;
  topColors: {
    hex: string;
    count: number;
    percentage: number;
  }[];
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/results");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-800 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-600">جاري احتساب وتحليل إحصائيات المشاركة...</p>
      </div>
    );
  }

  const summary = data?.summary || {
    totalProposals: 0,
    totalVotes: 0,
    totalLikes: 0,
    totalComments: 0,
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16 bg-slate-50/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-xs font-bold mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-gold-500" />
            <span>تقرير التفاعل المجتمعي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            نتائج وإحصائيات الهوية البصرية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            بيانات رقمية حية حول تفضيلات وتصويت المجتمع على ألوان شعار الجامعة السعودية الإلكترونية.
          </p>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-brand-800 mb-2">
              <span className="text-xs font-bold text-slate-500">إجمالي الاقتراحات</span>
              <FileCheck2 className="h-5 w-5 text-brand-800" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {summary.totalProposals.toLocaleString("ar-SA")}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">اقتراح معتمد</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-brand-800 mb-2">
              <span className="text-xs font-bold text-slate-500">إجمالي التصويتات</span>
              <Vote className="h-5 w-5 text-brand-800" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {summary.totalVotes.toLocaleString("ar-SA")}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">صوت مسجل</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-600 mb-2">
              <span className="text-xs font-bold text-slate-500">إجمالي الإعجابات</span>
              <Heart className="h-5 w-5 fill-rose-600 text-rose-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {summary.totalLikes.toLocaleString("ar-SA")}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">إعجاب مسجل</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-600 mb-2">
              <span className="text-xs font-bold text-slate-500">إجمالي التعليقات</span>
              <MessageSquare className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {summary.totalComments.toLocaleString("ar-SA")}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">مشاركة ورأي</span>
          </div>
        </div>

        {/* Leading Proposals: Most Voted & Most Liked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Most Voted Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">الاقتراح الأكثر تصويتًا</h3>
                  <span className="text-[11px] text-slate-500">بناءً على أعلى عدد أصوات فريدة</span>
                </div>
              </div>

              {data?.mostVotedProposal && (
                <div className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-900 font-bold text-xs flex items-center gap-1">
                  <Vote className="h-3.5 w-3.5" />
                  <span>{data.mostVotedProposal.votesCount} صوت</span>
                </div>
              )}
            </div>

            {data?.mostVotedProposal ? (
              <div className="flex flex-col gap-4">
                <div className="w-full h-44 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                  <LogoRenderer
                    design={data.mostVotedProposal.design}
                    checkerboard={true}
                    interactive={false}
                    className="max-h-36 max-w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-700">
                    {data.mostVotedProposal.publicId}
                  </span>
                  <Link
                    href={`/proposals/${data.mostVotedProposal.publicId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:text-brand-900"
                  >
                    <span>فتح الاقتراح</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">
                لم يتم تسجيل تصويتات حتى الآن.
              </p>
            )}
          </div>

          {/* Most Liked Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <Heart className="h-5 w-5 fill-rose-600 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">الاقتراح الأكثر إعجابًا</h3>
                  <span className="text-[11px] text-slate-500">بناءً على تفاعل الإعجاب المستقل</span>
                </div>
              </div>

              {data?.mostLikedProposal && (
                <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 fill-rose-600" />
                  <span>{data.mostLikedProposal.likesCount} إعجاب</span>
                </div>
              )}
            </div>

            {data?.mostLikedProposal ? (
              <div className="flex flex-col gap-4">
                <div className="w-full h-44 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                  <LogoRenderer
                    design={data.mostLikedProposal.design}
                    checkerboard={true}
                    interactive={false}
                    className="max-h-36 max-w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-700">
                    {data.mostLikedProposal.publicId}
                  </span>
                  <Link
                    href={`/proposals/${data.mostLikedProposal.publicId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:text-brand-900"
                  >
                    <span>فتح الاقتراح</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">
                لم يتم تسجيل إعجابات حتى الآن.
              </p>
            )}
          </div>
        </div>

        {/* Color Analytics Distribution Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-5 w-5 text-brand-800" />
            <h2 className="text-base font-bold text-slate-900">توزيع الألوان الأكثر اختياراً</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            تحليل موحّد للألوان الأكثر تكراراً في اقتراحات المشاركين عبر جميع عناصر الشعار والخلفيات.
          </p>

          {data?.topColors && data.topColors.length > 0 ? (
            <div className="space-y-4">
              {data.topColors.map((color, idx) => (
                <div key={color.hex} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-4 text-center">
                    {idx + 1}
                  </span>

                  {/* Color Swatch */}
                  <span
                    className="w-7 h-7 rounded-xl border border-black/10 shrink-0 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />

                  {/* Hex Name */}
                  <span className="text-xs font-mono font-bold text-slate-800 dir-ltr w-20">
                    {color.hex}
                  </span>

                  {/* Usage Bar */}
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(color.percentage, 5)}%`,
                        backgroundColor: color.hex === "#FFFFFF" ? "#C9A227" : color.hex,
                      }}
                    />
                  </div>

                  {/* Percentage & Count */}
                  <div className="flex items-center gap-2 text-xs font-bold shrink-0 min-w-[5rem] justify-end">
                    <span className="text-brand-900 font-mono">{color.percentage}%</span>
                    <span className="text-slate-400 font-normal">({color.count})</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              لا تتوفر بيانات ألوان كافية حتى الآن.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

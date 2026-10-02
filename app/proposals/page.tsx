"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogoDesignState } from "@/types/logo";
import { LogoRenderer } from "@/components/logo/LogoRenderer";
import {
  Heart,
  Vote,
  MessageSquare,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface ProposalItem {
  id: string;
  publicId: string;
  design: LogoDesignState;
  likesCount: number;
  votesCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function ProposalsGalleryPage() {
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<"newest" | "votes" | "likes">("newest");
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort,
      });
      if (activeSearch) {
        params.set("search", activeSearch);
      }

      const res = await fetch(`/api/proposals?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProposals(data.proposals || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [page, sort, activeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(search.trim());
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16 bg-slate-50/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-xs font-bold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              <span>مشاركات المجتمع الجامعي</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              معرض اقتراحات الهوية
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              استكشف أحدث الاقتراحات المقدمة وصوّت للشعار المفضل لديك.
            </p>
          </div>

          <Link
            href="/customize"
            className="self-start sm:self-auto bg-brand-800 hover:bg-brand-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-brand-900/15 transition-all hover:scale-105 active:scale-95"
          >
            + إضافة اقتراحك
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث برقم الاقتراح (مثال: LC-A12B)"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-800/20"
            />
            <button
              type="submit"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-800"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto text-xs font-bold">
            <span className="text-slate-400 text-xs hidden sm:inline ml-2 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              الترتيب:
            </span>
            <button
              onClick={() => {
                setSort("newest");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                sort === "newest"
                  ? "bg-brand-800 text-white border-brand-800 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              الأحدث
            </button>
            <button
              onClick={() => {
                setSort("votes");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                sort === "votes"
                  ? "bg-brand-800 text-white border-brand-800 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              الأكثر تصويتًا
            </button>
            <button
              onClick={() => {
                setSort("likes");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                sort === "likes"
                  ? "bg-brand-800 text-white border-brand-800 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              الأكثر إعجابًا
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-3xl bg-white border border-slate-200 p-4 animate-pulse flex flex-col justify-between"
              >
                <div className="h-44 bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                <div className="h-8 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Proposals Grid */}
        {!loading && proposals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {proposals.map((item) => (
              <Link
                key={item.id}
                href={`/proposals/${item.publicId}`}
                className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 hover:border-brand-800/40 p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Logo Canvas Preview */}
                <div className="relative w-full h-44 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-center p-4 overflow-hidden group-hover:bg-slate-100/50 transition-colors">
                  {item.design && (
                    <LogoRenderer
                      design={item.design}
                      checkerboard={true}
                      interactive={false}
                      className="max-h-36 max-w-full"
                    />
                  )}
                  {/* Floating ID badge */}
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 text-[11px] font-mono font-bold text-slate-700 shadow-sm">
                    {item.publicId}
                  </span>
                </div>

                {/* Stats Bar */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold text-rose-600">
                      <Heart className="h-3.5 w-3.5 fill-rose-600" />
                      {item.likesCount}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-brand-800">
                      <Vote className="h-3.5 w-3.5" />
                      {item.votesCount}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {item.commentsCount}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>

                {/* Card Button */}
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-brand-900 group-hover:text-brand-800">
                  <span>مشاهدة والتصويت</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && proposals.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-7 w-7 text-gold-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              لا توجد اقتراحات مطابقة
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              كن أول من يشارك في تصميم هوية الجامعة عبر تخصيص الألوان واعتماد أول اقتراح!
            </p>
            <Link
              href="/customize"
              className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              ابدأ تخصيص الشعار الآن
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-all"
            >
              <ChevronRight className="h-4 w-4 text-slate-700" />
            </button>

            <span className="text-xs font-bold text-slate-600 px-3">
              صفحة {page} من {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

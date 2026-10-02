"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogoDesignState } from "@/types/logo";
import { LogoRenderer } from "@/components/logo/LogoRenderer";
import {
  Search,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  CheckCircle,
  Vote,
  Heart,
  MessageSquare,
} from "lucide-react";

interface AdminProposal {
  id: string;
  publicId: string;
  design: LogoDesignState;
  status: "PUBLISHED" | "HIDDEN" | "DELETED";
  likesCount: number;
  votesCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<AdminProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      const res = await fetch(`/api/admin/proposals?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProposals(data.proposals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProposals();
  };

  const updateStatus = async (id: string, newStatus: "PUBLISHED" | "HIDDEN" | "DELETED") => {
    try {
      const res = await fetch("/api/admin/proposals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setProposals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        setSelectedDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة ومراقبة الاقتراحات</h1>
          <p className="text-xs text-slate-400 mt-1">
            إدارة حالة الاقتراحات وإخفاء أو استعادة التصاميم المخالفة.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الاقتراح..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs font-bold">
          {["all", "PUBLISHED", "HIDDEN", "DELETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                statusFilter === st
                  ? "bg-brand-900 text-white border-brand-700 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              {st === "all"
                ? "الكل"
                : st === "PUBLISHED"
                ? "المنشورة"
                : st === "HIDDEN"
                ? "المخفية"
                : "المحذوفة"}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List / Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-bold">
          جاري تحميل الاقتراحات...
        </div>
      ) : proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-4 flex flex-col justify-between"
            >
              {/* Logo preview */}
              <div className="w-full h-40 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-3 relative overflow-hidden mb-3">
                {item.design && (
                  <LogoRenderer
                    design={item.design}
                    checkerboard={true}
                    interactive={false}
                    className="max-h-32 max-w-full"
                  />
                )}
                <span
                  className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    item.status === "PUBLISHED"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : item.status === "HIDDEN"
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-red-950 text-red-300 border-red-800"
                  }`}
                >
                  {item.status === "PUBLISHED"
                    ? "منشور"
                    : item.status === "HIDDEN"
                    ? "مخفي"
                    : "محذوف"}
                </span>
              </div>

              {/* ID & Stats */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono font-bold text-white text-sm">
                  {item.publicId}
                </span>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1 font-mono">
                    <Vote className="h-3 w-3 text-gold-400" />
                    {item.votesCount}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Heart className="h-3 w-3 text-rose-400" />
                    {item.likesCount}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <MessageSquare className="h-3 w-3 text-blue-400" />
                    {item.commentsCount}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <Link
                  href={`/proposals/${item.publicId}`}
                  target="_blank"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>معاينة</span>
                </Link>

                <div className="flex items-center gap-1">
                  {item.status === "PUBLISHED" ? (
                    <button
                      onClick={() => updateStatus(item.id, "HIDDEN")}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800 text-xs font-bold transition-all flex items-center gap-1"
                      title="إخفاء الاقتراح عن المعرض العام"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>إخفاء</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(item.id, "PUBLISHED")}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-xs font-bold transition-all flex items-center gap-1"
                      title="نشر وإتاحة الاقتراح"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>نشر</span>
                    </button>
                  )}

                  {item.status !== "DELETED" && (
                    <button
                      onClick={() => setSelectedDeleteId(item.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/60 transition-all"
                      title="حذف الاقتراح"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-12 text-center text-slate-400 text-xs">
          لا توجد اقتراحات مطابقة للبحث أو الفلتر
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-800 border border-slate-700 p-6 text-center space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">هل أنت متأكد من حذف هذا الاقتراح؟</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              سيتم وضع الاقتراح في حالة (محذوف) ولن يظهر للجمهور في المعرض أو نتائج البحث.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                إلغاء
              </button>
              <button
                onClick={() => updateStatus(selectedDeleteId, "DELETED")}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

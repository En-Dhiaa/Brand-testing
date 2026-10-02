"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, EyeOff, Trash2, ExternalLink } from "lucide-react";

interface CommentItem {
  id: string;
  userName: string;
  content: string;
  status: "APPROVED" | "HIDDEN" | "DELETED";
  createdAt: string;
  proposal: {
    id: string;
    publicId: string;
  };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter });
      const res = await fetch(`/api/admin/comments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [statusFilter]);

  const updateCommentStatus = async (id: string, newStatus: "APPROVED" | "HIDDEN" | "DELETED") => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">إدارة واعتدال التعليقات</h1>
        <p className="text-xs text-slate-400 mt-1">
          مراجعة آراء وملاحظات المشاركين وإخفاء أو حذف التعليقات المخالفة.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold bg-slate-800/90 p-2 rounded-2xl border border-slate-700/80">
        {["all", "APPROVED", "HIDDEN", "DELETED"].map((st) => (
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
              ? "جميع التعليقات"
              : st === "APPROVED"
              ? "المعتمدة"
              : st === "HIDDEN"
              ? "المخفية"
              : "المحذوفة"}
          </button>
        ))}
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-bold">
          جاري تحميل التعليقات...
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Comment Content */}
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-xs">{item.userName}</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                  <Link
                    href={`/proposals/${item.proposal?.publicId}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-gold-400 hover:underline"
                  >
                    <span>{item.proposal?.publicId}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      item.status === "APPROVED"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : item.status === "HIDDEN"
                        ? "bg-amber-950 text-amber-300 border-amber-800"
                        : "bg-red-950 text-red-300 border-red-800"
                    }`}
                  >
                    {item.status === "APPROVED"
                      ? "معتمد"
                      : item.status === "HIDDEN"
                      ? "مخفي"
                      : "محذوف"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {item.status !== "APPROVED" && (
                  <button
                    onClick={() => updateCommentStatus(item.id, "APPROVED")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>اعتماد</span>
                  </button>
                )}

                {item.status === "APPROVED" && (
                  <button
                    onClick={() => updateCommentStatus(item.id, "HIDDEN")}
                    className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>إخفاء</span>
                  </button>
                )}

                {item.status !== "DELETED" && (
                  <button
                    onClick={() => updateCommentStatus(item.id, "DELETED")}
                    className="p-1.5 rounded-xl text-red-400 hover:bg-red-950/60 transition-all"
                    title="حذف التعليق"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-12 text-center text-slate-400 text-xs">
          لا توجد تعليقات في هذا القسم
        </div>
      )}
    </div>
  );
}

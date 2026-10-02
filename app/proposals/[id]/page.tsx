"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoDesignState } from "@/types/logo";
import { LOGO_PARTS_METADATA } from "@/lib/logo/logo-manifest";
import { LogoRenderer } from "@/components/logo/LogoRenderer";
import { DownloadModal } from "@/components/editor/DownloadModal";
import { exportLogoImage } from "@/lib/export/export-image";
import QRCode from "qrcode";
import {
  Heart,
  Vote,
  Share2,
  Download,
  Lock,
  MessageSquare,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Send,
} from "lucide-react";

interface ProposalData {
  id: string;
  publicId: string;
  design: LogoDesignState;
  likesCount: number;
  votesCount: number;
  commentsCount: number;
  createdAt: string;
  isLocked: boolean;
  hasVoted: boolean;
  hasLiked: boolean;
  comments: {
    id: string;
    userName: string;
    content: string;
    createdAt: string;
  }[];
}

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction states
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [votesCount, setVotesCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteMessage, setVoteMessage] = useState<string | null>(null);

  // Comment form states
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Modals & UI helpers
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/proposals/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذر العثور على الاقتراح");
        return;
      }
      setProposal(data.proposal);
      setLikesCount(data.proposal.likesCount);
      setHasLiked(data.proposal.hasLiked);
      setVotesCount(data.proposal.votesCount);
      setHasVoted(data.proposal.hasVoted);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ في الشبكة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProposal();
  }, [id]);

  // Handle Like action
  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/proposals/${id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setHasLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle Vote action
  const handleVote = async () => {
    if (voteLoading || hasVoted) return;
    setVoteLoading(true);
    setVoteMessage(null);
    try {
      const res = await fetch(`/api/proposals/${id}/vote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setHasVoted(true);
        setVotesCount(data.votesCount);
        setVoteMessage("تم تسجيل تصويتك بنجاح!");
      } else {
        setVoteMessage(data.error || "تعذر تسجيل التصويت");
      }
    } catch (err) {
      console.error("Vote error:", err);
      setVoteMessage("حدث خطأ في الاتصال");
    } finally {
      setVoteLoading(false);
    }
  };

  // Handle Share link
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `اقتراح هوية الجامعة ${proposal?.publicId}`,
          text: `شاهد وصوّت لاقتراح ألوان هوية الجامعة السعودية الإلكترونية: ${proposal?.publicId}`,
          url,
        });
        return;
      } catch {
        // Fallback to copy link
      }
    }
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Open QR modal
  const handleOpenQr = async () => {
    setIsQrOpen(true);
    try {
      const url = window.location.href;
      const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation error:", err);
    }
  };

  // Copy Color Hex
  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  // Submit comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const res = await fetch(`/api/proposals/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: commentName.trim() || undefined,
          content: commentText.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCommentError(data.error || "تعذر إضافة التعليق");
        return;
      }

      // Append comment
      setProposal((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          commentsCount: prev.commentsCount + 1,
          comments: [data.comment, ...prev.comments],
        };
      });
      setCommentText("");
      setCommentName("");
    } catch (err) {
      console.error(err);
      setCommentError("حدث خطأ أثناء إرسال التعليق");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-800 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-600">جاري تحميل تفاصيل الاقتراح...</p>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">عذراً، الاقتراح غير موجود</h2>
          <p className="text-xs text-slate-500 mb-6">{error || "قد يكون تم حذف الاقتراح أو أن الرابط غير صحيح."}</p>
          <Link
            href="/proposals"
            className="inline-flex items-center gap-2 bg-brand-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-brand-900 transition-all"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة لمعرض الاقتراحات</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-16 bg-slate-50/60">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/proposals"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-800 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة إلى المعرض</span>
          </Link>

          {/* Locked Proposal Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span>اقتراح معتمد ومقفل</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Logo Preview Canvas (7 cols) */}
            <div className="md:col-span-7 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-slate-50/90 border border-slate-100 relative min-h-[300px]">
              <LogoRenderer
                design={proposal.design}
                checkerboard={true}
                interactive={false}
                className="max-h-[360px] max-w-full"
              />
            </div>

            {/* Actions & Details (5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-between h-full space-y-6">
              {/* Proposal Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">رقم الاقتراح</span>
                  <span className="text-xs text-slate-400">
                    {new Date(proposal.createdAt).toLocaleDateString("ar-SA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 font-mono mt-1 text-brand-900">
                  {proposal.publicId}
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  اقتراح ألوان معتمد للهوية البصرية للجامعة السعودية الإلكترونية.
                </p>
              </div>

              {/* Like & Vote Primary Interaction Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border transition-all active:scale-95 ${
                    hasLiked
                      ? "border-rose-300 bg-rose-50 text-rose-700 font-bold shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      hasLiked ? "fill-rose-600 text-rose-600" : "text-slate-400"
                    }`}
                  />
                  <span className="text-xs">
                    {hasLiked ? "معجب" : "أعجبني"} ({likesCount})
                  </span>
                </button>

                {/* Vote Button */}
                <button
                  onClick={handleVote}
                  disabled={voteLoading || hasVoted}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border transition-all active:scale-95 ${
                    hasVoted
                      ? "border-brand-800 bg-brand-50 text-brand-900 font-bold shadow-sm"
                      : "border-brand-800 bg-gradient-to-r from-brand-800 to-brand-900 text-white font-bold shadow-md shadow-brand-900/15 hover:shadow-lg"
                  }`}
                >
                  <Vote className={`h-5 w-5 ${hasVoted ? "text-brand-800" : "text-gold-400"}`} />
                  <span className="text-xs">
                    {hasVoted ? "تم التصويت ✓" : "صوّت للاقتراح"} ({votesCount})
                  </span>
                </button>
              </div>

              {voteMessage && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-center text-slate-700">
                  {voteMessage}
                </div>
              )}

              {/* Share & Download actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>تم نسخ الرابط!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 text-slate-500" />
                      <span>مشاركة الرابط</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleOpenQr}
                  title="عرض كود QR"
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all"
                >
                  <QrCode className="h-4 w-4 text-slate-500" />
                </button>

                <button
                  onClick={() => setIsDownloadOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Download className="h-4 w-4 text-gold-400" />
                  <span>تحميل الشعار</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette Information Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-gold-500" />
            <h2 className="text-base font-bold text-slate-900">تفاصيل ألوان الاقتراح</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {LOGO_PARTS_METADATA.map((part) => {
              const partConfig = proposal.design.parts[part.id];
              const color = partConfig?.color || "#531B23";
              const isGrad = partConfig?.gradient?.enabled;

              return (
                <div
                  key={part.id}
                  className="flex flex-col p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all"
                >
                  <span className="text-[11px] font-bold text-slate-600 truncate mb-2">
                    {part.name}
                  </span>
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-sm shrink-0"
                      style={{
                        backgroundColor: color,
                        backgroundImage: isGrad
                          ? `linear-gradient(45deg, ${partConfig.gradient?.stops[0].color}, ${partConfig.gradient?.stops[1].color})`
                          : undefined,
                      }}
                    />
                    <button
                      onClick={() => handleCopyColor(color)}
                      title="نسخ الرمز"
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 hover:text-brand-800 dir-ltr"
                    >
                      <span>{isGrad ? "تدرج" : color}</span>
                      {copiedColor === color ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-800" />
              <h2 className="text-base font-bold text-slate-900">
                التعليقات والملاحظات ({proposal.comments.length})
              </h2>
            </div>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم (اختياري):
                </label>
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="مشارك"
                  maxLength={50}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تعليقك على هذا التنسيق:
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="شاركنا رأيك في تناغم ألوان هذا الاقتراح..."
                rows={3}
                maxLength={500}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/20 resize-none"
              />
            </div>

            {commentError && (
              <span className="text-xs text-red-500 font-semibold block">{commentError}</span>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingComment || !commentText.trim()}
                className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmittingComment ? "جاري الإرسال..." : "نشر التعليق"}</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          {proposal.comments.length > 0 ? (
            <div className="space-y-3">
              {proposal.comments.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">{c.userName}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              لا توجد تعليقات حتى الآن. كن أول من يشارك برأيه!
            </p>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {isQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-800">مشاركة عبر QR Code</span>
              <button onClick={() => setIsQrOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />}
            </div>

            <p className="text-xs text-slate-500">امسح الكود بكاميرا هاتفك لفتح ومشاركة هذا الاقتراح مباشرة</p>

            <button
              onClick={() => {
                if (qrDataUrl) {
                  const a = document.createElement("a");
                  a.href = qrDataUrl;
                  a.download = `qr-${proposal.publicId}.png`;
                  a.click();
                }
              }}
              className="w-full py-2.5 bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-900 transition-all"
            >
              تنزيل كود QR
            </button>
          </div>
        </div>
      )}

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        design={proposal.design}
        publicId={proposal.publicId}
      />
    </div>
  );
}

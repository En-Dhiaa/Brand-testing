"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoEditor } from "@/hooks/useLogoEditor";
import { LogoRenderer } from "@/components/logo/LogoRenderer";
import { ComponentSelector } from "@/components/editor/ComponentSelector";
import { ColorPalettePicker } from "@/components/editor/ColorPalettePicker";
import { BackgroundControl } from "@/components/editor/BackgroundControl";
import { ConfirmationModal } from "@/components/editor/ConfirmationModal";
import { ResetModal } from "@/components/editor/ResetModal";
import { DownloadModal } from "@/components/editor/DownloadModal";
import {
  Undo2,
  Redo2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function CustomizePage() {
  const router = useRouter();
  const {
    design,
    selectedPart,
    setSelectedPart,
    setPartColor,
    setPartGradient,
    setBackground,
    applyPalette,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    zoom,
    setZoom,
  } = useLogoEditor();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 60));

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "تعذر حفظ الاقتراح، يرجى المحاولة لاحقاً");
        setIsSubmitting(false);
        return;
      }

      // Submission confirmed! Redirect to locked proposal details page
      router.push(`/proposals/${data.publicId}`);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("حدث خطأ في الشبكة أثناء إرسال الاقتراح");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 md:pb-12 bg-slate-50/50">
      <div className="container mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6">
        {/* Editor Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-gold-500" />
              <span>استوديو تخصيص الشعار</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              اضغط على أجزاء الشعار لاختيار وتنسيق ألوانك المفضلة، ثم اعتمد اقتراحك للمشاركة في التصويت.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="تراجع"
              className="p-2 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Undo2 className="h-4 w-4" />
            </button>

            <button
              onClick={redo}
              disabled={!canRedo}
              title="إعادة"
              className="p-2 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Redo2 className="h-4 w-4" />
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

            <button
              onClick={() => setIsResetOpen(true)}
              title="إعادة ضبط للألوان الأصلية"
              className="p-2 rounded-xl text-slate-600 hover:text-red-700 hover:bg-red-50 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">الألوان الأصلية</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

            <button
              onClick={() => setIsDownloadOpen(true)}
              title="تحميل نسخة تجريبية"
              className="p-2 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <Download className="h-4 w-4 text-gold-500" />
              <span className="hidden sm:inline">تحميل</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Preview on Left/Top, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Live Logo Preview Screen (5 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-3">
            <div className="relative w-full rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center min-h-[340px] sm:min-h-[440px] overflow-hidden group">
              {/* Floating preview zoom controls */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-200/80 shadow-sm text-xs font-mono">
                <button
                  onClick={handleZoomOut}
                  title="تصغير"
                  className="p-1 hover:text-brand-800 transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-1 text-slate-600 font-bold min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  title="تكبير"
                  className="p-1 hover:text-brand-800 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  title="معاينة بكامل الشاشة"
                  className="p-1 hover:text-brand-800 transition-colors mr-1 border-r border-slate-200 pr-1"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </div>

              {/* Vector Logo Render Container */}
              <div
                className="w-full flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <LogoRenderer
                  design={design}
                  checkerboard={true}
                  highlightPart={selectedPart}
                  onPartClick={setSelectedPart}
                  interactive={true}
                  className="max-w-[480px] p-2"
                />
              </div>

              {/* Helper badge */}
              <div className="mt-4 text-[11px] font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                انقر على أي جزء من الشعار لتحديده مباشرة
              </div>
            </div>

            {/* Background Control Card */}
            <BackgroundControl background={design.background} onChange={setBackground} />
          </div>

          {/* Column 2: Customization Controls (6 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
            {/* Component Selector */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-sm">
              <ComponentSelector
                selectedPart={selectedPart}
                onSelectPart={setSelectedPart}
                design={design}
              />
            </div>

            {/* Color & Palette & Gradient Picker */}
            <ColorPalettePicker
              selectedPart={selectedPart}
              partConfig={design.parts[selectedPart]}
              onColorChange={(color) => setPartColor(selectedPart, color)}
              onGradientChange={(grad) => setPartGradient(selectedPart, grad)}
              onApplyPalette={applyPalette}
            />

            {/* Desktop Action Box */}
            <div className="hidden lg:flex bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl p-5 text-white shadow-xl flex-col gap-3">
              <div className="flex items-center gap-2 text-gold-400 font-bold text-sm">
                <CheckCircle className="h-5 w-5" />
                <span>جاهز لاعتماد اقتراحك؟</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                بعد اعتماد الاقتراح سيتم قفله وحفظه نهائياً في المعرض العام ليتمكن الجميع من التصويت عليه والإعجاب به.
              </p>
              <button
                onClick={() => setIsConfirmOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-brand-950 font-bold py-3 rounded-2xl text-sm shadow-lg shadow-gold-500/20 transition-all hover:scale-[1.01] active:scale-95"
              >
                <CheckCircle className="h-5 w-5 text-brand-950" />
                <span>اعتماد الاقتراح للمشاركة</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-lg">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button
            onClick={() => setIsDownloadOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs shrink-0 flex items-center gap-1 hover:bg-slate-50"
          >
            <Download className="h-4 w-4 text-gold-500" />
            <span>تحميل</span>
          </button>

          <button
            onClick={() => setIsConfirmOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-800 to-brand-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-brand-900/20 active:scale-95"
          >
            <CheckCircle className="h-4 w-4 text-gold-400" />
            <span>اعتماد الاقتراح</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 left-6 text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            إغلاق المعاينة ✕
          </button>
          <div className="max-w-2xl max-h-[80vh] w-full flex items-center justify-center">
            <LogoRenderer design={design} checkerboard={true} interactive={false} />
          </div>
        </div>
      )}

      {/* Confirmation & Locking Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinalSubmit}
        design={design}
        isSubmitting={isSubmitting}
        error={submitError}
      />

      {/* Reset Modal */}
      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={reset}
      />

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        design={design}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoEditor } from "@/hooks/useLogoEditor";
import { LogoRenderer } from "@/components/logo/LogoRenderer";
import { ComponentSelector } from "@/components/editor/ComponentSelector";
import { PredefinedColorsControl } from "@/components/editor/PredefinedColorsControl";
import { CustomColorControl } from "@/components/editor/CustomColorControl";
import { GradientEditor } from "@/components/editor/GradientEditor";
import { BackgroundControl } from "@/components/editor/BackgroundControl";
import { CollapsiblePanel } from "@/components/editor/CollapsiblePanel";
import { ConfirmationModal } from "@/components/editor/ConfirmationModal";
import { ResetModal } from "@/components/editor/ResetModal";
import { DownloadModal } from "@/components/editor/DownloadModal";
import { LOGO_PARTS_METADATA } from "@/lib/logo/logo-manifest";
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
  Layers,
  Palette,
  Sliders,
  Blend,
  Image as ImageIcon,
  Check,
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

  // Collapsible panels state (Panels 1, 2, 4 open by default for discoverability)
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    selector: true,
    palette: true,
    custom: false,
    gradient: true,
    background: false,
  });

  const togglePanel = (panelId: string) => {
    setOpenPanels((prev) => ({
      ...prev,
      [panelId]: !prev[panelId],
    }));
  };

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

      // Redirect to locked proposal details page
      router.push(`/proposals/${data.publicId}`);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("حدث خطأ في الشبكة أثناء إرسال الاقتراح");
      setIsSubmitting(false);
    }
  };

  // Determine active configuration for the selected part or all parts
  const activePartConfig =
    selectedPart === "all"
      ? design.parts.symbol_y || design.parts.text_arabic || { color: "#531B23" }
      : design.parts[selectedPart] || { color: "#531B23" };

  const currentColor = activePartConfig?.color || "#531B23";
  const isGradientEnabled = !!activePartConfig?.gradient?.enabled;

  const activeGradientConfig = activePartConfig?.gradient || {
    enabled: true,
    type: "linear",
    angle: 90,
    stops: [
      { color: currentColor, offset: 0 },
      { color: "#C9A227", offset: 100 },
    ],
  };

  // Human-readable label for selected part
  const selectedPartName =
    selectedPart === "all"
      ? "كامل الشعار"
      : LOGO_PARTS_METADATA.find((p) => p.id === selectedPart)?.name || "جزء محدد";

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col overflow-hidden bg-slate-50/50 lg:h-auto lg:min-h-[calc(100vh-4rem)] lg:overflow-visible">
      {/* ======================================================== */}
      {/* 1. MOBILE ONLY: 100% FIXED TOP LOGO PREVIEW LAYER         */}
      {/* This layer NEVER moves, scrolls, jumps, or resizes.       */}
      {/* The controls below scroll UNDERNEATH it and disappear.   */}
      {/* ======================================================== */}
      <div className="lg:hidden shrink-0 w-full h-[260px] sm:h-[285px] bg-slate-100/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm z-20 relative px-3 py-2 flex flex-col justify-between">
        {/* Mobile Fixed Top Micro-Toolbar */}
        <div className="flex items-center justify-between gap-1 h-7 mb-1.5">
          {/* Right: Quick [✓ الكل] small control + Active part indicator */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-mobile-select-all"
              onClick={() => setSelectedPart("all")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                selectedPart === "all"
                  ? "bg-brand-900 text-gold-400 border border-brand-800 ring-1 ring-gold-400/30"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:scale-95"
              }`}
              title="تحديد كامل الشعار معاً"
            >
              <Check className="h-3.5 w-3.5 text-gold-400" />
              <span>الكل</span>
            </button>

            <span className="text-[11px] font-bold text-slate-600 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-lg flex items-center gap-1 truncate max-w-[130px]">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: currentColor,
                  backgroundImage: isGradientEnabled
                    ? `linear-gradient(45deg, ${activeGradientConfig.stops[0]?.color}, ${activeGradientConfig.stops[1]?.color})`
                    : undefined,
                }}
              />
              <span className="truncate">{selectedPartName}</span>
            </span>
          </div>

          {/* Left: Quick Undo/Redo & Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title="تراجع"
              className="p-1 rounded-lg text-slate-600 hover:text-brand-900 bg-white/80 border border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title="إعادة"
              className="p-1 rounded-lg text-slate-600 hover:text-brand-900 bg-white/80 border border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsResetOpen(true)}
              title="الألوان الأصلية"
              className="p-1 rounded-lg text-slate-600 hover:text-red-700 bg-white/80 border border-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <div className="h-3 w-[1px] bg-slate-300 mx-0.5" />

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              title="ملء الشاشة"
              className="p-1 rounded-lg text-slate-600 hover:text-brand-800 bg-white/80 border border-slate-200"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Fixed Logo Preview Canvas (Strictly contained, never moves) */}
        <div className="relative w-full flex-1 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex items-center justify-center bg-white">
          <LogoRenderer
            design={design}
            checkerboard={true}
            highlightPart={selectedPart}
            onPartClick={(partId) => setSelectedPart(partId)}
            interactive={true}
            className="w-full h-full"
            innerClassName="w-full h-full flex items-center justify-center p-1 sm:p-2 max-w-[96%] max-h-[96%]"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SCROLLABLE SETTINGS LAYER (Passes under fixed logo)     */}
      {/* On desktop, transforms into standard 2-column container.  */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3 pb-28 lg:pb-12 lg:overflow-visible lg:container lg:mx-auto lg:max-w-7xl lg:px-6 lg:py-6">
        {/* Desktop Title Banner */}
        <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-gold-500" />
              <span>استوديو تخصيص الشعار</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              خصص ألوان وتدرجات شعار الجامعة اليمنية الإلكترونية، ثم اعتمد اقتراحك للمشاركة في التصويت المجتمعي.
            </p>
          </div>

          {/* Desktop Top Quick Actions Bar */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title="تراجع"
              className="p-2 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Undo2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title="إعادة"
              className="p-2 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Redo2 className="h-4 w-4" />
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

            <button
              type="button"
              onClick={() => setIsResetOpen(true)}
              title="إعادة ضبط للألوان الأصلية"
              className="p-2 rounded-xl text-slate-600 hover:text-red-700 hover:bg-red-50 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">الألوان الأصلية</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

            <button
              type="button"
              onClick={() => setIsDownloadOpen(true)}
              title="تحميل نسخة تجريبية"
              className="p-2 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <Download className="h-4 w-4 text-gold-500" />
              <span className="hidden sm:inline">تحميل</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Desktop Preview on Left, 5 Collapsible Panels on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Preview Column (Hidden on mobile because mobile uses the 100% fixed top preview) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 lg:sticky lg:top-20 z-10 flex-col gap-4">
            {/* Desktop Preview Card */}
            <div className="relative w-full rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center min-h-[440px] sm:min-h-[480px] max-h-[540px] overflow-hidden group">
              {/* Floating desktop preview controls */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-200/80 shadow-sm text-xs font-mono">
                <button
                  type="button"
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
                  type="button"
                  onClick={handleZoomIn}
                  title="تكبير"
                  className="p-1 hover:text-brand-800 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  title="معاينة بكامل الشاشة"
                  className="p-1 hover:text-brand-800 transition-colors mr-1 border-r border-slate-200 pr-1"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </div>

              {/* Desktop Status indicator on top right */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/80 text-[11px] font-bold text-slate-700 shadow-sm">
                <button
                  type="button"
                  onClick={() => setSelectedPart("all")}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                    selectedPart === "all"
                      ? "bg-brand-900 text-gold-400"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  ✓ الكل
                </button>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: currentColor,
                    backgroundImage: isGradientEnabled
                      ? `linear-gradient(45deg, ${activeGradientConfig.stops[0]?.color}, ${activeGradientConfig.stops[1]?.color})`
                      : undefined,
                  }}
                />
                <span>{selectedPartName}</span>
              </div>

              {/* Vector Logo Render Container */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <LogoRenderer
                  design={design}
                  checkerboard={true}
                  highlightPart={selectedPart}
                  onPartClick={(partId) => setSelectedPart(partId)}
                  interactive={true}
                  className="w-full h-full"
                  innerClassName="w-full h-full flex items-center justify-center p-2 sm:p-3 max-w-[96%] max-h-[95%]"
                />
              </div>

              {/* Helper badge */}
              <div className="mt-2 text-[11px] font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 text-center">
                انقر على أي جزء من الشعار لتحديده، أو اختر &quot;✓ الكل&quot; للتطبيق الموحد
              </div>
            </div>

            {/* Desktop Elevated Action Box */}
            <div className="bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl p-5 text-white shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gold-400 font-bold text-sm">
                  <CheckCircle className="h-5 w-5" />
                  <span>جاهز لاعتماد هذا التصميم؟</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDownloadOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all"
                >
                  <Download className="h-3.5 w-3.5 text-gold-400" />
                  <span>تحميل</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                بعد اعتماد الاقتراح سيتم قفله وحفظه نهائياً في المعرض العام ليتمكن الجميع من التصويت عليه والإعجاب به.
              </p>

              <button
                type="button"
                id="btn-desktop-submit-proposal"
                onClick={() => setIsConfirmOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-brand-950 font-black py-3.5 rounded-2xl text-sm shadow-lg shadow-gold-500/20 transition-all hover:scale-[1.01] active:scale-95"
              >
                <CheckCircle className="h-5 w-5 text-brand-950" />
                <span>اعتماد الاقتراح للمشاركة في التصويت</span>
              </button>
            </div>
          </div>

          {/* Controls Column (5 Collapsible Panels) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-3">
            {/* Panel 1: اختيار العنصر */}
            <CollapsiblePanel
              id="selector"
              title="اختيار العنصر"
              subtitle="تحديد كامل الشعار أو جزء محدد"
              icon={<Layers className="h-4 w-4" />}
              badge={
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-900 border border-brand-200">
                  {selectedPartName}
                </span>
              }
              isOpen={openPanels.selector}
              onToggle={() => togglePanel("selector")}
            >
              <ComponentSelector
                selectedPart={selectedPart}
                onSelectPart={(target) => setSelectedPart(target)}
                design={design}
              />
            </CollapsiblePanel>

            {/* Panel 2: ألوان الشعار واللوحات الجاهزة */}
            <CollapsiblePanel
              id="palette"
              title="ألوان الشعار"
              subtitle="18 لوناً معتمداً ومجموعات متناسقة"
              icon={<Palette className="h-4 w-4" />}
              badge={
                <span
                  className="w-3 h-3 rounded-full border border-black/10 shadow-xs inline-block"
                  style={{ backgroundColor: currentColor }}
                />
              }
              isOpen={openPanels.palette}
              onToggle={() => togglePanel("palette")}
            >
              <PredefinedColorsControl
                currentColor={currentColor}
                selectedTarget={selectedPart}
                isGradientActive={isGradientEnabled}
                onColorSelect={(color) => setPartColor(selectedPart, color)}
                onApplyPalette={applyPalette}
              />
            </CollapsiblePanel>

            {/* Panel 3: لون مخصص */}
            <CollapsiblePanel
              id="custom"
              title="لون مخصص"
              subtitle="كود HEX وعجلة ألوان دقيقة"
              icon={<Sliders className="h-4 w-4" />}
              badge={
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                  {currentColor}
                </span>
              }
              isOpen={openPanels.custom}
              onToggle={() => togglePanel("custom")}
            >
              <CustomColorControl
                currentColor={currentColor}
                selectedTarget={selectedPart}
                onColorChange={(color) => setPartColor(selectedPart, color)}
              />
            </CollapsiblePanel>

            {/* Panel 4: التدرج اللوني */}
            <CollapsiblePanel
              id="gradient"
              title="التدرج اللوني"
              subtitle="متعدد الألوان، 8 اتجاهات، وزاوية مخصصة"
              icon={<Blend className="h-4 w-4 text-gold-500" />}
              badge={
                isGradientEnabled ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-50 text-gold-800 border border-gold-300">
                    نشط
                  </span>
                ) : undefined
              }
              isOpen={openPanels.gradient}
              onToggle={() => togglePanel("gradient")}
            >
              <GradientEditor
                selectedTarget={selectedPart}
                gradientConfig={activeGradientConfig}
                onChange={(grad) => setPartGradient(selectedPart, grad)}
                onDisableGradient={() => setPartColor(selectedPart, currentColor)}
              />
            </CollapsiblePanel>

            {/* Panel 5: خلفية الشعار */}
            <CollapsiblePanel
              id="background"
              title="خلفية الشعار"
              subtitle="شفافة أو ملونة لمعاينة التباين"
              icon={<ImageIcon className="h-4 w-4" />}
              badge={
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {design.background.type === "transparent" ? "شفافة" : "ملونة"}
                </span>
              }
              isOpen={openPanels.background}
              onToggle={() => togglePanel("background")}
            >
              <div className="space-y-3">
                <BackgroundControl
                  background={design.background}
                  onChange={setBackground}
                />

                {/* Compact Action Buttons directly under background controls */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-bg-save-proposal"
                    onClick={() => setIsConfirmOpen(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-900 to-brand-800 hover:from-brand-800 hover:to-brand-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm active:scale-95 transition-all"
                  >
                    <CheckCircle className="h-4 w-4 text-gold-400" />
                    <span>حفظ الاقتراح</span>
                  </button>

                  <button
                    type="button"
                    id="btn-bg-download-logo"
                    onClick={() => setIsDownloadOpen(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-3 rounded-xl text-xs border border-slate-300 active:scale-95 transition-all shadow-xs"
                  >
                    <Download className="h-4 w-4 text-gold-500" />
                    <span>تنزيل الشعار</span>
                  </button>
                </div>
              </div>
            </CollapsiblePanel>

            {/* Quick Action Buttons directly under settings section */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                id="btn-settings-bottom-save"
                onClick={() => setIsConfirmOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-900 to-brand-800 hover:from-brand-800 hover:to-brand-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm active:scale-95 transition-all"
              >
                <CheckCircle className="h-4 w-4 text-gold-400" />
                <span>حفظ الاقتراح</span>
              </button>

              <button
                type="button"
                id="btn-settings-bottom-download"
                onClick={() => setIsDownloadOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-3 rounded-xl text-xs border border-slate-300 active:scale-95 transition-all shadow-xs"
              >
                <Download className="h-4 w-4 text-gold-500" />
                <span>تنزيل الشعار</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MOBILE ONLY: ELEVATED STICKY ACTION BAR AT BOTTOM     */}
      {/* ======================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button
            type="button"
            id="btn-mobile-download"
            onClick={() => setIsDownloadOpen(true)}
            className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs shrink-0 flex items-center gap-1.5 hover:bg-slate-50 active:scale-95 shadow-xs"
          >
            <Download className="h-4 w-4 text-gold-500" />
            <span>تحميل</span>
          </button>

          <button
            type="button"
            id="btn-mobile-submit-proposal"
            onClick={() => setIsConfirmOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-900 to-brand-800 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-900/20 active:scale-95 transition-all"
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
            type="button"
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

"use client";

import React from "react";
import { LogoSelectionTarget, LogoDesignState } from "@/types/logo";
import { LOGO_PARTS_METADATA } from "@/lib/logo/logo-manifest";
import { Check, Layers, Sparkles } from "lucide-react";

interface ComponentSelectorProps {
  selectedPart: LogoSelectionTarget;
  onSelectPart: (target: LogoSelectionTarget) => void;
  design: LogoDesignState;
}

export function ComponentSelector({
  selectedPart,
  onSelectPart,
  design,
}: ComponentSelectorProps) {
  const isAllSelected = selectedPart === "all";

  // Check if any part has gradient or get primary color
  const samplePart = design.parts.symbol_y || design.parts.text_arabic;
  const sampleColor = samplePart?.color || "#531B23";
  const sampleGradient = samplePart?.gradient?.enabled
    ? `linear-gradient(90deg, ${samplePart.gradient.stops.map((s) => `${s.color} ${s.offset}%`).join(", ")})`
    : undefined;

  return (
    <div className="w-full space-y-3">
      {/* Selection Mode Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-brand-800" />
          <span>تحديد نطاق التلوين والتدرج:</span>
        </label>
        <span className="text-[11px] text-slate-400">
          {isAllSelected ? "محدد: كامل الشعار" : "محدد: جزء مخصص"}
        </span>
      </div>

      {/* Primary Full-Logo Selection Button */}
      <button
        type="button"
        id="btn-select-all-logo"
        onClick={() => onSelectPart("all")}
        className={`w-full relative overflow-hidden flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-200 text-right ${
          isAllSelected
            ? "border-brand-800 bg-gradient-to-r from-brand-50/90 via-gold-50/30 to-brand-50/90 text-brand-950 shadow-md ring-2 ring-brand-800/30"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/70"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Swatch / Icon */}
          <div
            className="w-8 h-8 rounded-xl border border-black/15 shrink-0 shadow-sm flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: sampleColor,
              backgroundImage: sampleGradient,
            }}
          >
            <Sparkles className="h-4 w-4 text-white/90 drop-shadow" />
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                كامل الشعار (الكل)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                تطبيق موحد
              </span>
            </div>
            <span className="text-[11px] text-slate-500 truncate mt-0.5">
              تلوين وتدرج موحد لجميع العناصر معاً
            </span>
          </div>
        </div>

        {isAllSelected && (
          <div className="h-6 w-6 rounded-full bg-brand-800 text-white flex items-center justify-center shrink-0 ml-1 shadow-sm">
            <Check className="h-4 w-4" />
          </div>
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-slate-200" />
        <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400">
          أو اختر جزءاً محدداً لتلوينه منفرداً
        </span>
        <div className="flex-grow border-t border-slate-200" />
      </div>

      {/* Sub-parts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LOGO_PARTS_METADATA.map((meta) => {
          const isSelected = selectedPart === meta.id;
          const partConfig = design.parts[meta.id];
          const currentColor = partConfig?.color || "#531B23";
          const hasGradient = partConfig?.gradient?.enabled;
          const gradStops = partConfig?.gradient?.stops;
          const gradBg = hasGradient && gradStops
            ? `linear-gradient(45deg, ${gradStops.map((s) => `${s.color} ${s.offset}%`).join(", ")})`
            : undefined;

          return (
            <button
              type="button"
              key={meta.id}
              id={`btn-select-part-${meta.id}`}
              onClick={() => onSelectPart(meta.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all text-xs font-semibold ${
                isSelected
                  ? "border-brand-800 bg-brand-50/80 text-brand-900 shadow-sm ring-1 ring-brand-800 font-bold"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* Color swatch */}
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-inner"
                  style={{
                    backgroundColor: currentColor,
                    backgroundImage: gradBg,
                  }}
                />
                <span className="truncate">{meta.name}</span>
              </div>

              {isSelected && (
                <Check className="h-3.5 w-3.5 text-brand-800 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

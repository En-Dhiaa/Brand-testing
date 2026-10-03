"use client";

import React, { useState } from "react";
import { ColorPalette, LogoSelectionTarget } from "@/types/logo";
import { PREDEFINED_COLORS, PREDEFINED_PALETTES } from "@/lib/logo/palette-data";
import { normalizeHexColor } from "@/lib/validation/proposal-schema";
import { Check, Palette, Sparkles } from "lucide-react";

interface PredefinedColorsControlProps {
  currentColor: string;
  selectedTarget: LogoSelectionTarget;
  isGradientActive: boolean;
  onColorSelect: (color: string) => void;
  onApplyPalette: (palette: ColorPalette) => void;
}

export function PredefinedColorsControl({
  currentColor,
  selectedTarget,
  isGradientActive,
  onColorSelect,
  onApplyPalette,
}: PredefinedColorsControlProps) {
  const [subTab, setSubTab] = useState<"colors" | "palettes">("colors");

  return (
    <div className="w-full space-y-3 text-right">
      {/* Target notification */}
      {selectedTarget === "all" && (
        <div className="text-[11px] text-brand-900 bg-brand-50/70 border border-brand-200/80 p-2 rounded-xl flex items-center gap-1.5 font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-brand-800 shrink-0" />
          <span>اختيار لون هنا سيُطبقه على جميع أجزاء الشعار معاً.</span>
        </div>
      )}

      {/* Subtab Toggle: Individual Swatches vs Complete Palettes */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setSubTab("colors")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            subTab === "colors"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>الألوان المعتمدة (18 لون)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("palettes")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            subTab === "palettes"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          <span>مجموعات الهوية الكاملة</span>
        </button>
      </div>

      {/* Tab 1: Single Swatches Grid */}
      {subTab === "colors" && (
        <div className="space-y-3">
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
            {PREDEFINED_COLORS.map((item) => {
              const isSelected =
                !isGradientActive &&
                normalizeHexColor(currentColor) === normalizeHexColor(item.hex);

              return (
                <button
                  type="button"
                  key={item.hex}
                  onClick={() => onColorSelect(item.hex)}
                  title={`${item.name} (${item.hex})`}
                  className={`group relative aspect-square rounded-xl border border-black/10 transition-transform active:scale-90 flex items-center justify-center shadow-sm hover:scale-110 ${
                    isSelected ? "ring-2 ring-brand-800 ring-offset-2 scale-105" : ""
                  }`}
                  style={{ backgroundColor: item.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`h-4 w-4 ${
                        ["#FFFFFF", "#FDFBF7", "#E5E7EB", "#9CA3AF"].includes(item.hex)
                          ? "text-black"
                          : "text-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span>اللون المحدد حالياً:</span>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: currentColor }}
              />
              <span className="font-mono font-bold text-slate-800 dir-ltr">{currentColor}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Palettes */}
      {subTab === "palettes" && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
          {PREDEFINED_PALETTES.map((palette) => (
            <div
              key={palette.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-brand-800 bg-white hover:bg-brand-50/20 transition-all gap-2"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">{palette.name}</span>
                <span className="text-[11px] text-slate-500 line-clamp-1">{palette.description}</span>
                <div className="flex items-center gap-1 mt-1">
                  {Object.values(palette.colors).map((color, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onApplyPalette(palette)}
                className="bg-brand-50 hover:bg-brand-800 text-brand-900 hover:text-white border border-brand-200 hover:border-brand-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
              >
                تطبيق
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

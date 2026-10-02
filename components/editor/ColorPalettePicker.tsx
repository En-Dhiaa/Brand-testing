"use client";

import React, { useState } from "react";
import { LogoPartId, PartColorConfig, ColorPalette, GradientConfig } from "@/types/logo";
import { PREDEFINED_COLORS, PREDEFINED_PALETTES } from "@/lib/logo/palette-data";
import { HEX_COLOR_REGEX, normalizeHexColor } from "@/lib/validation/proposal-schema";
import { Palette, Check, Sparkles, Sliders, Blend } from "lucide-react";

interface ColorPalettePickerProps {
  selectedPart: LogoPartId;
  partConfig: PartColorConfig;
  onColorChange: (color: string) => void;
  onGradientChange: (gradient: GradientConfig) => void;
  onApplyPalette: (palette: ColorPalette) => void;
}

export function ColorPalettePicker({
  selectedPart,
  partConfig,
  onColorChange,
  onGradientChange,
  onApplyPalette,
}: ColorPalettePickerProps) {
  const [activeTab, setActiveTab] = useState<"swatches" | "palettes" | "custom" | "gradient">(
    "swatches"
  );
  const [customHex, setCustomHex] = useState(partConfig?.color || "#531B23");
  const [hexError, setHexError] = useState(false);

  // Gradient state
  const isGradientEnabled = !!partConfig?.gradient?.enabled;
  const gradientConfig = partConfig?.gradient || {
    enabled: true,
    type: "linear" as const,
    angle: 45,
    stops: [
      { color: partConfig?.color || "#531B23", offset: 0 },
      { color: "#C9A227", offset: 100 },
    ],
  };

  const handleHexInput = (val: string) => {
    setCustomHex(val);
    const cleaned = val.trim();
    if (HEX_COLOR_REGEX.test(cleaned)) {
      setHexError(false);
      onColorChange(normalizeHexColor(cleaned));
    } else {
      setHexError(true);
    }
  };

  const updateGradientStop = (index: number, newColor: string) => {
    const updatedStops = [...gradientConfig.stops];
    updatedStops[index] = { ...updatedStops[index], color: newColor };
    onGradientChange({
      ...gradientConfig,
      enabled: true,
      stops: updatedStops,
    });
  };

  const updateGradientAngle = (angle: number) => {
    onGradientChange({
      ...gradientConfig,
      enabled: true,
      angle,
    });
  };

  const updateGradientType = (type: "linear" | "radial") => {
    onGradientChange({
      ...gradientConfig,
      enabled: true,
      type,
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
      {/* Tab Switcher */}
      <div className="flex bg-slate-100/90 p-1 rounded-xl gap-1 mb-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("swatches")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "swatches"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>الألوان المختارة</span>
        </button>

        <button
          onClick={() => setActiveTab("palettes")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "palettes"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>مجموعات كاملة</span>
        </button>

        <button
          onClick={() => setActiveTab("custom")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "custom"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>لون مخصص</span>
        </button>

        <button
          onClick={() => setActiveTab("gradient")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "gradient"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Blend className="h-3.5 w-3.5" />
          <span>تدرج</span>
        </button>
      </div>

      {/* Tab 1: Single Swatches */}
      {activeTab === "swatches" && (
        <div>
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2.5">
            {PREDEFINED_COLORS.map((item) => {
              const isSelected =
                !isGradientEnabled &&
                normalizeHexColor(partConfig?.color) === normalizeHexColor(item.hex);
              return (
                <button
                  key={item.hex}
                  onClick={() => {
                    onColorChange(item.hex);
                    setCustomHex(item.hex);
                  }}
                  title={item.name}
                  className={`group relative aspect-square rounded-xl border border-black/10 transition-transform active:scale-90 flex items-center justify-center shadow-sm hover:scale-110 ${
                    isSelected ? "ring-2 ring-brand-800 ring-offset-2 scale-105" : ""
                  }`}
                  style={{ backgroundColor: item.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`h-4 w-4 ${
                        ["#FFFFFF", "#FDFBF7", "#E5E7EB"].includes(item.hex)
                          ? "text-black"
                          : "text-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>اللون المختار حالياً:</span>
            <span className="font-mono font-bold text-slate-800 dir-ltr">{partConfig?.color}</span>
          </div>
        </div>
      )}

      {/* Tab 2: Full Palettes */}
      {activeTab === "palettes" && (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {PREDEFINED_PALETTES.map((palette) => (
            <div
              key={palette.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-800">{palette.name}</span>
                <span className="text-[11px] text-slate-500">{palette.description}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {Object.values(palette.colors).map((color, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => onApplyPalette(palette)}
                className="bg-white hover:bg-brand-50 text-brand-900 border border-slate-200 hover:border-brand-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 shrink-0"
              >
                تطبيق المجموعة
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Custom Hex */}
      {activeTab === "custom" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {/* HTML Color Picker */}
            <div className="relative">
              <input
                type="color"
                value={partConfig?.color || "#531B23"}
                onChange={(e) => {
                  onColorChange(e.target.value);
                  setCustomHex(e.target.value);
                  setHexError(false);
                }}
                className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-0.5"
              />
            </div>

            {/* Direct Hex Text Input */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رمز اللون (HEX):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => handleHexInput(e.target.value)}
                  placeholder="#531B23"
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono dir-ltr uppercase font-bold focus:outline-none focus:ring-2 ${
                    hexError
                      ? "border-red-500 focus:ring-red-200 text-red-600"
                      : "border-slate-300 focus:ring-brand-800/20 text-slate-800"
                  }`}
                />
              </div>
              {hexError && (
                <span className="text-[11px] text-red-500 mt-1 block">
                  يرجى إدخال رمز لون صالح بصيغة HEX (مثال: #531B23)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Gradient */}
      {activeTab === "gradient" && (
        <div className="space-y-4">
          {/* Gradient Type */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">نوع التدرج:</span>
            <div className="flex gap-2">
              <button
                onClick={() => updateGradientType("linear")}
                className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                  gradientConfig.type === "linear"
                    ? "bg-brand-800 text-white border-brand-800 shadow-sm"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                خطي
              </button>
              <button
                onClick={() => updateGradientType("radial")}
                className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                  gradientConfig.type === "radial"
                    ? "bg-brand-800 text-white border-brand-800 shadow-sm"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                دائري
              </button>
            </div>
          </div>

          {/* Color stops */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                اللون الأول (البداية):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradientConfig.stops[0].color}
                  onChange={(e) => updateGradientStop(0, e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="text-xs font-mono font-bold text-slate-700 dir-ltr">
                  {gradientConfig.stops[0].color}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                اللون الثاني (النهاية):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradientConfig.stops[1].color}
                  onChange={(e) => updateGradientStop(1, e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="text-xs font-mono font-bold text-slate-700 dir-ltr">
                  {gradientConfig.stops[1].color}
                </span>
              </div>
            </div>
          </div>

          {/* Angle Slider (for linear) */}
          {gradientConfig.type === "linear" && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>زاوية التدرج:</span>
                <span className="font-mono text-brand-800">{gradientConfig.angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={gradientConfig.angle}
                onChange={(e) => updateGradientAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-800"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

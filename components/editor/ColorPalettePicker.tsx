"use client";

import React, { useState } from "react";
import { LogoSelectionTarget, PartColorConfig, ColorPalette, GradientConfig } from "@/types/logo";
import { PredefinedColorsControl } from "./PredefinedColorsControl";
import { CustomColorControl } from "./CustomColorControl";
import { GradientEditor } from "./GradientEditor";
import { Palette, Sparkles, Sliders, Blend } from "lucide-react";

interface ColorPalettePickerProps {
  selectedPart: LogoSelectionTarget;
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
  const [activeTab, setActiveTab] = useState<"swatches" | "custom" | "gradient">("swatches");

  // Current color or fallback
  const currentColor = partConfig?.color || "#531B23";
  const isGradientEnabled = !!partConfig?.gradient?.enabled;

  // Active gradient config or sensible default
  const gradientConfig: GradientConfig = partConfig?.gradient || {
    enabled: true,
    type: "linear",
    angle: 90,
    stops: [
      { color: currentColor, offset: 0 },
      { color: "#C9A227", offset: 100 },
    ],
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 shadow-sm space-y-4">
      {/* Tab Switcher */}
      <div className="flex bg-slate-100/90 p-1 rounded-xl gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("swatches")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "swatches"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span className="truncate">ألوان الشعار</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "custom"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span className="truncate">لون مخصص</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gradient")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "gradient"
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Blend className="h-3.5 w-3.5 text-gold-500" />
          <span className="truncate">تدرج لوني</span>
        </button>
      </div>

      {/* Tab 1: Predefined Colors & Palettes */}
      {activeTab === "swatches" && (
        <PredefinedColorsControl
          currentColor={currentColor}
          selectedTarget={selectedPart}
          isGradientActive={isGradientEnabled}
          onColorSelect={onColorChange}
          onApplyPalette={onApplyPalette}
        />
      )}

      {/* Tab 2: Custom Color */}
      {activeTab === "custom" && (
        <CustomColorControl
          currentColor={currentColor}
          selectedTarget={selectedPart}
          onColorChange={onColorChange}
        />
      )}

      {/* Tab 3: Advanced Multi-Stop Gradient */}
      {activeTab === "gradient" && (
        <GradientEditor
          selectedTarget={selectedPart}
          gradientConfig={gradientConfig}
          onChange={onGradientChange}
          onDisableGradient={() => onColorChange(currentColor)}
        />
      )}
    </div>
  );
}

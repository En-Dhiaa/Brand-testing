"use client";

import React from "react";
import { BackgroundConfig, GradientConfig } from "@/types/logo";

interface BackgroundControlProps {
  background: BackgroundConfig;
  onChange: (bg: BackgroundConfig) => void;
}

const BG_PRESETS = [
  { name: "شفافة", type: "transparent" as const, color: undefined },
  { name: "أبيض", type: "solid" as const, color: "#FFFFFF" },
  { name: "عاجي", type: "solid" as const, color: "#FDFBF7" },
  { name: "رمادي فاتح", type: "solid" as const, color: "#F1F5F9" },
  { name: "أسود داكن", type: "solid" as const, color: "#121212" },
  { name: "كحلي", type: "solid" as const, color: "#0D1B2A" },
  { name: "عنابي", type: "solid" as const, color: "#531B23" },
];

export function BackgroundControl({ background, onChange }: BackgroundControlProps) {
  const isTransparent = background.type === "transparent";

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-700">خلفية الشعار:</span>
        <span className="text-[11px] text-slate-400">
          {isTransparent ? "شفافة (خلفية افتراضية للتحميل كـ PNG)" : "ملونة"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {BG_PRESETS.map((preset) => {
          const isSelected =
            background.type === preset.type &&
            (preset.type === "transparent" || background.color === preset.color);

          return (
            <button
              key={preset.name}
              onClick={() => {
                if (preset.type === "transparent") {
                  onChange({ type: "transparent" });
                } else {
                  onChange({ type: "solid", color: preset.color });
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isSelected
                  ? "border-brand-800 bg-brand-50 text-brand-900 ring-1 ring-brand-800 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 ${
                  preset.type === "transparent" ? "checkerboard-bg" : ""
                }`}
                style={{
                  backgroundColor: preset.color,
                }}
              />
              <span>{preset.name}</span>
            </button>
          );
        })}

        {/* Custom background color */}
        <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2 py-1 bg-white hover:border-slate-300">
          <input
            type="color"
            value={background.color || "#FFFFFF"}
            onChange={(e) => onChange({ type: "solid", color: e.target.value })}
            className="w-5 h-5 rounded cursor-pointer border-0 p-0"
            title="اختر لون مخصص للخلفية"
          />
          <span className="text-xs font-semibold text-slate-600">لون مخصص</span>
        </div>
      </div>
    </div>
  );
}

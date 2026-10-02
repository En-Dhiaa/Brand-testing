"use client";

import React from "react";
import { LogoPartId, LogoDesignState } from "@/types/logo";
import { LOGO_PARTS_METADATA } from "@/lib/logo/logo-manifest";
import { Check } from "lucide-react";

interface ComponentSelectorProps {
  selectedPart: LogoPartId;
  onSelectPart: (partId: LogoPartId) => void;
  design: LogoDesignState;
}

export function ComponentSelector({
  selectedPart,
  onSelectPart,
  design,
}: ComponentSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          اختر جزء الشعار للتعديل:
        </label>
        <span className="text-xs text-slate-400">
          (أو اضغط مباشرة على الشعار)
        </span>
      </div>

      {/* Responsive scrollable grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LOGO_PARTS_METADATA.map((meta) => {
          const isSelected = selectedPart === meta.id;
          const partConfig = design.parts[meta.id];
          const currentColor = partConfig?.color || "#531B23";
          const hasGradient = partConfig?.gradient?.enabled;

          return (
            <button
              key={meta.id}
              onClick={() => onSelectPart(meta.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all text-xs font-semibold ${
                isSelected
                  ? "border-brand-800 bg-brand-50/70 text-brand-900 shadow-sm ring-1 ring-brand-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* Color swatch */}
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-inner"
                  style={{
                    backgroundColor: currentColor,
                    backgroundImage: hasGradient
                      ? `linear-gradient(45deg, ${partConfig.gradient?.stops[0].color}, ${partConfig.gradient?.stops[1].color})`
                      : undefined,
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

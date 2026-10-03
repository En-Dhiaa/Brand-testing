"use client";

import React, { useState, useEffect } from "react";
import { LogoSelectionTarget } from "@/types/logo";
import { HEX_COLOR_REGEX, normalizeHexColor } from "@/lib/validation/proposal-schema";
import { Sliders, Copy, Check, Sparkles } from "lucide-react";

interface CustomColorControlProps {
  currentColor: string;
  selectedTarget: LogoSelectionTarget;
  onColorChange: (color: string) => void;
}

const QUICK_COLORS = [
  "#531B23", // العنابي
  "#C9A227", // الذهب
  "#1B5E20", // الزمرد
  "#0D1B2A", // الكحلي
  "#1A1A1A", // الأسود
  "#FFFFFF", // الأبيض
  "#70393D", // النبيذي
  "#48CAE4", // السماوي
];

export function CustomColorControl({
  currentColor,
  selectedTarget,
  onColorChange,
}: CustomColorControlProps) {
  const [hexInput, setHexInput] = useState(currentColor || "#531B23");
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHexInput(currentColor || "#531B23");
    setError(false);
  }, [currentColor]);

  const handleInputChange = (val: string) => {
    setHexInput(val);
    const cleaned = val.trim();
    if (HEX_COLOR_REGEX.test(cleaned)) {
      setError(false);
      onColorChange(normalizeHexColor(cleaned));
    } else {
      setError(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4 text-right">
      {/* Target Notification */}
      {selectedTarget === "all" && (
        <div className="text-[11px] text-brand-900 bg-brand-50/70 border border-brand-200/80 p-2 rounded-xl flex items-center gap-1.5 font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-brand-800 shrink-0" />
          <span>سيتم تطبيق اللون المخصص على كامل أجزاء الشعار معاً.</span>
        </div>
      )}

      {/* Color Picker + HEX Row */}
      <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
        {/* Native HTML Color Picker */}
        <div className="relative shrink-0">
          <input
            type="color"
            value={currentColor.startsWith("#") && currentColor.length === 7 ? currentColor : "#531B23"}
            onChange={(e) => {
              onColorChange(e.target.value);
              setHexInput(e.target.value);
              setError(false);
            }}
            className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-white shadow-md p-0.5 bg-transparent"
            title="انقر لفتح عجلة الألوان التفاعلية"
          />
        </div>

        {/* Text Input for HEX */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            كود اللون السداسي عشري (HEX):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="#531B23"
              className={`w-full px-3 py-2 rounded-xl border text-sm font-mono dir-ltr uppercase font-bold focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:ring-red-200 text-red-600 bg-red-50/50"
                  : "border-slate-300 focus:ring-brand-800/20 text-slate-800 bg-white"
              }`}
            />
            <button
              type="button"
              onClick={handleCopy}
              title="نسخ كود اللون"
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-all shrink-0"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 font-semibold">
          صيغة اللون غير صالحة. يرجى إدخال رمز HEX صحيح مثل #531B23 أو #FFF
        </p>
      )}

      {/* Quick Swatch Bar */}
      <div className="space-y-1.5">
        <span className="block text-[11px] font-bold text-slate-500">
          ألوان سريعة شائعة:
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_COLORS.map((col) => (
            <button
              type="button"
              key={col}
              onClick={() => {
                onColorChange(col);
                setHexInput(col);
                setError(false);
              }}
              title={col}
              className={`w-7 h-7 rounded-xl border border-black/10 shadow-xs transition-transform hover:scale-110 active:scale-95 ${
                currentColor.toLowerCase() === col.toLowerCase()
                  ? "ring-2 ring-brand-800 ring-offset-2 scale-105"
                  : ""
              }`}
              style={{ backgroundColor: col }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

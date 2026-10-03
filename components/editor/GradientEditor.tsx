"use client";

import React from "react";
import { GradientConfig, GradientStop, LogoSelectionTarget } from "@/types/logo";
import { HEX_COLOR_REGEX, normalizeHexColor } from "@/lib/validation/proposal-schema";
import {
  Blend,
  Plus,
  Trash2,
  Compass,
  ArrowRight,
  ArrowDownRight,
  ArrowDown,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpLeft,
  ArrowUp,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface GradientEditorProps {
  selectedTarget: LogoSelectionTarget;
  gradientConfig: GradientConfig;
  onChange: (grad: GradientConfig) => void;
  onDisableGradient?: () => void;
}

// 8 CSS Direction Presets (CSS angle degrees: 0° = to top, 90° = to right, 180° = to bottom, 270° = to left)
const DIRECTION_PRESETS = [
  { angle: 90, label: "من اليسار لليمين", icon: ArrowRight },
  { angle: 135, label: "مائل لأسفل اليمين", icon: ArrowDownRight },
  { angle: 180, label: "من الأعلى للأسفل", icon: ArrowDown },
  { angle: 225, label: "مائل لأسفل اليسار", icon: ArrowDownLeft },
  { angle: 270, label: "من اليمين لليسار", icon: ArrowLeft },
  { angle: 315, label: "مائل لأعلى اليسار", icon: ArrowUpLeft },
  { angle: 0, label: "من الأسفل للأعلى", icon: ArrowUp },
  { angle: 45, label: "مائل لأعلى اليمين", icon: ArrowUpRight },
];

// Curated multi-stop gradient presets
const PRESET_GRADIENTS: { name: string; stops: GradientStop[]; angle: number }[] = [
  {
    name: "الملكي الذهبي",
    angle: 135,
    stops: [
      { color: "#531B23", offset: 0 },
      { color: "#8E2835", offset: 50 },
      { color: "#C9A227", offset: 100 },
    ],
  },
  {
    name: "الزمرد والذهب",
    angle: 90,
    stops: [
      { color: "#064E3B", offset: 0 },
      { color: "#047857", offset: 55 },
      { color: "#F59E0B", offset: 100 },
    ],
  },
  {
    name: "الأزرق السيبراني",
    angle: 135,
    stops: [
      { color: "#0F172A", offset: 0 },
      { color: "#1D4ED8", offset: 50 },
      { color: "#38BDF8", offset: 100 },
    ],
  },
  {
    name: "تدرج الغروب الثلاثي",
    angle: 45,
    stops: [
      { color: "#450A0A", offset: 0 },
      { color: "#B91C1C", offset: 48 },
      { color: "#F59E0B", offset: 100 },
    ],
  },
  {
    name: "الفضي المعدني",
    angle: 180,
    stops: [
      { color: "#1E293B", offset: 0 },
      { color: "#64748B", offset: 50 },
      { color: "#CBD5E1", offset: 100 },
    ],
  },
];

export function GradientEditor({
  selectedTarget,
  gradientConfig,
  onChange,
  onDisableGradient,
}: GradientEditorProps) {
  const isAll = selectedTarget === "all";

  // Construct CSS linear-gradient string for live preview
  const sortedStops = [...gradientConfig.stops].sort((a, b) => a.offset - b.offset);
  const cssStopsString = sortedStops.map((s) => `${s.color} ${s.offset}%`).join(", ");
  const previewCss =
    gradientConfig.type === "radial"
      ? `radial-gradient(circle at center, ${cssStopsString})`
      : `linear-gradient(${gradientConfig.angle}deg, ${cssStopsString})`;

  // Update a single stop
  const handleUpdateStop = (index: number, partial: Partial<GradientStop>) => {
    const updated = [...gradientConfig.stops];
    updated[index] = { ...updated[index], ...partial };
    onChange({
      ...gradientConfig,
      enabled: true,
      stops: updated,
    });
  };

  // Add a new stop
  const handleAddStop = () => {
    if (gradientConfig.stops.length >= 8) return;
    const count = gradientConfig.stops.length;
    // Calculate intelligent default offset
    const lastStop = gradientConfig.stops[count - 1];
    const prevStop = gradientConfig.stops[count - 2] || { offset: 0, color: "#531B23" };
    const newOffset = Math.min(100, Math.round((lastStop.offset + prevStop.offset) / 2));
    const newColor = "#C9A227";

    const newStops = [...gradientConfig.stops, { color: newColor, offset: newOffset }];
    onChange({
      ...gradientConfig,
      enabled: true,
      stops: newStops,
    });
  };

  // Remove a stop
  const handleRemoveStop = (index: number) => {
    if (gradientConfig.stops.length <= 2) return;
    const newStops = gradientConfig.stops.filter((_, i) => i !== index);
    onChange({
      ...gradientConfig,
      enabled: true,
      stops: newStops,
    });
  };

  // Apply a preset
  const handleApplyPreset = (preset: (typeof PRESET_GRADIENTS)[0]) => {
    onChange({
      enabled: true,
      type: "linear",
      angle: preset.angle,
      stops: preset.stops.map((s) => ({ ...s })),
    });
  };

  return (
    <div className="w-full space-y-4 text-right">
      {/* Target Notification Banner */}
      {isAll && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
          <span>التدرج الحالي سيُطبق بشكل موحد ومتناسق على كامل أجزاء الشعار.</span>
        </div>
      )}

      {/* Live Gradient Preview Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Blend className="h-3.5 w-3.5 text-brand-800" />
            <span>معاينة التدرج اللوني المباشر:</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {gradientConfig.type === "linear" ? `${gradientConfig.angle}° خطي` : "دائري"}
          </span>
        </div>

        <div className="relative w-full h-10 rounded-2xl border border-black/15 shadow-inner overflow-hidden p-0.5 checkerboard-bg">
          <div
            className="w-full h-full rounded-xl transition-all duration-300"
            style={{ background: previewCss }}
          />
        </div>
      </div>

      {/* Preset Gradient Buttons */}
      <div className="space-y-1.5">
        <span className="block text-[11px] font-bold text-slate-500">
          تدرجات جاهزة مقترحة:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {PRESET_GRADIENTS.map((p) => {
            const preview = `linear-gradient(${p.angle}deg, ${p.stops.map((s) => `${s.color} ${s.offset}%`).join(", ")})`;
            return (
              <button
                type="button"
                key={p.name}
                onClick={() => handleApplyPreset(p)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-brand-800 bg-white hover:bg-brand-50/40 text-[11px] font-bold text-slate-700 transition-all text-right group"
              >
                <span
                  className="w-5 h-5 rounded-lg border border-black/10 shrink-0 shadow-sm"
                  style={{ background: preview }}
                />
                <span className="truncate group-hover:text-brand-900">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Switcher: Linear vs Radial */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        <span className="font-bold text-slate-700">شكل التدرج:</span>
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onChange({ ...gradientConfig, enabled: true, type: "linear" })}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              gradientConfig.type === "linear"
                ? "bg-white text-brand-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            خطي (Linear)
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...gradientConfig, enabled: true, type: "radial" })}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              gradientConfig.type === "radial"
                ? "bg-white text-brand-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            دائري (Radial)
          </button>
        </div>
      </div>

      {/* Direction & Angle Controls (Only for Linear) */}
      {gradientConfig.type === "linear" && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-brand-800" />
              <span>اتجاه التدرج (8 اتجاهات رئيسية):</span>
            </span>
            <span className="font-mono font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
              {gradientConfig.angle}°
            </span>
          </div>

          {/* 8 Direction Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {DIRECTION_PRESETS.map((dir) => {
              const Icon = dir.icon;
              const isActive = gradientConfig.angle === dir.angle;
              return (
                <button
                  type="button"
                  key={dir.angle}
                  onClick={() => onChange({ ...gradientConfig, enabled: true, angle: dir.angle })}
                  className={`flex items-center justify-between p-2 rounded-xl border text-[11px] font-bold transition-all ${
                    isActive
                      ? "border-brand-800 bg-brand-50 text-brand-950 ring-1 ring-brand-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  title={`${dir.label} (${dir.angle}°)`}
                >
                  <span className="truncate">{dir.label}</span>
                  <Icon
                    className={`h-3.5 w-3.5 shrink-0 ${
                      isActive ? "text-brand-800" : "text-slate-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Custom Angle Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>زاوية مخصصة دقيقة:</span>
              <span className="font-mono text-slate-700">{gradientConfig.angle}° (0° - 360°)</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={gradientConfig.angle}
              onChange={(e) =>
                onChange({ ...gradientConfig, enabled: true, angle: Number(e.target.value) })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-800"
            />
          </div>
        </div>
      )}

      {/* Multi-Color Stops Section */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            نقاط ألوان التدرج ({gradientConfig.stops.length} ألوان):
          </span>
          {gradientConfig.stops.length < 8 && (
            <button
              type="button"
              id="btn-add-gradient-stop"
              onClick={handleAddStop}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 text-xs font-bold transition-all active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>إضافة لون للتدرج</span>
            </button>
          )}
        </div>

        {/* Stops List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
          {gradientConfig.stops.map((stop, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/70"
              >
                {/* Index badge */}
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                {/* Color input */}
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => handleUpdateStop(index, { color: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 shrink-0"
                  title="تغيير اللون"
                />

                {/* Hex input */}
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (HEX_COLOR_REGEX.test(val)) {
                      handleUpdateStop(index, { color: normalizeHexColor(val) });
                    }
                  }}
                  className="w-20 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 uppercase text-center dir-ltr text-slate-800 bg-white"
                  placeholder="#HEX"
                />

                {/* Offset / Position slider */}
                <div className="flex-1 flex items-center gap-1.5 min-w-0">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={stop.offset}
                    onChange={(e) => handleUpdateStop(index, { offset: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-800"
                    title={`موضع اللون: ${stop.offset}%`}
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-600 w-9 text-left shrink-0">
                    {stop.offset}%
                  </span>
                </div>

                {/* Delete button (only when > 2 stops) */}
                {gradientConfig.stops.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(index)}
                    title="حذف هذا اللون من التدرج"
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Disable Gradient button */}
      {onDisableGradient && (
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onDisableGradient}
            className="text-xs text-slate-500 hover:text-red-700 underline font-semibold transition-colors"
          >
            إلغاء التدرج والعودة للون أحادي
          </button>
        </div>
      )}
    </div>
  );
}

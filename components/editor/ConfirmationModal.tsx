"use client";

import React from "react";
import { LogoDesignState } from "@/types/logo";
import { LOGO_PARTS_METADATA } from "@/lib/logo/logo-manifest";
import { LogoRenderer } from "@/components/logo/LogoRenderer";
import { Lock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  design: LogoDesignState;
  isSubmitting: boolean;
  error?: string | null;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  design,
  isSubmitting,
  error,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gold-400" />
            <h3 className="font-bold text-base">تأكيد اعتماد الاقتراح</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white/80 hover:text-white text-sm font-bold disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Logo preview */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
            <LogoRenderer
              design={design}
              size={180}
              checkerboard={true}
              interactive={false}
            />
          </div>

          {/* Color Breakdown Chips */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">الألوان المختارة في هذا الاقتراح:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {LOGO_PARTS_METADATA.map((part) => {
                const config = design.parts[part.id];
                const isGrad = config?.gradient?.enabled;
                return (
                  <div
                    key={part.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/70 border border-slate-200/60"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{
                        backgroundColor: config?.color || "#531B23",
                        backgroundImage: isGrad
                          ? `linear-gradient(45deg, ${config.gradient?.stops[0].color}, ${config.gradient?.stops[1].color})`
                          : undefined,
                      }}
                    />
                    <div className="truncate">
                      <span className="font-semibold block truncate">{part.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 dir-ltr block">
                        {isGrad ? "تدرج لوني" : config?.color}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Warning Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold block mb-0.5">تنبيه هام حول ثبات الاقتراح:</span>
              بعد اعتماد الاقتراح، يصبح الاقتراح ثابتاً ومقفلاً نهائياً للمشاركة في التصويت العام.
              <strong> لن تتمكن من تعديل ألوانه بعد الاعتماد.</strong>
            </div>
          </div>

          {/* Error Message if any */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200/70 text-xs font-bold transition-all disabled:opacity-50"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للتعديل</span>
          </button>

          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-800 to-brand-900 hover:from-brand-900 hover:to-brand-950 text-white text-xs font-bold shadow-md shadow-brand-900/20 transition-all active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري حفظ واعتماد الاقتراح...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-gold-400" />
                <span>تأكيد واعتماد الاقتراح</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

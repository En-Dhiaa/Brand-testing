"use client";

import React, { useState } from "react";
import { LogoDesignState } from "@/types/logo";
import { exportLogoImage } from "@/lib/export/export-image";
import { Download, FileImage, CheckCircle, Info } from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: LogoDesignState;
  publicId?: string;
}

export function DownloadModal({ isOpen, onClose, design, publicId }: DownloadModalProps) {
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    setSuccess(false);
    try {
      const filename = publicId ? `seu-logo-${publicId}` : "seu-custom-logo";
      await exportLogoImage(design, {
        format,
        scale: 2, // High resolution ~ 2050px
        filename,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Export error:", err);
      alert("حدث خطأ أثناء تحميل الشعار");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-brand-800 font-bold text-sm">
            <Download className="h-5 w-5 text-gold-500" />
            <span>تحميل نسخة عالية الدقة</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
            ✕
          </button>
        </div>

        {/* Format Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">اختر صيغة الملف:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFormat("png")}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                format === "png"
                  ? "border-brand-800 bg-brand-50 text-brand-900 ring-1 ring-brand-800 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
              }`}
            >
              <FileImage className="h-5 w-5 text-brand-800" />
              <span className="text-xs">صيغة PNG</span>
              <span className="text-[10px] text-slate-500">يدعم الشفافية</span>
            </button>

            <button
              onClick={() => setFormat("jpg")}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                format === "jpg"
                  ? "border-brand-800 bg-brand-50 text-brand-900 ring-1 ring-brand-800 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
              }`}
            >
              <FileImage className="h-5 w-5 text-brand-800" />
              <span className="text-xs">صيغة JPG</span>
              <span className="text-[10px] text-slate-500">بخلفية مدمجة</span>
            </button>
          </div>
        </div>

        {/* Notice for JPG */}
        {format === "jpg" && design.background.type === "transparent" && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2 text-xs">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <span>صيغة JPG لا تدعم الشفافية، سيتم حفظ الشعار على خلفية بيضاء نقية.</span>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-800 to-brand-900 hover:from-brand-900 hover:to-brand-950 text-white font-bold text-xs shadow-md shadow-brand-900/15 transition-all active:scale-95 disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري معالجة وتحميل الشعار...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-4 w-4 text-gold-400" />
                <span>تم التحميل بنجاح!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-gold-400" />
                <span>تنزيل الشعار ({format.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

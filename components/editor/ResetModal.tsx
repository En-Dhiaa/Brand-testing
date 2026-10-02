"use client";

import React from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetModal({ isOpen, onClose, onConfirm }: ResetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-bold text-base text-slate-900 mb-1">
            إعادة ضبط الألوان الأصلية؟
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            سيؤدي هذا الإجراء إلى إعادة تعيين جميع أجزاء الشعار والخلفية إلى الألوان الرسمية الافتراضية.
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all"
          >
            إعادة الضبط
          </button>
        </div>
      </div>
    </div>
  );
}

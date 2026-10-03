import React from "react";
import Link from "next/link";
import { ShieldCheck, Palette, Award } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-10 mt-auto text-slate-600 mb-16 md:mb-0">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-between">
          {/* Identity Info */}
          <div className="flex flex-col gap-2 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-2 text-brand-800 font-bold text-lg">
              <Award className="h-5 w-5 text-gold-500" />
              <span>الجامعة اليمنية الإلكترونية</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto md:mx-0">
              منصة المشاركة المجتمعية التفاعلية لاختيار وتخصيص ألوان الهوية البصرية الرسمية للجامعة.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-brand-800 transition-colors">
              الرئيسية
            </Link>
            <Link href="/customize" className="hover:text-brand-800 transition-colors">
              تخصيص الشعار
            </Link>
            <Link href="/proposals" className="hover:text-brand-800 transition-colors">
              معرض الاقتراحات
            </Link>
            <Link href="/results" className="hover:text-brand-800 transition-colors">
              إحصائيات الألوان
            </Link>
          </div>

          {/* Admin and Legal */}
          <div className="flex flex-col items-center md:items-end gap-2 text-xs text-slate-400">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-800 transition-colors font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>دخول الإدارة</span>
            </Link>
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} الجامعة اليمنية الإلكترونية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

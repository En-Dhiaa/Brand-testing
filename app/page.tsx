"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_DESIGN_STATE } from "@/lib/logo/logo-manifest";
import { LogoRenderer } from "@/components/logo/LogoRenderer";
import {
  Palette,
  LayoutGrid,
  CheckCircle2,
  Sparkles,
  Vote,
  Heart,
  Share2,
  ArrowLeft,
  Award,
} from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({
    proposals: 0,
    votes: 0,
    likes: 0,
  });

  useEffect(() => {
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => {
        if (data?.summary) {
          setStats({
            proposals: data.summary.totalProposals || 0,
            votes: data.summary.totalVotes || 0,
            likes: data.summary.totalLikes || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-slate-50/30 pt-10 pb-16 sm:py-20 border-b border-slate-200/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Copy (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-right">
              {/* Institution badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200/80 shadow-sm text-brand-900 text-xs font-bold mb-6">
                <Award className="h-4 w-4 text-gold-500" />
                <span>الجامعة اليمنية الإلكترونية • الهوية البصرية الرسمية</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight mb-5">
                ساعدنا في اختيار <br />
                <span className="bg-gradient-to-r from-brand-800 via-brand-700 to-gold-600 bg-clip-text text-transparent">
                  ألوان هوية الجامعة
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
                خصص ألوان الشعار بالطريقة التي تراها مناسبة عبر استوديو تفاعلي ذكي، أنشئ اقتراحك الخاص، وشارك في صياغة الهوية البصرية الرسمية.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/customize"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-brand-800 to-brand-900 hover:from-brand-900 hover:to-brand-950 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-brand-900/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Palette className="h-5 w-5 text-gold-400" />
                  <span>ابدأ تخصيص الشعار الآن</span>
                </Link>

                <Link
                  href="/proposals"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-4 rounded-2xl text-sm border border-slate-200 shadow-sm transition-all hover:border-slate-300"
                >
                  <LayoutGrid className="h-4 w-4 text-slate-400" />
                  <span>استكشف الاقتراحات</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 pt-6 border-t border-slate-200/80 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  بدون تسجيل مسبق
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  مشاركة فورية
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  تحميل مجاني عالي الدقة
                </span>
              </div>
            </div>

            {/* Hero Interactive Logo Showcase (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-white p-8 sm:p-12 shadow-2xl border border-slate-200/80 flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50/40 via-transparent to-gold-50/20 opacity-70" />
                <LogoRenderer
                  design={DEFAULT_DESIGN_STATE}
                  className="w-full h-full max-h-72 transition-transform duration-500 group-hover:scale-105"
                  interactive={false}
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-500 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="font-semibold">الشعار الرسمي الأصلي</span>
                  <Link
                    href="/customize"
                    className="font-bold text-brand-800 hover:underline flex items-center gap-1"
                  >
                    <span>جرّب تلوينه</span>
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Participation Counter */}
      <section className="py-8 bg-white border-b border-slate-200/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-x-reverse divide-slate-100">
            <div>
              <div className="text-2xl sm:text-4xl font-black text-brand-900 font-mono">
                {stats.proposals.toLocaleString("ar-SA")}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 mt-1">اقتراح مقدم</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-brand-800 font-mono">
                {stats.votes.toLocaleString("ar-SA")}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 mt-1">صوت مسجل</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-rose-600 font-mono">
                {stats.likes.toLocaleString("ar-SA")}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 mt-1">إعجاب</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-slate-50/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              كيف تشارك في اختيار ألوان الهوية؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              أربع خطوات بسيطة وسريعة للمساهمة في اختيار الشعار الأنسب للجامعة:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center font-black text-lg mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">خصص الألوان</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                حدد كل جزء من أجزاء الشعار واختر من بين مجموعات الألوان أو أدخل ألوانك المفضلة.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center font-black text-lg mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">عاين النتيجة</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                شاهد التغييرات مباشرة وبدقة متناهية على الشعار بأحجام وخلفيات مختلفة.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">اعتمد اقتراحك</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                احفظ تصميمك برقم مرجعي فريد ليصبح ثابتاً ومتاحاً للتصويت العام.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center font-black text-lg mb-4">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">صوّت وشارك</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                شارك رابط تصميمك مع زملائك، وصوّت للاقتراحات التي تعجبك في المعرض.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-brand-900 to-brand-950 text-white relative overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-10">
          <Sparkles className="h-10 w-10 text-gold-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            صوتك وتصميمك يصنعان فارقاً
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            جميع المقترحات والتصويتات تساهم في اختيار الألوان الأكثر تعبيراً عن روح الجامعة اليمنية الإلكترونية ومستقبلها الرقمي.
          </p>
          <Link
            href="/customize"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-brand-950 font-bold px-8 py-4 rounded-2xl text-sm shadow-xl shadow-gold-500/10 transition-all hover:scale-105 active:scale-95"
          >
            <Palette className="h-4 w-4" />
            <span>ابدأ الآن - صمم اقتراحك</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

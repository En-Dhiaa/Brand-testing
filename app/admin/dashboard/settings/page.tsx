"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    participation_status: "open",
    voting_status: "open",
    comments_status: "open",
    site_title: "استوديو ألوان الشعار - الجامعة اليمنية الإلكترونية",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("تم حفظ الإعدادات بنجاح");
      } else {
        setMessage(data.error || "تعذر حفظ الإعدادات");
      }
    } catch {
      setMessage("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">إعدادات النظام والمشاركة</h1>
        <p className="text-xs text-slate-400 mt-1">
          التحكم في مراحل المشاركة، فتح أو إغلاق التصويت والتعليقات دون تعديل الشيفرة البرمجية.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-md">
        {/* Site Title */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2">
            عنوان المنصة والمبادرة:
          </label>
          <input
            type="text"
            value={settings.site_title}
            onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Participation Status */}
        <div className="pt-4 border-t border-slate-700/60">
          <label className="block text-xs font-bold text-slate-200 mb-1">
            استقبال الاقتراحات الجديدة:
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            عند إغلاق المشاركة، لن يتمكن الزوار من اعتماد اقتراحات جديدة ولكن يمكنهم تصفح المعرض والنتائج.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, participation_status: "open" })}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                settings.participation_status === "open"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-700 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              مفتوح (استقبال الاقتراحات مفعّل)
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, participation_status: "closed" })}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                settings.participation_status === "closed"
                  ? "bg-red-950 text-red-300 border-red-700 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              مغلق (إيقاف اعتماد اقتراحات جديدة)
            </button>
          </div>
        </div>

        {/* Voting Status */}
        <div className="pt-4 border-t border-slate-700/60">
          <label className="block text-xs font-bold text-slate-200 mb-1">
            التصويت على الاقتراحات:
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            التحكم في مرحلة التصويت، يمكن إغلاقه عند انتهاء الفترة المحددة لحسم النتائج.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, voting_status: "open" })}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                settings.voting_status === "open"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-700 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              التصويت متاح ومفتوح للجميع
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, voting_status: "closed" })}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                settings.voting_status === "closed"
                  ? "bg-red-950 text-red-300 border-red-700 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              إغلاق التصويت
            </button>
          </div>
        </div>

        {/* Comments Status */}
        <div className="pt-4 border-t border-slate-700/60">
          <label className="block text-xs font-bold text-slate-200 mb-1">
            التعليقات والملاحظات:
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            التحكم في إمكانية ترك تعليقات جديدة على الاقتراحات المعتمدة.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, comments_status: "open" })}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                settings.comments_status === "open"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-700 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              التعليقات مفعلة
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, comments_status: "closed" })}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                settings.comments_status === "closed"
                  ? "bg-red-950 text-red-300 border-red-700 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              إيقاف التعليقات الجديدة
            </button>
          </div>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-gold-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-700/60 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4 text-gold-400" />
            <span>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

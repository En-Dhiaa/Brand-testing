"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-900 border border-brand-700/50 flex items-center justify-center mx-auto mb-4 text-gold-400 shadow-lg shadow-brand-950/50">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-black text-white">تسجيل دخول الإدارة</h1>
          <p className="text-xs text-slate-400 mt-1">
            لوحة إدارة ومتابعة استوديو ألوان الجامعة اليمنية الإلكترونية
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              البريد الإلكتروني:
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dhiaa.org@gmail.com"
                required
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dir-ltr"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              كلمة المرور:
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dir-ltr"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-950/50 transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? "جاري تسجيل الدخول..." : "دخول لوحة التحكم"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>العودة إلى الموقع الرئيسي</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck2,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { href: "/admin/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
    { href: "/admin/dashboard/proposals", label: "إدارة الاقتراحات", icon: FileCheck2 },
    { href: "/admin/dashboard/comments", label: "إدارة التعليقات", icon: MessageSquare },
    { href: "/admin/dashboard/settings", label: "الإعدادات العامة", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-64 bg-slate-850 border-b md:border-b-0 md:border-l border-slate-800 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo badge */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-900 border border-brand-700/60 flex items-center justify-center text-gold-400 shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm block text-white leading-tight">
                لوحة الإدارة
              </span>
              <span className="text-[11px] text-slate-400">الهوية البصرية • SEU</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-brand-900 text-white border border-brand-700/60 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-gold-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-800 mt-6 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>معاينة الموقع العام</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all text-right"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

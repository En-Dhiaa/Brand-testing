"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Sparkles, LayoutGrid, BarChart3, Home } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/customize", label: "تخصيص الشعار", icon: Palette },
    { href: "/proposals", label: "معرض الاقتراحات", icon: LayoutGrid },
    { href: "/results", label: "النتائج والإحصائيات", icon: BarChart3 },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform hover:scale-[1.01]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-brand-900 shadow-md shadow-brand-900/10 text-gold-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-base leading-tight group-hover:text-brand-800 transition-colors">
              استوديو ألوان الهوية
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              الجامعة اليمنية الإلكترونية
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  active
                    ? "bg-brand-50 text-brand-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-brand-800" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-2">
          <Link
            href="/customize"
            className="flex items-center gap-2 bg-gradient-to-r from-brand-800 to-brand-900 hover:from-brand-900 hover:to-brand-950 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-brand-900/15 transition-all hover:shadow-lg active:scale-95"
          >
            <Palette className="h-4 w-4 text-gold-400" />
            <span className="hidden sm:inline">صمم اقتراحك</span>
            <span className="sm:hidden">تخصيص</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

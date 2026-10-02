"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Palette, LayoutGrid, BarChart3 } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();

  // Hide bottom navigation in full-page admin screens to give max room
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const items = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/customize", label: "تخصيص", icon: Palette },
    { href: "/proposals", label: "الاقتراحات", icon: LayoutGrid },
    { href: "/results", label: "النتائج", icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg shadow-lg safe-bottom">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                active ? "text-brand-800 scale-105" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div
                className={`relative flex items-center justify-center p-1 rounded-xl transition-all ${
                  active ? "bg-brand-50" : ""
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-brand-800 stroke-[2.5]" : ""}`} />
                {active && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-brand-800" />
                )}
              </div>
              <span className={`text-[11px] mt-0.5 ${active ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

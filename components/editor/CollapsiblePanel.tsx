"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface CollapsiblePanelProps {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CollapsiblePanel({
  id,
  title,
  subtitle,
  icon,
  badge,
  isOpen,
  onToggle,
  children,
  className = "",
}: CollapsiblePanelProps) {
  return (
    <div
      id={`panel-${id}`}
      className={`w-full bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden shadow-sm ${
        isOpen
          ? "border-slate-300/90 ring-1 ring-slate-200/60"
          : "border-slate-200/80 hover:border-slate-300"
      } ${className}`}
    >
      {/* Header Button */}
      <button
        type="button"
        id={`btn-toggle-${id}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-right select-none transition-colors hover:bg-slate-50/60"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isOpen
                ? "bg-brand-900 text-gold-400 shadow-xs"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {icon}
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                {title}
              </span>
              {badge}
            </div>
            {subtitle && (
              <span className="text-[11px] text-slate-400 truncate mt-0.5">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 mr-2">
          <div
            className={`p-1 rounded-full text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-brand-800 bg-brand-50" : ""
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-3.5 pb-4 sm:px-4 sm:pb-5 pt-1 border-t border-slate-100 animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

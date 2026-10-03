"use client";

import React, { useId } from "react";
import { LogoDesignState, LogoPartId, LogoSelectionTarget, GradientConfig } from "@/types/logo";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo/logo-manifest";

interface LogoRendererProps {
  design: LogoDesignState;
  className?: string;
  size?: number | string;
  showBackground?: boolean;
  checkerboard?: boolean;
  highlightPart?: LogoSelectionTarget | null;
  onPartClick?: (partId: LogoPartId) => void;
  interactive?: boolean;
  svgRef?: React.RefObject<SVGSVGElement>;
  innerClassName?: string;
}

export function LogoRenderer({
  design,
  className = "",
  size,
  showBackground = true,
  checkerboard = false,
  highlightPart = null,
  onPartClick,
  interactive = false,
  svgRef,
  innerClassName,
}: LogoRendererProps) {
  const reactId = useId().replace(/:/g, "_");

  // Helper to generate unique gradient ID
  const getGradientId = (partId: string) => `grad_${reactId}_${partId}`;

  // Helper to resolve fill value for a part
  const getPartFill = (partId: LogoPartId) => {
    const partConfig = design.parts[partId];
    if (!partConfig) return "#531B23";
    if (partConfig.gradient?.enabled && partConfig.gradient.stops.length >= 2) {
      return `url(#${getGradientId(partId)})`;
    }
    return partConfig.color || "#531B23";
  };

  // Helper to render gradient def
  const renderGradientDef = (gradient: GradientConfig | undefined, partId: string) => {
    if (!gradient?.enabled || gradient.stops.length < 2) return null;
    const id = getGradientId(partId);

    if (gradient.type === "radial") {
      return (
        <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          {gradient.stops.map((stop, i) => (
            <stop key={i} offset={`${stop.offset}%`} stopColor={stop.color} />
          ))}
        </radialGradient>
      );
    }

    // Linear gradient
    const angleRad = ((gradient.angle - 90) * Math.PI) / 180;
    const x1 = Math.round(50 - Math.cos(angleRad) * 50);
    const y1 = Math.round(50 - Math.sin(angleRad) * 50);
    const x2 = Math.round(50 + Math.cos(angleRad) * 50);
    const y2 = Math.round(50 + Math.sin(angleRad) * 50);

    return (
      <linearGradient id={id} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}>
        {gradient.stops.map((stop, i) => (
          <stop key={i} offset={`${stop.offset}%`} stopColor={stop.color} />
        ))}
      </linearGradient>
    );
  };

  // Background style
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!showBackground) return {};
    const bg = design.background;
    if (bg.type === "solid" && bg.color) {
      return { backgroundColor: bg.color };
    }
    if (bg.type === "gradient" && bg.gradient?.enabled && bg.gradient.stops.length >= 2) {
      const stopsStr = bg.gradient.stops
        .map((s) => `${s.color} ${s.offset}%`)
        .join(", ");
      if (bg.gradient.type === "radial") {
        return { background: `radial-gradient(circle, ${stopsStr})` };
      }
      return { background: `linear-gradient(${bg.gradient.angle}deg, ${stopsStr})` };
    }
    return {};
  };

  const handlePartClick = (partId: LogoPartId, e: React.MouseEvent) => {
    if (interactive && onPartClick) {
      e.stopPropagation();
      onPartClick(partId);
    }
  };

  const isHighlighted = (partId: LogoPartId) => highlightPart === "all" || highlightPart === partId;
  const getStrokeWidth = (partId: LogoPartId) => {
    if (!isHighlighted(partId)) return 0;
    return highlightPart === "all" ? 1.5 : 3;
  };

  return (
    <div
      className={`relative flex items-center justify-center transition-colors duration-200 select-none overflow-hidden ${
        checkerboard && design.background.type === "transparent" ? "checkerboard-bg" : ""
      } ${className}`}
      style={{
        width: size ? (typeof size === "number" ? `${size}px` : size) : "100%",
        height: size ? (typeof size === "number" ? `${size}px` : size) : "100%",
        ...getBackgroundStyle(),
      }}
    >
      <div
        className={
          innerClassName ||
          "w-full h-full flex items-center justify-center p-3 sm:p-5 max-w-[76%] max-h-[76%]"
        }
      >
        <svg
          ref={svgRef}
          viewBox={LOGO_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full max-h-full max-w-full drop-shadow-sm transition-all select-none"
          style={{ overflow: "visible" }}
        >
        <defs>
          {/* Gradients for each part */}
          {renderGradientDef(design.parts.symbol_y?.gradient, "symbol_y")}
          {renderGradientDef(design.parts.symbol_e?.gradient, "symbol_e")}
          {renderGradientDef(design.parts.symbol_u?.gradient, "symbol_u")}
          {renderGradientDef(design.parts.symbol_squares?.gradient, "symbol_squares")}
          {renderGradientDef(design.parts.text_arabic?.gradient, "text_arabic")}
          {renderGradientDef(design.parts.text_english?.gradient, "text_english")}

          {/* Active highlight glow filter */}
          <filter id={`highlight_${reactId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#C9A227" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* 1. Symbol Y (Center Crest) */}
        <g
          id="part-symbol-y"
          onClick={(e) => handlePartClick("symbol_y", e)}
          className={`transition-all duration-200 ${
            interactive ? "cursor-pointer hover:opacity-85" : ""
          }`}
          filter={isHighlighted("symbol_y") ? `url(#highlight_${reactId})` : undefined}
        >
          {LOGO_PATHS.symbol_y.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={getPartFill("symbol_y")}
              stroke={isHighlighted("symbol_y") ? "#C9A227" : "none"}
              strokeWidth={getStrokeWidth("symbol_y")}
            />
          ))}
        </g>

        {/* 2. Symbol E (Left Wing) */}
        <g
          id="part-symbol-e"
          onClick={(e) => handlePartClick("symbol_e", e)}
          className={`transition-all duration-200 ${
            interactive ? "cursor-pointer hover:opacity-85" : ""
          }`}
          filter={isHighlighted("symbol_e") ? `url(#highlight_${reactId})` : undefined}
        >
          {LOGO_PATHS.symbol_e.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={getPartFill("symbol_e")}
              stroke={isHighlighted("symbol_e") ? "#C9A227" : "none"}
              strokeWidth={getStrokeWidth("symbol_e")}
            />
          ))}
        </g>

        {/* 3. Symbol U (Right Wing) */}
        <g
          id="part-symbol-u"
          onClick={(e) => handlePartClick("symbol_u", e)}
          className={`transition-all duration-200 ${
            interactive ? "cursor-pointer hover:opacity-85" : ""
          }`}
          filter={isHighlighted("symbol_u") ? `url(#highlight_${reactId})` : undefined}
        >
          {LOGO_PATHS.symbol_u.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={getPartFill("symbol_u")}
              stroke={isHighlighted("symbol_u") ? "#C9A227" : "none"}
              strokeWidth={getStrokeWidth("symbol_u")}
            />
          ))}
        </g>

        {/* 4. Symbol Squares (Three Crown Diamonds) */}
        <g
          id="part-symbol-squares"
          onClick={(e) => handlePartClick("symbol_squares", e)}
          className={`transition-all duration-200 ${
            interactive ? "cursor-pointer hover:opacity-85" : ""
          }`}
          filter={isHighlighted("symbol_squares") ? `url(#highlight_${reactId})` : undefined}
        >
          {LOGO_PATHS.symbol_squares.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={getPartFill("symbol_squares")}
              stroke={isHighlighted("symbol_squares") ? "#C9A227" : "none"}
              strokeWidth={getStrokeWidth("symbol_squares")}
            />
          ))}
        </g>

        {/* 5. Arabic Text Calligraphy */}
        <g
          id="part-text-arabic"
          onClick={(e) => handlePartClick("text_arabic", e)}
          className={`transition-all duration-200 ${
            interactive ? "cursor-pointer hover:opacity-85" : ""
          }`}
          filter={isHighlighted("text_arabic") ? `url(#highlight_${reactId})` : undefined}
        >
          {LOGO_PATHS.text_arabic_paths.map((d, i) => (
            <path key={`ar-p-${i}`} d={d} fill={getPartFill("text_arabic")} />
          ))}
          {LOGO_PATHS.text_arabic_polygons.map((points, i) => (
            <polygon key={`ar-poly-${i}`} points={points} fill={getPartFill("text_arabic")} />
          ))}
        </g>

        {/* 6. English Text */}
        <g
          id="part-text-english"
          onClick={(e) => handlePartClick("text_english", e)}
          className={`transition-all duration-200 ${
            interactive ? "cursor-pointer hover:opacity-85" : ""
          }`}
          filter={isHighlighted("text_english") ? `url(#highlight_${reactId})` : undefined}
        >
          {LOGO_PATHS.text_english_paths.map((d, i) => (
            <path key={`en-p-${i}`} d={d} fill={getPartFill("text_english")} />
          ))}
        </g>
      </svg>
    </div>
  </div>
);
}

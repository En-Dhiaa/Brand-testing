import { LogoDesignState } from "@/types/logo";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo/logo-manifest";

export interface ExportOptions {
  format: "png" | "jpg";
  scale?: number; // default 2 (yields approx 2054 x 1652 px)
  filename?: string;
  onProgress?: (progress: number) => void;
}

export function generateSvgString(design: LogoDesignState, includeBackground = true): string {
  // Extract viewBox width and height
  const [, , vbWidth, vbHeight] = LOGO_VIEWBOX.split(" ").map(Number);

  const getPartFill = (partId: keyof LogoDesignState["parts"]) => {
    const partConfig = design.parts[partId];
    if (partConfig.gradient?.enabled && partConfig.gradient.stops.length >= 2) {
      return `url(#export_grad_${partId})`;
    }
    return partConfig.color || "#531B23";
  };

  const renderGradientDef = (partId: keyof LogoDesignState["parts"]) => {
    const gradient = design.parts[partId]?.gradient;
    if (!gradient?.enabled || gradient.stops.length < 2) return "";
    const id = `export_grad_${partId}`;

    if (gradient.type === "radial") {
      const stops = gradient.stops
        .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
        .join("");
      return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`;
    }

    const angleRad = ((gradient.angle - 90) * Math.PI) / 180;
    const x1 = Math.round(50 - Math.cos(angleRad) * 50);
    const y1 = Math.round(50 - Math.sin(angleRad) * 50);
    const x2 = Math.round(50 + Math.cos(angleRad) * 50);
    const y2 = Math.round(50 + Math.sin(angleRad) * 50);
    const stops = gradient.stops
      .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
      .join("");
    return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stops}</linearGradient>`;
  };

  let bgDef = "";
  let bgRect = "";
  if (includeBackground && design.background.type !== "transparent") {
    if (design.background.type === "solid" && design.background.color) {
      bgRect = `<rect width="${vbWidth}" height="${vbHeight}" fill="${design.background.color}" />`;
    } else if (
      design.background.type === "gradient" &&
      design.background.gradient?.enabled &&
      design.background.gradient.stops.length >= 2
    ) {
      const g = design.background.gradient;
      if (g.type === "radial") {
        const stops = g.stops
          .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
          .join("");
        bgDef = `<radialGradient id="export_bg_grad" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`;
      } else {
        const angleRad = ((g.angle - 90) * Math.PI) / 180;
        const x1 = Math.round(50 - Math.cos(angleRad) * 50);
        const y1 = Math.round(50 - Math.sin(angleRad) * 50);
        const x2 = Math.round(50 + Math.cos(angleRad) * 50);
        const y2 = Math.round(50 + Math.sin(angleRad) * 50);
        const stops = g.stops
          .map((s) => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
          .join("");
        bgDef = `<linearGradient id="export_bg_grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stops}</linearGradient>`;
      }
      bgRect = `<rect width="${vbWidth}" height="${vbHeight}" fill="url(#export_bg_grad)" />`;
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}" width="${vbWidth}" height="${vbHeight}">
      <defs>
        ${bgDef}
        ${renderGradientDef("symbol_y")}
        ${renderGradientDef("symbol_e")}
        ${renderGradientDef("symbol_u")}
        ${renderGradientDef("symbol_squares")}
        ${renderGradientDef("text_arabic")}
        ${renderGradientDef("text_english")}
      </defs>
      ${bgRect}
      <g id="part-symbol-y">
        ${LOGO_PATHS.symbol_y.map((d: string) => `<path d="${d}" fill="${getPartFill("symbol_y")}" />`).join("")}
      </g>
      <g id="part-symbol-e">
        ${LOGO_PATHS.symbol_e.map((d: string) => `<path d="${d}" fill="${getPartFill("symbol_e")}" />`).join("")}
      </g>
      <g id="part-symbol-u">
        ${LOGO_PATHS.symbol_u.map((d: string) => `<path d="${d}" fill="${getPartFill("symbol_u")}" />`).join("")}
      </g>
      <g id="part-symbol-squares">
        ${LOGO_PATHS.symbol_squares.map((d: string) => `<path d="${d}" fill="${getPartFill("symbol_squares")}" />`).join("")}
      </g>
      <g id="part-text-arabic">
        ${LOGO_PATHS.text_arabic_paths.map((d: string) => `<path d="${d}" fill="${getPartFill("text_arabic")}" />`).join("")}
        ${LOGO_PATHS.text_arabic_polygons.map((p: string) => `<polygon points="${p}" fill="${getPartFill("text_arabic")}" />`).join("")}
      </g>
      <g id="part-text-english">
        ${LOGO_PATHS.text_english_paths.map((d: string) => `<path d="${d}" fill="${getPartFill("text_english")}" />`).join("")}
      </g>
    </svg>
  `.trim();
}

export async function exportLogoImage(
  design: LogoDesignState,
  options: ExportOptions
): Promise<string> {
  const { format, scale = 2, filename = "seu-logo" } = options;

  // For JPG, background cannot be transparent; default to white if transparent
  const includeBg = format === "jpg" ? true : design.background.type !== "transparent";
  const effectiveDesign: LogoDesignState =
    format === "jpg" && design.background.type === "transparent"
      ? { ...design, background: { type: "solid", color: "#FFFFFF" } }
      : design;

  const svgString = generateSvgString(effectiveDesign, includeBg);
  const [, , vbWidth, vbHeight] = LOGO_VIEWBOX.split(" ").map(Number);
  const targetWidth = Math.round(vbWidth * scale);
  const targetHeight = Math.round(vbHeight * scale);

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("تعذر إنشاء بيئة الرسم للتحميل"));
      return;
    }

    if (format === "jpg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);

      const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
      const quality = format === "jpg" ? 0.95 : undefined;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      // Trigger browser download
      const downloadLink = document.createElement("a");
      downloadLink.download = `${filename}.${format}`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("حدث خطأ أثناء معالجة صورة الشعار"));
    };

    img.src = url;
  });
}

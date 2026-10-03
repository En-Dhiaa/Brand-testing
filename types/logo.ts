export type LogoPartId =
  | "symbol_y"
  | "symbol_e"
  | "symbol_u"
  | "symbol_squares"
  | "text_arabic"
  | "text_english";

export type LogoSelectionTarget = "all" | LogoPartId;

export interface GradientStop {
  color: string;
  offset: number; // 0 to 100
}

export interface GradientConfig {
  enabled: boolean;
  type: "linear" | "radial";
  angle: number; // 0 to 360 degrees
  stops: GradientStop[];
}

export interface PartColorConfig {
  color: string;
  gradient?: GradientConfig;
}

export interface BackgroundConfig {
  type: "transparent" | "solid" | "gradient";
  color?: string;
  gradient?: GradientConfig;
}

export interface LogoDesignState {
  logoVersion: string;
  background: BackgroundConfig;
  parts: {
    symbol_y: PartColorConfig;
    symbol_e: PartColorConfig;
    symbol_u: PartColorConfig;
    symbol_squares: PartColorConfig;
    text_arabic: PartColorConfig;
    text_english: PartColorConfig;
  };
}

export interface LogoPartMetadata {
  id: LogoPartId;
  name: string;
  description: string;
  category: "symbol" | "text";
  defaultColor: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    symbol_y: string;
    symbol_e: string;
    symbol_u: string;
    symbol_squares: string;
    text_arabic: string;
    text_english: string;
  };
  background: BackgroundConfig;
}

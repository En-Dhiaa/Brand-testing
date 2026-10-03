"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LogoDesignState,
  LogoPartId,
  LogoSelectionTarget,
  GradientConfig,
  BackgroundConfig,
  ColorPalette,
} from "@/types/logo";
import { DEFAULT_DESIGN_STATE } from "@/lib/logo/logo-manifest";

const DRAFT_KEY = "logo-color-studio:draft";
const MAX_HISTORY = 30;

const ALL_LOGO_PARTS: LogoPartId[] = [
  "symbol_y",
  "symbol_e",
  "symbol_u",
  "symbol_squares",
  "text_arabic",
  "text_english",
];

export function useLogoEditor() {
  const [design, setDesign] = useState<LogoDesignState>(DEFAULT_DESIGN_STATE);
  const [selectedPart, setSelectedPart] = useState<LogoSelectionTarget>("all");
  const [history, setHistory] = useState<LogoDesignState[]>([DEFAULT_DESIGN_STATE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [zoom, setZoom] = useState(100); // 50 to 200%
  const [isInitialized, setIsInitialized] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as LogoDesignState;
        if (parsed?.parts && parsed?.background) {
          setDesign(parsed);
          setHistory([parsed]);
          setHistoryIndex(0);
        }
      }
    } catch (e) {
      console.error("Failed to load draft from localStorage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save draft to localStorage whenever design changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(design));
    } catch (e) {
      console.error("Failed to save draft:", e);
    }
  }, [design, isInitialized]);

  // Push new state to history
  const pushState = useCallback((newState: LogoDesignState) => {
    setDesign(newState);
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      if (updated.length >= MAX_HISTORY) {
        updated.shift();
      }
      return [...updated, newState];
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  const setPartColor = useCallback(
    (target: LogoSelectionTarget, color: string) => {
      if (target === "all") {
        const updatedParts = { ...design.parts };
        for (const p of ALL_LOGO_PARTS) {
          updatedParts[p] = {
            ...updatedParts[p],
            color,
            gradient: undefined,
          };
        }
        pushState({ ...design, parts: updatedParts });
        return;
      }

      const next: LogoDesignState = {
        ...design,
        parts: {
          ...design.parts,
          [target]: {
            ...design.parts[target],
            color,
            gradient: undefined, // remove gradient when solid color is chosen
          },
        },
      };
      pushState(next);
    },
    [design, pushState]
  );

  const setPartGradient = useCallback(
    (target: LogoSelectionTarget, gradient: GradientConfig) => {
      if (target === "all") {
        const updatedParts = { ...design.parts };
        for (const p of ALL_LOGO_PARTS) {
          updatedParts[p] = {
            ...updatedParts[p],
            gradient,
          };
        }
        pushState({ ...design, parts: updatedParts });
        return;
      }

      const next: LogoDesignState = {
        ...design,
        parts: {
          ...design.parts,
          [target]: {
            ...design.parts[target],
            gradient,
          },
        },
      };
      pushState(next);
    },
    [design, pushState]
  );

  const setBackground = useCallback(
    (bg: BackgroundConfig) => {
      const next: LogoDesignState = {
        ...design,
        background: bg,
      };
      pushState(next);
    },
    [design, pushState]
  );

  const applyPalette = useCallback(
    (palette: ColorPalette) => {
      const next: LogoDesignState = {
        logoVersion: design.logoVersion,
        background: palette.background,
        parts: {
          symbol_y: { color: palette.colors.symbol_y },
          symbol_e: { color: palette.colors.symbol_e },
          symbol_u: { color: palette.colors.symbol_u },
          symbol_squares: { color: palette.colors.symbol_squares },
          text_arabic: { color: palette.colors.text_arabic },
          text_english: { color: palette.colors.text_english },
        },
      };
      pushState(next);
    },
    [design.logoVersion, pushState]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      setHistoryIndex(targetIndex);
      setDesign(history[targetIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      setHistoryIndex(targetIndex);
      setDesign(history[targetIndex]);
    }
  }, [history, historyIndex]);

  const reset = useCallback(() => {
    pushState(DEFAULT_DESIGN_STATE);
    setSelectedPart("all");
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }, [pushState]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    design,
    selectedPart,
    setSelectedPart,
    setPartColor,
    setPartGradient,
    setBackground,
    applyPalette,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    zoom,
    setZoom,
    isInitialized,
  };
}

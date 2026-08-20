import { useCallback, useEffect, useState } from "react";
import { ACCENT_KEY, applyAccent, isValidHex } from "@/components/theme/accent";

/**
 * Reads/writes the accent colour preference (localStorage key "accent-color").
 * `null` means "site default" so the original palette stays untouched.
 */
export function useAccentColor() {
  const [accent, setAccentState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ACCENT_KEY);
      if (raw && isValidHex(raw)) setAccentState(raw);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setAccent = useCallback((hex: string | null) => {
    const next = hex && isValidHex(hex) ? hex.trim().toLowerCase() : null;
    setAccentState(next);
    applyAccent(next);
    try {
      if (next) window.localStorage.setItem(ACCENT_KEY, next);
      else window.localStorage.removeItem(ACCENT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { accent, setAccent, hydrated };
}

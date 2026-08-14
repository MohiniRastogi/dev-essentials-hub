import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";

export type LandingPage = "home" | "tools" | "favorites";
export type Density = "comfortable" | "compact";

export const LANDING_KEY = "devtk:landing";
export const DENSITY_KEY = "devtk:density";
export const FAVORITES_KEY = "devtk:favorites";
export const THEME_KEY = "theme-preference";

/** Landing page preference used to redirect "/" on first visit of a session. */
export function useLandingPage() {
  return useLocalStorage<LandingPage>(LANDING_KEY, "home");
}

/** Card density preference, mirrored to <html data-density>. */
export function useDensity() {
  const [density, setDensity, meta] = useLocalStorage<Density>(DENSITY_KEY, "comfortable");

  useEffect(() => {
    if (!meta.hydrated) return;
    const root = document.documentElement;
    if (density === "compact") root.setAttribute("data-density", "compact");
    else root.removeAttribute("data-density");
  }, [density, meta.hydrated]);

  return [density, setDensity, meta] as const;
}

export function useResetPreferences() {
  return useCallback((keys: string[]) => {
    try {
      keys.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  }, []);
}

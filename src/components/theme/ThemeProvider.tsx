import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";
export type ThemePreference = Theme | "system";

const STORAGE_KEY = "theme-preference";
const LEGACY_KEY = "dt-theme";

interface ThemeContextValue {
  /** Resolved theme actually applied to the document. */
  theme: Theme;
  /** User preference: light, dark or system. */
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  preference: "dark",
  setPreference: () => {},
  setTheme: () => {},
  toggleTheme: () => {},
});

/** Browser UI color per theme (matches --background in src/styles.css). */
const THEME_COLORS: Record<Theme, string> = {
  dark: "#0b1020",
  light: "#f2f5fd",
};

function applyThemeColorMeta(theme: Theme) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLORS[theme];
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset["theme"] = theme;
  applyThemeColorMeta(theme);
}

function systemTheme(): Theme {
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function readPreference(): ThemePreference {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_KEY);
    if (v === "dark" || v === "light" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("dark");
  const [theme, setThemeState] = useState<Theme>("dark");

  // Read the persisted preference after hydration to avoid SSR mismatches.
  useEffect(() => {
    const pref = readPreference();
    const resolved = pref === "system" ? systemTheme() : pref;
    setPreferenceState(pref);
    setThemeState(resolved);
    applyTheme(resolved);
  }, []);

  // Follow OS changes live while "system" is selected.
  useEffect(() => {
    if (preference !== "system") return;
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia("(prefers-color-scheme: light)");
    } catch {
      return;
    }
    const onChange = () => {
      const resolved = systemTheme();
      setThemeState(resolved);
      applyTheme(resolved);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    const resolved = next === "system" ? systemTheme() : next;
    setThemeState(resolved);
    applyTheme(resolved);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((next: Theme) => setPreference(next), [setPreference]);

  const toggleTheme = useCallback(() => {
    setPreference(theme === "dark" ? "light" : "dark");
  }, [theme, setPreference]);

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Inline script that applies the stored theme before first paint (no flash). */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||localStorage.getItem('${LEGACY_KEY}');if(t==='system'||!t&&false){}var d;if(t==='system'){d=!window.matchMedia('(prefers-color-scheme: light)').matches;}else{d=t!=='light';}var r=document.documentElement;r.classList.toggle('dark',d);r.setAttribute('data-theme',d?'dark':'light');var den=localStorage.getItem('devtk:density');if(den&&den.indexOf('compact')!==-1){r.setAttribute('data-density','compact');}var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');document.head.appendChild(m);}m.setAttribute('content',d?'#0b1020':'#f2f5fd');}catch(e){}})();`;

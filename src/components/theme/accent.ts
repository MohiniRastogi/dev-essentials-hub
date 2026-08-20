/**
 * Accent colour handling. Purely presentational: when no accent is stored the
 * app keeps its original palette (pixel identical to before).
 */
export const ACCENT_KEY = "accent-color";

export const ACCENT_PRESETS: { name: string; hex: string }[] = [
  { name: "Blue", hex: "#3b6ef6" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Orange", hex: "#f97316" },
  { name: "Red", hex: "#ef4444" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Yellow", hex: "#eab308" },
];

export function isValidHex(hex: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim());
}

function expand(hex: string) {
  const h = hex.trim().replace("#", "");
  return h.length === 3
    ? h
        .split("")
        .map((c) => c + c)
        .join("")
    : h;
}

/** Relative luminance → decides whether text on the accent should be dark or light. */
export function accentForeground(hex: string) {
  const h = expand(hex);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const l = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return l > 0.55 ? "#0b1020" : "#ffffff";
}

/** Apply (or clear) the accent colour on <html>. */
export function applyAccent(hex: string | null) {
  const root = document.documentElement;
  if (!hex || !isValidHex(hex)) {
    root.removeAttribute("data-accent");
    root.style.removeProperty("--accent-color");
    root.style.removeProperty("--accent-contrast");
    return;
  }
  root.setAttribute("data-accent", "custom");
  root.style.setProperty("--accent-color", hex);
  root.style.setProperty("--accent-contrast", accentForeground(hex));
}

/** Inline snippet used before first paint to avoid an accent flash. */
export const accentInitScript = `(function(){try{var a=localStorage.getItem('${ACCENT_KEY}');if(!a)return;a=a.replace(/"/g,'');if(!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(a))return;var h=a.replace('#','');if(h.length===3){h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];}function li(c){c=parseInt(c,16)/255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}var l=0.2126*li(h.slice(0,2))+0.7152*li(h.slice(2,4))+0.0722*li(h.slice(4,6));var r=document.documentElement;r.setAttribute('data-accent','custom');r.style.setProperty('--accent-color',a);r.style.setProperty('--accent-contrast',l>0.55?'#0b1020':'#ffffff');}catch(e){}})();`;

/**
 * Pure, framework-free logic shared by the converter / generator tools.
 * Kept separate so it can be unit tested without rendering components.
 */

// ---------- Color ----------

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb | null {
  let h = hex.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export function parseRgb(input: string): Rgb | null {
  const nums = input.match(/-?\d+(\.\d+)?/g);
  if (!nums || nums.length < 3) return null;
  const [r, g, b] = nums.slice(0, 3).map(Number);
  if ([r, g, b].some((v) => !Number.isFinite(v) || v < 0 || v > 255)) return null;
  return { r, g, b };
}

// ---------- Unix time ----------

export type TimeUnit = "auto" | "s" | "ms";

export interface ParsedTime {
  date: Date | null;
  error: string | null;
}

const MAX_MS = 8.64e15; // ECMAScript max time value

export function parseUnixTime(raw: string, unit: TimeUnit = "auto"): ParsedTime {
  const t = raw.trim();
  if (!t) return { date: null, error: null };
  if (!/^-?\d+$/.test(t)) return { date: null, error: "Only whole numbers are allowed — remove any letters or symbols." };
  const num = Number(t);
  if (!Number.isFinite(num) || !Number.isSafeInteger(num)) {
    return { date: null, error: "That number is too large to be a valid timestamp." };
  }
  const digits = t.replace("-", "").length;
  const ms = unit === "ms" ? num : unit === "s" ? num * 1000 : digits > 10 ? num : num * 1000;
  if (Math.abs(ms) > MAX_MS) return { date: null, error: "Timestamp is out of the supported date range." };
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return { date: null, error: "Timestamp is out of the supported date range." };
  return { date: d, error: null };
}

export function parseHumanDate(raw: string): ParsedTime {
  const t = raw.trim();
  if (!t) return { date: null, error: null };
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) {
    return { date: null, error: "Unrecognised date. Try a format like 2024-01-31 14:20:00." };
  }
  return { date: d, error: null };
}

// ---------- Regex ----------

export const VALID_REGEX_FLAGS = "gimsuyd";

export function sanitizeFlags(flags: string): string {
  const seen = new Set<string>();
  let out = "";
  for (const c of flags) {
    if (VALID_REGEX_FLAGS.includes(c) && !seen.has(c)) {
      seen.add(c);
      out += c;
    }
  }
  return out;
}

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexRunResult {
  error: string | null;
  matches: RegexMatch[];
}

export function runRegex(pattern: string, flags: string, text: string): RegexRunResult {
  if (!pattern) return { error: null, matches: [] };
  let re: RegExp;
  try {
    re = new RegExp(pattern, sanitizeFlags(flags));
  } catch (e) {
    return { error: (e as Error).message, matches: [] };
  }
  const matches: RegexMatch[] = [];
  if (re.global) {
    let guard = 0;
    for (const m of text.matchAll(re)) {
      matches.push({ match: m[0], index: m.index ?? 0, groups: m.slice(1).map((g) => g ?? "") });
      if (++guard > 10000) break;
    }
  } else {
    const m = re.exec(text);
    if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1).map((g) => g ?? "") });
  }
  return { error: null, matches };
}

// ---------- SVG ----------

export function optimizeSvg(src: string): string {
  if (!src.trim()) throw new Error("Paste or upload an SVG first.");
  if (!/<svg[\s>]/i.test(src)) throw new Error("That does not look like an SVG document — an <svg> tag is required.");
  if (!/<\/svg>/i.test(src)) throw new Error("The SVG looks truncated — no closing </svg> tag was found.");
  let out = src
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<desc[\s\S]*?<\/desc>/gi, "")
    .replace(/\s(xmlns:(?!xlink)[\w-]+|sodipodi:[\w-]+|inkscape:[\w-]+)="[^"]*"/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\/>/g, "/>")
    .trim();
  out = out.replace(/(\d+\.\d{3,})/g, (m) => String(+Number(m).toFixed(2)));
  return out;
}

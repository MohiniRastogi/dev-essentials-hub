import { useMemo, useState } from "react";
import { ToolPanel } from "@/components/common/ToolShell";
import { CodeOutput, Field, inputClass } from "./_shared/CodeOutput";

const PATTERNS = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
  "DD MMM YYYY",
  "MMMM D, YYYY",
  "YYYY-MM-DD HH:mm",
  "DD/MM/YYYY hh:mm A",
  "relative",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatPattern(date: Date, pattern: string) {
  const h24 = date.getHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const map: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MMMM: MONTHS[date.getMonth()],
    MMM: MONTHS[date.getMonth()].slice(0, 3),
    MM: pad(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    DDDD: DAYS[date.getDay()],
    DDD: DAYS[date.getDay()].slice(0, 3),
    DD: pad(date.getDate()),
    D: String(date.getDate()),
    HH: pad(h24),
    H: String(h24),
    hh: pad(h12),
    h: String(h12),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    A: h24 < 12 ? "AM" : "PM",
    a: h24 < 12 ? "am" : "pm",
  };
  return pattern.replace(/YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|HH|H|hh|h|mm|ss|A|a/g, (t) => map[t]);
}

function formatRelative(date: Date, now: Date) {
  const diff = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diff);
  const units: [number, string][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
    [Infinity, "year"],
  ];
  const divisors = [1, 60, 3600, 86400, 604800, 2629800, 31557600];
  for (let i = 0; i < units.length; i++) {
    if (abs < units[i][0]) {
      const value = Math.round(diff / divisors[i]);
      const unit = units[i][1];
      const n = Math.abs(value) || 1;
      const plural = n === 1 ? unit : `${unit}s`;
      if (unit === "second" && n < 5) return "just now";
      return diff < 0 ? `${n} ${plural} ago` : `in ${n} ${plural}`;
    }
  }
  return date.toISOString();
}

export function DateFormatterGenerator() {
  const [pattern, setPattern] = useState("DD/MM/YYYY");
  const [fnName, setFnName] = useState("formatDate");
  const [esm, setEsm] = useState(true);
  const [sample, setSample] = useState(() => new Date().toISOString().slice(0, 16));

  const safeName = /^[A-Za-z_$][\w$]*$/.test(fnName.trim()) ? fnName.trim() : "formatDate";
  const isRelative = pattern.trim() === "relative";

  const parsed = useMemo(() => {
    const d = new Date(sample);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [sample]);

  const preview = useMemo(() => {
    if (!parsed) return "Invalid date — pick a valid date and time.";
    return isRelative ? formatRelative(parsed, new Date()) : formatPattern(parsed, pattern || "YYYY-MM-DD");
  }, [parsed, pattern, isRelative]);

  const code = useMemo(() => {
    if (isRelative) {
      return `${esm ? "export " : ""}function ${safeName}(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  const diff = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diff);

  const steps = [
    { limit: 60, unit: "second", div: 1 },
    { limit: 3600, unit: "minute", div: 60 },
    { limit: 86400, unit: "hour", div: 3600 },
    { limit: 604800, unit: "day", div: 86400 },
    { limit: 2629800, unit: "week", div: 604800 },
    { limit: 31557600, unit: "month", div: 2629800 },
    { limit: Infinity, unit: "year", div: 31557600 }
  ];

  for (const step of steps) {
    if (abs < step.limit) {
      const value = Math.abs(Math.round(diff / step.div)) || 1;
      if (step.unit === "second" && value < 5) return "just now";
      const label = value === 1 ? step.unit : step.unit + "s";
      return diff < 0 ? value + " " + label + " ago" : "in " + value + " " + label;
    }
  }

  return date.toISOString();
}

// Example usage
console.log(${safeName}(Date.now() - 2 * 86400000)); // "2 days ago"
console.log(${safeName}("2030-01-01"));              // "in 3 years"`;
    }

    return `const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const pad = (n) => String(n).padStart(2, "0");

${esm ? "export " : ""}function ${safeName}(input, pattern = "${pattern}") {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  const h24 = date.getHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;

  const tokens = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MMMM: MONTHS[date.getMonth()],
    MMM: MONTHS[date.getMonth()].slice(0, 3),
    MM: pad(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    DDDD: DAYS[date.getDay()],
    DDD: DAYS[date.getDay()].slice(0, 3),
    DD: pad(date.getDate()),
    D: String(date.getDate()),
    HH: pad(h24),
    H: String(h24),
    hh: pad(h12),
    h: String(h12),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    A: h24 < 12 ? "AM" : "PM",
    a: h24 < 12 ? "am" : "pm"
  };

  return pattern.replace(/YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|HH|H|hh|h|mm|ss|A|a/g, (t) => tokens[t]);
}

// Example usage
console.log(${safeName}(new Date()));            // "${preview}"
console.log(${safeName}("2024-03-09", "MMM D, YYYY")); // "Mar 9, 2024"`;
  }, [safeName, pattern, esm, isRelative, preview]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Field label="Format pattern">
            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                {PATTERNS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPattern(p)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      pattern === p
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p === "relative" ? "relative (2 days ago)" : p}
                  </button>
                ))}
              </div>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className={inputClass}
                aria-label="Custom pattern"
              />
              <p className="text-xs text-muted-foreground">
                Tokens: YYYY YY MMMM MMM MM M DDDD DDD DD D HH hh mm ss A a — or type “relative”.
              </p>
            </div>
          </Field>
          <Field label="Function name">
            <input value={fnName} onChange={(e) => setFnName(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Sample date">
            <input
              type="datetime-local"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={esm} onChange={(e) => setEsm(e.target.checked)} />
            Add <code className="font-mono-editor">export</code> keyword
          </label>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid gap-3">
          <div className="rounded-xl border border-border bg-card/40 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Formatted output</p>
            <p className="font-mono-editor mt-2 break-words text-xl font-bold">{preview}</p>
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground">
            {parsed && !isRelative && (
              <>
                <p>
                  ISO: <span className="font-mono-editor">{parsed.toISOString()}</span>
                </p>
                <p>
                  Relative: <span className="font-mono-editor">{formatRelative(parsed, new Date())}</span>
                </p>
              </>
            )}
            {parsed && isRelative && (
              <p>
                Absolute: <span className="font-mono-editor">{formatPattern(parsed, "YYYY-MM-DD HH:mm")}</span>
              </p>
            )}
          </div>
        </div>
      </ToolPanel>

      <CodeOutput
        title="Generated JavaScript"
        code={code}
        filename="format-date.js"
        mime="text/javascript"
        className="lg:col-span-2"
      />
    </div>
  );
}

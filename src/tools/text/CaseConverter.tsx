import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";

const splitWords = (s: string) =>
  s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

const cap = (w: string) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : "");

const TRANSFORMS: { label: string; fn: (s: string) => string }[] = [
  { label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { label: "lowercase", fn: (s) => s.toLowerCase() },
  { label: "Sentence case", fn: (s) => s.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (_, p, c) => p + c.toUpperCase()) },
  { label: "Title Case", fn: (s) => splitWords(s).map(cap).join(" ") },
  { label: "camelCase", fn: (s) => splitWords(s).map((w, i) => (i === 0 ? w.toLowerCase() : cap(w))).join("") },
  { label: "PascalCase", fn: (s) => splitWords(s).map(cap).join("") },
  { label: "snake_case", fn: (s) => splitWords(s).map((w) => w.toLowerCase()).join("_") },
  { label: "kebab-case", fn: (s) => splitWords(s).map((w) => w.toLowerCase()).join("-") },
  { label: "CONSTANT_CASE", fn: (s) => splitWords(s).map((w) => w.toUpperCase()).join("_") },
];

export function CaseConverter() {
  const [text, setText] = useState("Hello developer world");

  return (
    <div className="grid gap-4">
      <ToolPanel title="Input">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>
      <div className="grid gap-3 sm:grid-cols-2">
        {TRANSFORMS.map((t) => {
          const value = t.fn(text);
          return (
            <div key={t.label} className="glass-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.label}</p>
                <div className="flex gap-2">
                  <CopyButton value={value} label="" size="sm" variant="ghost" />
                  <Button size="sm" variant="ghost" onClick={() => setText(value)}>Use</Button>
                </div>
              </div>
              <p className="mt-2 break-all font-medium">{value || <span className="text-muted-foreground">—</span>}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
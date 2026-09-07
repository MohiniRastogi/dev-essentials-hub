import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2 } from "lucide-react";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

type ColorVar = { name: string; value: string };

const DEFAULT_COLORS: ColorVar[] = [
  { name: "primary", value: "#ec4899" },
  { name: "secondary", value: "#1e293b" },
  { name: "background", value: "#0b1220" },
  { name: "foreground", value: "#f8fafc" },
];

export function CssVariablesGenerator() {
  const [colors, setColors] = useState<ColorVar[]>(DEFAULT_COLORS);
  const [base, setBase] = useState(4);
  const [steps, setSteps] = useState(6);
  const [prefix, setPrefix] = useState("");

  const p = prefix.trim().replace(/[^a-zA-Z0-9-]/g, "");
  const varName = (n: string) => `--${p ? `${p}-` : ""}${n}`;

  const spacing = Array.from({ length: steps }, (_, i) => ({
    name: `space-${i + 1}`,
    value: `${base * (i + 1)}px`,
  }));

  const css = `:root {\n${colors
    .filter((c) => c.name.trim())
    .map((c) => `  ${varName(c.name.trim())}: ${c.value};`)
    .join("\n")}\n\n${spacing.map((s) => `  ${varName(s.name)}: ${s.value};`).join("\n")}\n}`;

  const update = (i: number, patch: Partial<ColorVar>) =>
    setColors((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel
        title="Palette"
        actions={
          <Button size="sm" variant="outline" onClick={() => setColors((c) => [...c, { name: `color-${c.length + 1}`, value: "#38bdf8" }])}>
            Add color
          </Button>
        }
      >
        <div className="grid gap-4">
          <Control label="Variable prefix (optional)">
            <input
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="app"
              className="h-9 w-full rounded-md border border-border bg-card/40 px-2 font-mono-editor text-sm text-foreground"
            />
          </Control>
          <div className="grid max-h-72 gap-2 overflow-auto pr-1">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
                <input
                  type="color"
                  value={c.value}
                  onChange={(e) => update(i, { value: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded border border-border"
                />
                <input
                  value={c.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background/40 px-2 font-mono-editor text-sm text-foreground"
                />
                <Button size="icon" variant="ghost" onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Control label={`Spacing base — ${base}px`}>
            <Slider value={[base]} min={2} max={16} step={1} onValueChange={([v]) => setBase(v)} />
          </Control>
          <Control label={`Spacing steps — ${steps}`}>
            <Slider value={[steps]} min={2} max={12} step={1} onValueChange={([v]) => setSteps(v)} />
          </Control>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid gap-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-4">
          <div className="flex flex-wrap gap-2">
            {colors.map((c, i) => (
              <div key={i} className="grid gap-1 text-center">
                <div className="h-14 w-14 rounded-lg border border-border" style={{ background: c.value }} />
                <span className="font-mono-editor text-[10px] text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-2">
            {spacing.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-20 font-mono-editor text-[10px] text-muted-foreground">{s.name}</span>
                <div className="h-3 rounded bg-primary" style={{ width: s.value }} />
                <span className="font-mono-editor text-[10px] text-muted-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="variables.css" className="lg:col-span-2" />
    </div>
  );
}

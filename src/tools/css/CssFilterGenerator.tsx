import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

type Key = "blur" | "brightness" | "contrast" | "saturate" | "grayscale" | "sepia" | "invert" | "hueRotate" | "opacity";

const DEFAULTS: Record<Key, number> = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  hueRotate: 0,
  opacity: 100,
};

const META: { key: Key; label: string; min: number; max: number; unit: string }[] = [
  { key: "blur", label: "Blur", min: 0, max: 20, unit: "px" },
  { key: "brightness", label: "Brightness", min: 0, max: 200, unit: "%" },
  { key: "contrast", label: "Contrast", min: 0, max: 200, unit: "%" },
  { key: "saturate", label: "Saturate", min: 0, max: 300, unit: "%" },
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%" },
  { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%" },
  { key: "invert", label: "Invert", min: 0, max: 100, unit: "%" },
  { key: "hueRotate", label: "Hue rotate", min: 0, max: 360, unit: "deg" },
  { key: "opacity", label: "Opacity", min: 0, max: 100, unit: "%" },
];

export function CssFilterGenerator() {
  const [v, setV] = useState<Record<Key, number>>(DEFAULTS);

  const parts: string[] = [];
  if (v.blur) parts.push(`blur(${v.blur}px)`);
  if (v.brightness !== 100) parts.push(`brightness(${v.brightness}%)`);
  if (v.contrast !== 100) parts.push(`contrast(${v.contrast}%)`);
  if (v.saturate !== 100) parts.push(`saturate(${v.saturate}%)`);
  if (v.grayscale) parts.push(`grayscale(${v.grayscale}%)`);
  if (v.sepia) parts.push(`sepia(${v.sepia}%)`);
  if (v.invert) parts.push(`invert(${v.invert}%)`);
  if (v.hueRotate) parts.push(`hue-rotate(${v.hueRotate}deg)`);
  if (v.opacity !== 100) parts.push(`opacity(${v.opacity}%)`);

  const value = parts.join(" ") || "none";
  const css = `.filtered {\n  filter: ${value};\n  -webkit-filter: ${value};\n}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel
        title="Filters"
        actions={
          <Button size="sm" variant="outline" onClick={() => setV(DEFAULTS)}>
            Reset
          </Button>
        }
      >
        <div className="grid max-h-[420px] gap-4 overflow-auto pr-1">
          {META.map((m) => (
            <Control key={m.key} label={`${m.label} — ${v[m.key]}${m.unit}`}>
              <Slider
                value={[v[m.key]]}
                min={m.min}
                max={m.max}
                step={1}
                onValueChange={([n]) => setV((p) => ({ ...p, [m.key]: n }))}
              />
            </Control>
          ))}
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid min-h-[320px] place-items-center rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-8">
          <div
            className="grid h-56 w-56 place-items-center rounded-2xl bg-gradient-to-br from-primary via-primary/60 to-secondary text-2xl font-bold text-primary-foreground"
            style={{ filter: value }}
          >
            CSS
          </div>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="filter.css" className="lg:col-span-2" />
    </div>
  );
}

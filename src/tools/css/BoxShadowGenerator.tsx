import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

type Layer = { x: number; y: number; blur: number; spread: number; color: string; opacity: number; inset: boolean };

const NEW_LAYER: Layer = { x: 0, y: 10, blur: 20, spread: 0, color: "#000000", opacity: 0.35, inset: false };

function hexToRgba(hex: string, a: number) {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(0, 0, 0, ${a})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a.toFixed(2)})`;
}

export function BoxShadowGenerator() {
  const [layers, setLayers] = useState<Layer[]>([{ ...NEW_LAYER }]);

  const value = layers
    .map((l) => `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`)
    .join(", ");
  const css = `.box {\n  box-shadow: ${value};\n}`;

  const update = (i: number, patch: Partial<Layer>) =>
    setLayers((prev) => prev.map((l, x) => (x === i ? { ...l, ...patch } : l)));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel
        title="Shadow layers"
        actions={
          <Button size="sm" variant="outline" onClick={() => setLayers([...layers, { ...NEW_LAYER }])}>
            <Plus className="h-4 w-4" /> Layer
          </Button>
        }
      >
        <div className="grid gap-5">
          {layers.map((l, i) => (
            <div key={i} className="grid gap-3 rounded-md border border-border bg-card/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Layer {i + 1}</p>
                {layers.length > 1 && (
                  <Button size="sm" variant="ghost" onClick={() => setLayers(layers.filter((_, x) => x !== i))} aria-label="Remove layer">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Control label={`Offset X — ${l.x}px`}>
                <Slider value={[l.x]} min={-50} max={50} step={1} onValueChange={([v]) => update(i, { x: v })} />
              </Control>
              <Control label={`Offset Y — ${l.y}px`}>
                <Slider value={[l.y]} min={-50} max={50} step={1} onValueChange={([v]) => update(i, { y: v })} />
              </Control>
              <Control label={`Blur — ${l.blur}px`}>
                <Slider value={[l.blur]} min={0} max={100} step={1} onValueChange={([v]) => update(i, { blur: v })} />
              </Control>
              <Control label={`Spread — ${l.spread}px`}>
                <Slider value={[l.spread]} min={0} max={100} step={1} onValueChange={([v]) => update(i, { spread: v })} />
              </Control>
              <Control label={`Opacity — ${l.opacity.toFixed(2)}`}>
                <Slider value={[l.opacity]} min={0} max={1} step={0.01} onValueChange={([v]) => update(i, { opacity: v })} />
              </Control>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Color</span>
                  <input
                    type="color"
                    value={l.color}
                    onChange={(e) => update(i, { color: e.target.value })}
                    className="h-9 w-12 cursor-pointer rounded"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Inset</span>
                  <Switch checked={l.inset} onCheckedChange={(v) => update(i, { inset: v })} />
                </label>
              </div>
            </div>
          ))}
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid min-h-[320px] place-items-center rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-8">
          <div className="h-40 w-40 rounded-2xl bg-card" style={{ boxShadow: value }} />
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="box-shadow.css" className="lg:col-span-2" />
    </div>
  );
}

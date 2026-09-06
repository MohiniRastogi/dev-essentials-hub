import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control, SelectRow } from "./_shared/CssOutput";

type Pt = { x: number; y: number };

const PRESETS: Record<string, Pt[]> = {
  Triangle: [{ x: 50, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
  Rhombus: [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }],
  Hexagon: [{ x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 }],
  Star: [
    { x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 }, { x: 79, y: 91 },
    { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 }, { x: 2, y: 35 }, { x: 39, y: 35 },
  ],
  Message: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 75 }, { x: 75, y: 75 }, { x: 75, y: 100 }, { x: 50, y: 75 }, { x: 0, y: 75 }],
};

export function ClipPathGenerator() {
  const [shape, setShape] = useState("polygon");
  const [points, setPoints] = useState<Pt[]>(PRESETS.Hexagon);
  const [inset, setInset] = useState(12);
  const [radius, setRadius] = useState(50);

  const polygon = `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
  const value =
    shape === "polygon"
      ? polygon
      : shape === "circle"
        ? `circle(${radius}% at 50% 50%)`
        : shape === "ellipse"
          ? `ellipse(${radius}% ${Math.round(radius * 0.7)}% at 50% 50%)`
          : `inset(${inset}% round ${inset}px)`;

  const css = `.clipped {\n  clip-path: ${value};\n  -webkit-clip-path: ${value};\n}`;

  const update = (i: number, key: keyof Pt, v: number) =>
    setPoints((prev) => prev.map((p, idx) => (idx === i ? { ...p, [key]: v } : p)));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Shape">
        <div className="grid gap-4">
          <SelectRow label="Shape function" value={shape} options={["polygon", "circle", "ellipse", "inset"]} onChange={setShape} />

          {shape === "polygon" && (
            <>
              <Control label="Presets">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PRESETS).map((k) => (
                    <Button key={k} size="sm" variant="outline" onClick={() => setPoints(PRESETS[k])}>{k}</Button>
                  ))}
                </div>
              </Control>
              <div className="grid max-h-72 gap-3 overflow-auto pr-1">
                {points.map((p, i) => (
                  <div key={i} className="grid gap-2 rounded-md border border-border bg-card/40 p-3">
                    <p className="font-mono-editor text-xs text-muted-foreground">point {i + 1} — {p.x}% {p.y}%</p>
                    <Slider value={[p.x]} min={0} max={100} step={1} onValueChange={([v]) => update(i, "x", v)} />
                    <Slider value={[p.y]} min={0} max={100} step={1} onValueChange={([v]) => update(i, "y", v)} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPoints((p) => [...p, { x: 50, y: 50 }])}>Add point</Button>
                <Button size="sm" variant="outline" disabled={points.length <= 3} onClick={() => setPoints((p) => p.slice(0, -1))}>
                  Remove last
                </Button>
              </div>
            </>
          )}

          {(shape === "circle" || shape === "ellipse") && (
            <Control label={`Radius — ${radius}%`}>
              <Slider value={[radius]} min={5} max={80} step={1} onValueChange={([v]) => setRadius(v)} />
            </Control>
          )}

          {shape === "inset" && (
            <Control label={`Inset — ${inset}%`}>
              <Slider value={[inset]} min={0} max={45} step={1} onValueChange={([v]) => setInset(v)} />
            </Control>
          )}
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid min-h-[320px] place-items-center rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-8">
          <div
            className="h-64 w-64 bg-gradient-to-br from-primary to-primary/40"
            style={{ clipPath: value, WebkitClipPath: value }}
          />
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="clip-path.css" className="lg:col-span-2" />
    </div>
  );
}

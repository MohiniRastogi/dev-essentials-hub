import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

const PRESETS: Record<string, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  "back-out": [0.34, 1.56, 0.64, 1],
  bounce: [0.68, -0.55, 0.27, 1.55],
};

export function CubicBezierGenerator() {
  const [p, setP] = useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1]);
  const [play, setPlay] = useState(0);

  const [x1, y1, x2, y2] = p;
  const timing = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  const css = `.eased {\n  transition: all 1s ${timing};\n  animation-timing-function: ${timing};\n}`;

  useEffect(() => {
    const id = setInterval(() => setPlay((v) => (v === 0 ? 1 : 0)), 1600);
    return () => clearInterval(id);
  }, []);

  const set = (i: number, v: number) =>
    setP((prev) => prev.map((x, idx) => (idx === i ? v : x)) as [number, number, number, number]);

  // SVG curve in a 0..100 box, y flipped
  const sx = (v: number) => v * 100;
  const sy = (v: number) => 100 - v * 100;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Curve controls">
        <div className="grid gap-4">
          <Control label="Presets">
            <div className="flex flex-wrap gap-2">
              {Object.keys(PRESETS).map((k) => (
                <Button key={k} size="sm" variant="outline" onClick={() => setP(PRESETS[k])}>
                  {k}
                </Button>
              ))}
            </div>
          </Control>
          {(["x1", "y1", "x2", "y2"] as const).map((label, i) => (
            <Control key={label} label={`${label} — ${p[i]}`}>
              <Slider
                value={[p[i]]}
                min={label.startsWith("x") ? 0 : -1}
                max={label.startsWith("x") ? 1 : 2}
                step={0.01}
                onValueChange={([v]) => set(i, Number(v.toFixed(2)))}
              />
            </Control>
          ))}
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid gap-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-4">
          <svg viewBox="-10 -20 120 140" className="h-56 w-full">
            <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" strokeOpacity="0.2" />
            <line x1={sx(x1)} y1={sy(y1)} x2="0" y2="100" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" />
            <line x1={sx(x2)} y1={sy(y2)} x2="100" y2="0" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" />
            <path
              d={`M 0 100 C ${sx(x1)} ${sy(y1)}, ${sx(x2)} ${sy(y2)}, 100 0`}
              fill="none"
              stroke="hsl(var(--primary))"
              className="stroke-primary"
              strokeWidth="2"
            />
            <circle cx={sx(x1)} cy={sy(y1)} r="3" className="fill-primary" />
            <circle cx={sx(x2)} cy={sy(y2)} r="3" className="fill-primary" />
          </svg>
          <div className="rounded-lg border border-border/60 bg-card/40 p-3">
            <div
              className="h-8 w-8 rounded-full bg-primary"
              style={{
                transform: `translateX(${play ? "calc(100% * 6)" : "0px"})`,
                transition: `transform 1.4s ${timing}`,
              }}
            />
          </div>
          <p className="text-center font-mono-editor text-xs text-muted-foreground">{timing}</p>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="cubic-bezier.css" className="lg:col-span-2" />
    </div>
  );
}

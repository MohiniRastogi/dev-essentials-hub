import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

type Shape = "flat" | "concave" | "convex" | "pressed";
const SHAPES: Shape[] = ["flat", "concave", "convex", "pressed"];

function shift(hex: string, amount: number) {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.max(0, Math.min(255, Math.round(c + amount))),
  );
  return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function NeumorphismGenerator() {
  const [base, setBase] = useState("#e0e5ec");
  const [shape, setShape] = useState<Shape>("flat");
  const [distance, setDistance] = useState(14);
  const [intensity, setIntensity] = useState(0.15);
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(40);

  const light = shift(base, Math.round(255 * intensity));
  const dark = shift(base, -Math.round(255 * intensity));
  const blur = distance * 2;
  const inset = shape === "pressed" ? "inset " : "";
  const background =
    shape === "concave"
      ? `linear-gradient(145deg, ${shift(base, -12)}, ${shift(base, 12)})`
      : shape === "convex"
        ? `linear-gradient(145deg, ${shift(base, 12)}, ${shift(base, -12)})`
        : base;

  const shadow = `${inset}${distance}px ${distance}px ${blur}px ${dark}, ${inset}-${distance}px -${distance}px ${blur}px ${light}`;
  const css = `.neumorphic {\n  width: ${size}px;\n  height: ${size}px;\n  border-radius: ${radius}px;\n  background: ${background};\n  box-shadow: ${shadow};\n}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Control label="Base color">
            <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-10 w-16 cursor-pointer rounded" />
          </Control>
          <Control label="Shape">
            <div className="flex flex-wrap gap-2">
              {SHAPES.map((s) => (
                <Button key={s} size="sm" variant={shape === s ? "default" : "outline"} onClick={() => setShape(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </Control>
          <Control label={`Distance — ${distance}px`}>
            <Slider value={[distance]} min={2} max={40} step={1} onValueChange={([v]) => setDistance(v)} />
          </Control>
          <Control label={`Intensity — ${intensity.toFixed(2)}`}>
            <Slider value={[intensity]} min={0.02} max={0.4} step={0.01} onValueChange={([v]) => setIntensity(v)} />
          </Control>
          <Control label={`Size — ${size}px`}>
            <Slider value={[size]} min={80} max={320} step={10} onValueChange={([v]) => setSize(v)} />
          </Control>
          <Control label={`Radius — ${radius}px`}>
            <Slider value={[radius]} min={0} max={160} step={2} onValueChange={([v]) => setRadius(v)} />
          </Control>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid min-h-[360px] place-items-center rounded-xl p-8" style={{ background: base }}>
          <div style={{ width: size, height: size, borderRadius: radius, background, boxShadow: shadow }} />
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="neumorphism.css" className="lg:col-span-2" />
    </div>
  );
}

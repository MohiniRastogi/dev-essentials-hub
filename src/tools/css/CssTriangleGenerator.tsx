import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control, SelectRow } from "./_shared/CssOutput";

const DIRECTIONS = ["up", "down", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"];

export function CssTriangleGenerator() {
  const [direction, setDirection] = useState("up");
  const [width, setWidth] = useState(80);
  const [height, setHeight] = useState(60);
  const [color, setColor] = useState("#ec4899");

  const half = Math.round(width / 2);
  const style: Record<string, string> = { width: "0", height: "0" };

  switch (direction) {
    case "up":
      Object.assign(style, {
        "border-left": `${half}px solid transparent`,
        "border-right": `${half}px solid transparent`,
        "border-bottom": `${height}px solid ${color}`,
      });
      break;
    case "down":
      Object.assign(style, {
        "border-left": `${half}px solid transparent`,
        "border-right": `${half}px solid transparent`,
        "border-top": `${height}px solid ${color}`,
      });
      break;
    case "left":
      Object.assign(style, {
        "border-top": `${Math.round(height / 2)}px solid transparent`,
        "border-bottom": `${Math.round(height / 2)}px solid transparent`,
        "border-right": `${width}px solid ${color}`,
      });
      break;
    case "right":
      Object.assign(style, {
        "border-top": `${Math.round(height / 2)}px solid transparent`,
        "border-bottom": `${Math.round(height / 2)}px solid transparent`,
        "border-left": `${width}px solid ${color}`,
      });
      break;
    case "top-left":
      Object.assign(style, { "border-top": `${height}px solid ${color}`, "border-right": `${width}px solid transparent` });
      break;
    case "top-right":
      Object.assign(style, { "border-top": `${height}px solid ${color}`, "border-left": `${width}px solid transparent` });
      break;
    case "bottom-left":
      Object.assign(style, { "border-bottom": `${height}px solid ${color}`, "border-right": `${width}px solid transparent` });
      break;
    default:
      Object.assign(style, { "border-bottom": `${height}px solid ${color}`, "border-left": `${width}px solid transparent` });
  }

  const css = `.triangle {\n${Object.entries(style)
    .map(([k, val]) => `  ${k}: ${val};`)
    .join("\n")}\n}`;

  const reactStyle = Object.fromEntries(
    Object.entries(style).map(([k, val]) => [k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), val]),
  ) as React.CSSProperties;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <SelectRow label="Direction" value={direction} options={DIRECTIONS} onChange={setDirection} />
          <Control label={`Width — ${width}px`}>
            <Slider value={[width]} min={10} max={240} step={2} onValueChange={([v]) => setWidth(v)} />
          </Control>
          <Control label={`Height — ${height}px`}>
            <Slider value={[height]} min={10} max={240} step={2} onValueChange={([v]) => setHeight(v)} />
          </Control>
          <Control label="Color">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-md border border-border bg-card/40"
            />
          </Control>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid min-h-[320px] place-items-center rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-8">
          <div style={reactStyle} />
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="triangle.css" className="lg:col-span-2" />
    </div>
  );
}

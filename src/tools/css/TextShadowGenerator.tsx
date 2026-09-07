import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

export function TextShadowGenerator() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [blur, setBlur] = useState(6);
  const [color, setColor] = useState("#ec4899");
  const [opacity, setOpacity] = useState(70);
  const [size, setSize] = useState(56);
  const [text, setText] = useState("Developer Toolkit");

  const rgba = (() => {
    const h = color.replace("#", "");
    const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${(opacity / 100).toFixed(2)})`;
  })();

  const value = `${x}px ${y}px ${blur}px ${rgba}`;
  const css = `.shadow-text {\n  text-shadow: ${value};\n}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Control label="Preview text">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-card/40 px-2 text-sm text-foreground"
            />
          </Control>
          <Control label={`Offset X — ${x}px`}>
            <Slider value={[x]} min={-40} max={40} step={1} onValueChange={([v]) => setX(v)} />
          </Control>
          <Control label={`Offset Y — ${y}px`}>
            <Slider value={[y]} min={-40} max={40} step={1} onValueChange={([v]) => setY(v)} />
          </Control>
          <Control label={`Blur — ${blur}px`}>
            <Slider value={[blur]} min={0} max={60} step={1} onValueChange={([v]) => setBlur(v)} />
          </Control>
          <Control label={`Opacity — ${opacity}%`}>
            <Slider value={[opacity]} min={0} max={100} step={1} onValueChange={([v]) => setOpacity(v)} />
          </Control>
          <Control label={`Font size — ${size}px`}>
            <Slider value={[size]} min={16} max={120} step={1} onValueChange={([v]) => setSize(v)} />
          </Control>
          <Control label="Shadow color">
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
          <p
            className="text-center font-bold leading-tight"
            style={{ fontSize: `${size}px`, textShadow: value }}
          >
            {text || "Preview"}
          </p>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="text-shadow.css" className="lg:col-span-2" />
    </div>
  );
}

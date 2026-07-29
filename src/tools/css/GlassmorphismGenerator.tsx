import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

function rgba(hex: string, a: number) {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(255, 255, 255, ${a.toFixed(2)})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a.toFixed(2)})`;
}

export function GlassmorphismGenerator() {
  const [bg, setBg] = useState("#ffffff");
  const [bgOpacity, setBgOpacity] = useState(0.18);
  const [blur, setBlur] = useState(16);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [borderOpacity, setBorderOpacity] = useState(0.35);
  const [radius, setRadius] = useState(20);

  const background = rgba(bg, bgOpacity);
  const border = `1px solid ${rgba(borderColor, borderOpacity)}`;
  const css = `.glass {\n  background: ${background};\n  backdrop-filter: blur(${blur}px);\n  border: ${border};\n  border-radius: ${radius}px;\n  padding: 24px;\n}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Control label="Background color">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-16 cursor-pointer rounded" />
          </Control>
          <Control label={`Background opacity — ${bgOpacity.toFixed(2)}`}>
            <Slider value={[bgOpacity]} min={0} max={1} step={0.01} onValueChange={([v]) => setBgOpacity(v)} />
          </Control>
          <Control label={`Blur — ${blur}px`}>
            <Slider value={[blur]} min={0} max={40} step={1} onValueChange={([v]) => setBlur(v)} />
          </Control>
          <Control label="Border color">
            <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded" />
          </Control>
          <Control label={`Border opacity — ${borderOpacity.toFixed(2)}`}>
            <Slider value={[borderOpacity]} min={0} max={1} step={0.01} onValueChange={([v]) => setBorderOpacity(v)} />
          </Control>
          <Control label={`Border radius — ${radius}px`}>
            <Slider value={[radius]} min={0} max={60} step={1} onValueChange={([v]) => setRadius(v)} />
          </Control>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div
          className="grid min-h-[320px] place-items-center rounded-xl p-8"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #8B5CF6 45%, #EC4899 100%)" }}
        >
          <div
            className="w-full max-w-xs p-6 text-sm"
            style={{ background, backdropFilter: `blur(${blur}px)`, border, borderRadius: radius }}
          >
            <p className="font-semibold">Frosted glass card</p>
            <p className="mt-1 opacity-80">Adjust the controls to tune the effect.</p>
          </div>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="glassmorphism.css" className="lg:col-span-2" />
    </div>
  );
}

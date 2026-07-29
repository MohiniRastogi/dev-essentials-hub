import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

export function ClampGenerator() {
  const [minFont, setMinFont] = useState(16);
  const [maxFont, setMaxFont] = useState(48);
  const [minVw, setMinVw] = useState(320);
  const [maxVw, setMaxVw] = useState(1280);
  const [viewport, setViewport] = useState(768);

  const spanVw = Math.max(1, maxVw - minVw);
  const slope = (maxFont - minFont) / spanVw;
  const vwPart = Number((slope * 100).toFixed(4));
  const remPart = Number(((minFont - slope * minVw) / 16).toFixed(4));
  const preferred = `${remPart}rem + ${vwPart}vw`;
  const value = `clamp(${(minFont / 16).toFixed(3)}rem, ${preferred}, ${(maxFont / 16).toFixed(3)}rem)`;
  const css = `.fluid-text {\n  font-size: ${value};\n}`;

  const rendered = Math.min(Math.max(minFont, remPart * 16 + (vwPart / 100) * viewport), maxFont);
  const invalid = minFont >= maxFont || minVw >= maxVw;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Control label={`Min font size — ${minFont}px`}>
            <Slider value={[minFont]} min={8} max={80} step={1} onValueChange={([v]) => setMinFont(v)} />
          </Control>
          <Control label={`Max font size — ${maxFont}px`}>
            <Slider value={[maxFont]} min={10} max={160} step={1} onValueChange={([v]) => setMaxFont(v)} />
          </Control>
          <Control label={`Min viewport — ${minVw}px`}>
            <Slider value={[minVw]} min={240} max={1000} step={10} onValueChange={([v]) => setMinVw(v)} />
          </Control>
          <Control label={`Max viewport — ${maxVw}px`}>
            <Slider value={[maxVw]} min={600} max={2560} step={10} onValueChange={([v]) => setMaxVw(v)} />
          </Control>
          {invalid && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Min values must be smaller than max values for a valid clamp().
            </p>
          )}
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid gap-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-4">
          <Control label={`Simulated viewport — ${viewport}px`}>
            <Slider value={[viewport]} min={240} max={2560} step={10} onValueChange={([v]) => setViewport(v)} />
          </Control>
          <div className="grid min-h-[220px] place-items-center rounded-lg border border-border/60 bg-card/40 p-4">
            <p style={{ fontSize: `${rendered.toFixed(2)}px`, lineHeight: 1.15 }} className="text-center font-semibold">
              Fluid typography
            </p>
          </div>
          <p className="text-center font-mono-editor text-xs text-muted-foreground">
            renders at {rendered.toFixed(2)}px
          </p>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="clamp.css" className="lg:col-span-2" />
    </div>
  );
}

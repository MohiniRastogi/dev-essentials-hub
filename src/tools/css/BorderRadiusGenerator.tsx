import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

export function BorderRadiusGenerator() {
  const [linked, setLinked] = useState(false);
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);

  const setAll = (v: number) => { setTl(v); setTr(v); setBr(v); setBl(v); };
  const set = (fn: (v: number) => void) => (v: number) => (linked ? setAll(v) : fn(v));

  const uniform = tl === tr && tr === br && br === bl;
  const shorthand = uniform ? `${tl}px` : `${tl}px ${tr}px ${br}px ${bl}px`;
  const css = uniform
    ? `.box {\n  border-radius: ${shorthand};\n}`
    : `.box {\n  border-radius: ${shorthand};\n  /* per-corner equivalent */\n  border-top-left-radius: ${tl}px;\n  border-top-right-radius: ${tr}px;\n  border-bottom-right-radius: ${br}px;\n  border-bottom-left-radius: ${bl}px;\n}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Corners">
        <div className="grid gap-4">
          <label className="flex items-center justify-between rounded-md border border-border bg-card/40 px-3 py-2 text-sm">
            <span>Link all corners</span>
            <Switch checked={linked} onCheckedChange={(v) => { setLinked(v); if (v) setAll(tl); }} />
          </label>
          <Control label={`Top left — ${tl}px`}>
            <Slider value={[tl]} min={0} max={200} step={1} onValueChange={([v]) => set(setTl)(v)} />
          </Control>
          <Control label={`Top right — ${tr}px`}>
            <Slider value={[tr]} min={0} max={200} step={1} onValueChange={([v]) => set(setTr)(v)} />
          </Control>
          <Control label={`Bottom right — ${br}px`}>
            <Slider value={[br]} min={0} max={200} step={1} onValueChange={([v]) => set(setBr)(v)} />
          </Control>
          <Control label={`Bottom left — ${bl}px`}>
            <Slider value={[bl]} min={0} max={200} step={1} onValueChange={([v]) => set(setBl)(v)} />
          </Control>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid min-h-[320px] place-items-center rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-8">
          <div
            className="h-56 w-56 border border-primary/40 bg-primary/25"
            style={{ borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` }}
          />
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="border-radius.css" className="lg:col-span-2" />
    </div>
  );
}

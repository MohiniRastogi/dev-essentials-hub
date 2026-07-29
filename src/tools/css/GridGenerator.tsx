import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

export function GridGenerator() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(12);
  const [custom, setCustom] = useState(false);
  const [colTemplate, setColTemplate] = useState("1fr 2fr 1fr");
  const [rowTemplate, setRowTemplate] = useState("auto auto");

  const cols = custom && colTemplate.trim() ? colTemplate.trim() : `repeat(${columns}, minmax(0, 1fr))`;
  const rws = custom && rowTemplate.trim() ? rowTemplate.trim() : `repeat(${rows}, minmax(80px, auto))`;
  const css = `.grid {\n  display: grid;\n  grid-template-columns: ${cols};\n  grid-template-rows: ${rws};\n  gap: ${gap}px;\n}`;

  const cellCount = custom
    ? colTemplate.trim().split(/\s+/).length * Math.max(1, rowTemplate.trim().split(/\s+/).length)
    : columns * rows;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <label className="flex items-center justify-between rounded-md border border-border bg-card/40 px-3 py-2 text-sm">
            <span>Custom track sizing</span>
            <Switch checked={custom} onCheckedChange={setCustom} />
          </label>
          {custom ? (
            <>
              <Control label="grid-template-columns">
                <Input value={colTemplate} onChange={(e) => setColTemplate(e.target.value)} className="font-mono-editor" placeholder="1fr 2fr 1fr" />
              </Control>
              <Control label="grid-template-rows">
                <Input value={rowTemplate} onChange={(e) => setRowTemplate(e.target.value)} className="font-mono-editor" placeholder="auto auto" />
              </Control>
            </>
          ) : (
            <>
              <Control label={`Columns — ${columns}`}>
                <Slider value={[columns]} min={1} max={8} step={1} onValueChange={([v]) => setColumns(v)} />
              </Control>
              <Control label={`Rows — ${rows}`}>
                <Slider value={[rows]} min={1} max={8} step={1} onValueChange={([v]) => setRows(v)} />
              </Control>
            </>
          )}
          <Control label={`Gap — ${gap}px`}>
            <Slider value={[gap]} min={0} max={64} step={2} onValueChange={([v]) => setGap(v)} />
          </Control>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="min-h-[320px] rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-4">
          <div style={{ display: "grid", gridTemplateColumns: cols, gridTemplateRows: rws, gap }}>
            {Array.from({ length: Math.min(64, Math.max(1, cellCount)) }).map((_, i) => (
              <div key={i} className="grid min-h-16 place-items-center rounded-md border border-primary/40 bg-primary/25 text-sm">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="grid.css" className="lg:col-span-2" />
    </div>
  );
}

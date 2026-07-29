import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control, SelectRow } from "./_shared/CssOutput";

const DIRECTIONS = ["row", "row-reverse", "column", "column-reverse"];
const JUSTIFY = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"];
const ALIGN = ["stretch", "flex-start", "flex-end", "center", "baseline"];
const WRAP = ["nowrap", "wrap", "wrap-reverse"];

export function FlexboxGenerator() {
  const [direction, setDirection] = useState(DIRECTIONS[0]);
  const [justify, setJustify] = useState(JUSTIFY[0]);
  const [align, setAlign] = useState(ALIGN[0]);
  const [wrap, setWrap] = useState(WRAP[1]);
  const [gap, setGap] = useState(12);
  const [items, setItems] = useState(4);

  const css = `.container {\n  display: flex;\n  flex-direction: ${direction};\n  justify-content: ${justify};\n  align-items: ${align};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}`;

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: direction as React.CSSProperties["flexDirection"],
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap as React.CSSProperties["flexWrap"],
    gap,
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <SelectRow label="flex-direction" value={direction} options={DIRECTIONS} onChange={setDirection} />
          <SelectRow label="justify-content" value={justify} options={JUSTIFY} onChange={setJustify} />
          <SelectRow label="align-items" value={align} options={ALIGN} onChange={setAlign} />
          <SelectRow label="flex-wrap" value={wrap} options={WRAP} onChange={setWrap} />
          <Control label={`Gap — ${gap}px`}>
            <Slider value={[gap]} min={0} max={64} step={2} onValueChange={([v]) => setGap(v)} />
          </Control>
          <Control label={`Items — ${items}`}>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setItems((n) => Math.max(1, n - 1))} disabled={items <= 1} aria-label="Remove item">
                <Minus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setItems((n) => Math.min(12, n + 1))} disabled={items >= 12} aria-label="Add item">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Control>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="min-h-[320px] rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-4">
          <div style={{ ...style, minHeight: 290 }} className="h-full">
            {Array.from({ length: items }).map((_, i) => (
              <div
                key={i}
                className="grid min-h-16 min-w-16 place-items-center rounded-md border border-primary/40 bg-primary/25 px-4 py-3 text-sm"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="flexbox.css" className="lg:col-span-2" />
    </div>
  );
}

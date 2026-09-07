import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control } from "./_shared/CssOutput";

export function ScrollbarStyler() {
  const [width, setWidth] = useState(10);
  const [radius, setRadius] = useState(8);
  const [track, setTrack] = useState("#1e293b");
  const [thumb, setThumb] = useState("#ec4899");
  const [thumbHover, setThumbHover] = useState("#f472b6");

  const css = `.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: ${thumb} ${track};
}

.custom-scroll::-webkit-scrollbar {
  width: ${width}px;
  height: ${width}px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: ${track};
  border-radius: ${radius}px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: ${thumb};
  border-radius: ${radius}px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: ${thumbHover};
}`;

  const previewId = "scrollbar-preview";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Control label={`Scrollbar width — ${width}px`}>
            <Slider value={[width]} min={2} max={30} step={1} onValueChange={([v]) => setWidth(v)} />
          </Control>
          <Control label={`Corner radius — ${radius}px`}>
            <Slider value={[radius]} min={0} max={20} step={1} onValueChange={([v]) => setRadius(v)} />
          </Control>
          <Control label="Track color">
            <input type="color" value={track} onChange={(e) => setTrack(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-border bg-card/40" />
          </Control>
          <Control label="Thumb color">
            <input type="color" value={thumb} onChange={(e) => setThumb(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-border bg-card/40" />
          </Control>
          <Control label="Thumb hover color">
            <input type="color" value={thumbHover} onChange={(e) => setThumbHover(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-border bg-card/40" />
          </Control>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <style>{css.replace(/\.custom-scroll/g, `#${previewId}`)}</style>
        <div
          id={previewId}
          className="h-[320px] overflow-auto rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-4"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <p key={i} className="py-2 text-sm text-muted-foreground">
              Scroll this panel to see line {i + 1} and your custom scrollbar in action.
            </p>
          ))}
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="scrollbar.css" className="lg:col-span-2" />
    </div>
  );
}

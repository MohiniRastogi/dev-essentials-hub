import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { ToolPanel } from "@/components/common/ToolShell";
import { CssOutput, Control, SelectRow } from "./_shared/CssOutput";

type Kind = "fade" | "slide" | "scale" | "rotate" | "bounce";
const KINDS: Kind[] = ["fade", "slide", "scale", "rotate", "bounce"];
const TIMINGS = ["ease", "linear", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(0.68, -0.55, 0.27, 1.55)"];
const DIRECTIONS = ["normal", "reverse", "alternate", "alternate-reverse"];

const FRAMES: Record<Kind, string> = {
  fade: `@keyframes fade {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}`,
  slide: `@keyframes slide {\n  from { transform: translateX(-60px); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}`,
  scale: `@keyframes scale {\n  from { transform: scale(0.4); }\n  to { transform: scale(1); }\n}`,
  rotate: `@keyframes rotate {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}`,
  bounce: `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-40px); }\n}`,
};

export function AnimationGenerator() {
  const [kind, setKind] = useState<Kind>("fade");
  const [duration, setDuration] = useState(1);
  const [timing, setTiming] = useState(TIMINGS[0]);
  const [delay, setDelay] = useState(0);
  const [infinite, setInfinite] = useState(true);
  const [count, setCount] = useState(1);
  const [direction, setDirection] = useState(DIRECTIONS[0]);
  const [replay, setReplay] = useState(0);

  const iteration = infinite ? "infinite" : String(count);
  const shorthand = `${kind} ${duration}s ${timing} ${delay}s ${iteration} ${direction} both`;
  const css = `${FRAMES[kind]}\n\n.animated {\n  animation: ${shorthand};\n}`;

  const styleTag = useMemo(() => FRAMES[kind], [kind]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Control label="Animation type">
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <Button key={k} size="sm" variant={kind === k ? "default" : "outline"} onClick={() => setKind(k)}>
                  {k}
                </Button>
              ))}
            </div>
          </Control>
          <Control label={`Duration — ${duration}s`}>
            <Slider value={[duration]} min={0.1} max={5} step={0.1} onValueChange={([v]) => setDuration(Number(v.toFixed(1)))} />
          </Control>
          <SelectRow label="Timing function" value={timing} options={TIMINGS} onChange={setTiming} />
          <Control label={`Delay — ${delay}s`}>
            <Slider value={[delay]} min={0} max={3} step={0.1} onValueChange={([v]) => setDelay(Number(v.toFixed(1)))} />
          </Control>
          <Control label={`Iterations — ${iteration}`}>
            <div className="flex items-center gap-3">
              <Button size="sm" variant={infinite ? "default" : "outline"} onClick={() => setInfinite(!infinite)}>
                Infinite
              </Button>
              <Slider
                value={[count]}
                min={1}
                max={10}
                step={1}
                className="flex-1"
                onValueChange={([v]) => { setInfinite(false); setCount(v); }}
              />
            </div>
          </Control>
          <SelectRow label="Direction" value={direction} options={DIRECTIONS} onChange={setDirection} />
        </div>
      </ToolPanel>

      <ToolPanel
        title="Live preview"
        actions={
          <Button size="sm" variant="outline" onClick={() => setReplay((r) => r + 1)}>
            <RotateCcw className="h-4 w-4" /> Replay
          </Button>
        }
      >
        <style>{styleTag}</style>
        <div className="grid min-h-[320px] place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-8">
          <div
            key={`${replay}-${shorthand}`}
            className="grid h-24 w-24 place-items-center rounded-2xl bg-primary/80 text-sm font-semibold text-primary-foreground"
            style={{ animation: shorthand }}
          >
            {kind}
          </div>
        </div>
      </ToolPanel>

      <CssOutput css={css} filename="animation.css" className="lg:col-span-2" />
    </div>
  );
}

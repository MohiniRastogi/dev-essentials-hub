import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Plus, Trash2 } from "lucide-react";

type Stop = { color: string; pos: number };

export function GradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: "#2563EB", pos: 0 },
    { color: "#8B5CF6", pos: 100 },
  ]);

  const css =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.pos}%`).join(", ")})`
      : `radial-gradient(circle, ${stops.map((s) => `${s.color} ${s.pos}%`).join(", ")})`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <ToolPanel title="Preview">
        <div className="h-72 rounded-xl" style={{ background: css }} />
      </ToolPanel>
      <ToolPanel title="Controls">
        <div className="grid gap-5">
          <div className="flex gap-2">
            <Button size="sm" variant={type === "linear" ? "default" : "outline"} onClick={() => setType("linear")}>Linear</Button>
            <Button size="sm" variant={type === "radial" ? "default" : "outline"} onClick={() => setType("radial")}>Radial</Button>
          </div>
          {type === "linear" && (
            <div>
              <div className="mb-2 flex justify-between text-sm"><span>Angle</span><span className="font-mono-editor">{angle}°</span></div>
              <Slider value={[angle]} min={0} max={360} step={1} onValueChange={(v) => setAngle(v[0])} />
            </div>
          )}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Color stops</p>
              <Button size="sm" variant="outline" onClick={() => setStops([...stops, { color: "#22C55E", pos: 50 }])}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            {stops.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border border-border bg-card/40 p-2">
                <input type="color" value={s.color} onChange={(e) => { const c = [...stops]; c[i] = { ...c[i], color: e.target.value }; setStops(c); }} className="h-9 w-9 cursor-pointer rounded" />
                <input value={s.color} onChange={(e) => { const c = [...stops]; c[i] = { ...c[i], color: e.target.value }; setStops(c); }} className="w-24 rounded-md border border-border bg-transparent px-2 py-1 font-mono-editor text-sm" />
                <Slider value={[s.pos]} min={0} max={100} step={1} onValueChange={(v) => { const c = [...stops]; c[i] = { ...c[i], pos: v[0] }; setStops(c); }} className="flex-1" />
                <span className="w-10 text-right text-sm text-muted-foreground">{s.pos}%</span>
                {stops.length > 2 && (
                  <Button size="sm" variant="ghost" onClick={() => setStops(stops.filter((_, x) => x !== i))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </ToolPanel>
      <ToolPanel title="CSS" actions={<CopyButton value={`background: ${css};`} />} className="lg:col-span-2">
        <pre className="font-mono-editor whitespace-pre-wrap break-all text-sm">background: {css};</pre>
      </ToolPanel>
    </div>
  );
}
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Download, Shuffle } from "lucide-react";

function blobPath(points: number, size: number, randomness: number, seed: number[]) {
  const c = size / 2;
  const base = size * 0.38;
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = base * (1 - randomness / 2 + seed[i % seed.length] * randomness);
    pts.push([c + Math.cos(angle) * r, c + Math.sin(angle) * r]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % pts.length];
    const mid: [number, number] = [(cur[0] + next[0]) / 2, (cur[1] + next[1]) / 2];
    d += ` Q${cur[0].toFixed(1)},${cur[1].toFixed(1)} ${mid[0].toFixed(1)},${mid[1].toFixed(1)}`;
  }
  return d + " Z";
}

export function SvgBlobGenerator() {
  const [size, setSize] = useState(400);
  const [complexity, setComplexity] = useState(6);
  const [randomness, setRandomness] = useState(0.5);
  const [color, setColor] = useState("#8B5CF6");
  const [seed, setSeed] = useState<number[]>(() => Array.from({ length: 16 }, () => Math.random()));

  const randomize = useCallback(() => setSeed(Array.from({ length: 16 }, () => Math.random())), []);

  const svg = useMemo(() => {
    const d = blobPath(complexity, size, randomness, seed);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">\n  <path fill="${color}" d="${d}" />\n</svg>`;
  }, [size, complexity, randomness, color, seed]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Preview">
        <div
          className="grid min-h-[300px] place-items-center rounded-xl bg-secondary/30 p-4"
          dangerouslySetInnerHTML={{ __html: svg.replace(/width="\d+" height="\d+"/, 'width="260" height="260"') }}
        />
      </ToolPanel>

      <div className="grid gap-4">
        <ToolPanel title="Controls" actions={<Button size="sm" onClick={randomize}><Shuffle className="h-4 w-4" /> Randomize</Button>}>
          <div className="grid gap-4">
            <Control label={`Size — ${size}px`}>
              <Slider value={[size]} min={100} max={800} step={20} onValueChange={([v]) => setSize(v)} />
            </Control>
            <Control label={`Complexity — ${complexity} points`}>
              <Slider value={[complexity]} min={3} max={16} step={1} onValueChange={([v]) => setComplexity(v)} />
            </Control>
            <Control label={`Randomness — ${Math.round(randomness * 100)}%`}>
              <Slider value={[randomness]} min={0.05} max={0.9} step={0.05} onValueChange={([v]) => setRandomness(v)} />
            </Control>
            <Control label="Fill color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded" />
            </Control>
          </div>
        </ToolPanel>

        <ToolPanel
          title="SVG code"
          actions={
            <>
              <CopyButton value={svg} disabled={!svg} />
              <Button
                size="sm"
                variant="outline"
                disabled={!svg}
                onClick={() => {
                  downloadText("blob.svg", svg, "image/svg+xml");
                  toast.success("Downloaded blob.svg");
                }}
              >
                <Download className="h-4 w-4" /> Download
              </Button>
            </>
          }
        >
          <pre className="font-mono-editor max-h-48 overflow-auto whitespace-pre-wrap break-all text-xs">{svg}</pre>
        </ToolPanel>

      </div>
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { RefreshCw } from "lucide-react";

type Mode = "strings" | "words" | "numbers";

const MODES: { value: Mode; label: string }[] = [
  { value: "strings", label: "Random strings" },
  { value: "words", label: "Random words" },
  { value: "numbers", label: "Random numbers" },
];

const WORDS = [
  "atlas", "boron", "cobalt", "delta", "ember", "flux", "granite", "harbor", "ion", "jasper",
  "kernel", "lumen", "matrix", "nimbus", "onyx", "prism", "quartz", "raster", "sigma", "tundra",
  "umbra", "vector", "willow", "xenon", "yield", "zephyr",
];

function randInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export function RandomText() {
  const [mode, setMode] = useState<Mode>("strings");
  const [count, setCount] = useState(10);
  const [length, setLength] = useState(12);
  const [symbols, setSymbols] = useState(false);
  const [output, setOutput] = useState("");

  const generate = useCallback(() => {
    const n = Math.min(Math.max(count || 1, 1), 500);
    const len = Math.min(Math.max(length || 1, 1), 256);
    const lines: string[] = [];
    if (mode === "strings") {
      const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + (symbols ? "!@#$%^&*-_=+" : "");
      for (let i = 0; i < n; i++) {
        let s = "";
        for (let j = 0; j < len; j++) s += alphabet[randInt(alphabet.length)];
        lines.push(s);
      }
    } else if (mode === "words") {
      for (let i = 0; i < n; i++) {
        const parts: string[] = [];
        for (let j = 0; j < Math.min(len, 20); j++) parts.push(WORDS[randInt(WORDS.length)]);
        lines.push(parts.join(" "));
      }
    } else {
      for (let i = 0; i < n; i++) {
        let s = "";
        for (let j = 0; j < len; j++) s += String(randInt(10));
        lines.push(s.replace(/^0(?=\d)/, "1"));
      }
    }
    setOutput(lines.join("\n"));
  }, [mode, count, length, symbols]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Options">
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <Button key={m.value} size="sm" variant={mode === m.value ? "default" : "outline"} onClick={() => setMode(m.value)}>
                {m.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <label className="grid w-32 gap-1.5 text-sm">
              <span className="text-muted-foreground">How many</span>
              <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </label>
            <label className="grid w-40 gap-1.5 text-sm">
              <span className="text-muted-foreground">{mode === "words" ? "Words per line" : "Length"}</span>
              <Input type="number" min={1} max={256} value={length} onChange={(e) => setLength(Number(e.target.value))} />
            </label>
            {mode === "strings" && (
              <label className="flex h-9 items-center gap-2 text-sm">
                <Switch checked={symbols} onCheckedChange={setSymbols} />
                <span className="text-muted-foreground">Include symbols</span>
              </label>
            )}
          </div>
        </div>
      </ToolPanel>
      <ToolPanel
        title="Generated"
        actions={
          <>
            <CopyButton value={output} />
            <Button size="sm" variant="outline" onClick={generate}>
              <RefreshCw className="h-4 w-4" /> Regenerate
            </Button>
          </>
        }
      >
        <pre className="font-mono-editor max-h-[420px] min-h-[240px] overflow-auto whitespace-pre-wrap break-all">
          {output || <span className="text-muted-foreground">Output will appear here…</span>}
        </pre>
      </ToolPanel>
    </div>
  );
}

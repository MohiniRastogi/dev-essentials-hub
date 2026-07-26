import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Mode = "asc" | "desc" | "length" | "random";

const MODES: { value: Mode; label: string }[] = [
  { value: "asc", label: "A → Z" },
  { value: "desc", label: "Z → A" },
  { value: "length", label: "By length" },
  { value: "random", label: "Shuffle" },
];

export function SortLines() {
  const [text, setText] = useState("banana\nApple\ncherry\ndate");
  const [mode, setMode] = useState<Mode>("asc");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [numeric, setNumeric] = useState(true);
  const [seed, setSeed] = useState(0);

  const output = useMemo(() => {
    const lines = text.split(/\r\n|\r|\n/).filter((l) => l.trim() !== "");
    if (mode === "random") {
      const arr = [...lines];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join("\n");
    }
    if (mode === "length") return [...lines].sort((a, b) => a.length - b.length).join("\n");
    const collator = new Intl.Collator(undefined, {
      numeric,
      sensitivity: caseSensitive ? "variant" : "base",
    });
    const sorted = [...lines].sort(collator.compare);
    return (mode === "desc" ? sorted.reverse() : sorted).join("\n");
    // seed forces a re-shuffle when the user clicks the mode again
  }, [text, mode, caseSensitive, numeric, seed]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Options">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <Button
                key={m.value}
                size="sm"
                variant={mode === m.value ? "default" : "outline"}
                onClick={() => {
                  setMode(m.value);
                  if (m.value === "random") setSeed((s) => s + 1);
                }}
              >
                {m.label}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} />
            <span className="text-muted-foreground">Case sensitive</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={numeric} onCheckedChange={setNumeric} />
            <span className="text-muted-foreground">Natural number order</span>
          </label>
        </div>
      </ToolPanel>
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel title="Input">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="font-mono-editor min-h-[300px] resize-none border-0 bg-transparent focus-visible:ring-0"
          />
        </ToolPanel>
        <ToolPanel
          title="Sorted"
          actions={
            <>
              <CopyButton value={output} />
              <Button size="sm" variant="outline" disabled={!output} onClick={() => downloadText("sorted.txt", output)}>
                <Download className="h-4 w-4" /> Download
              </Button>
            </>
          }
        >
          <pre className="font-mono-editor min-h-[300px] overflow-auto whitespace-pre-wrap break-all">
            {output || <span className="text-muted-foreground">Output will appear here…</span>}
          </pre>
        </ToolPanel>
      </div>
    </div>
  );
}

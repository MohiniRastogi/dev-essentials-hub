import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";

type Mode = "characters" | "words" | "lines";

const MODES: { value: Mode; label: string }[] = [
  { value: "characters", label: "Characters" },
  { value: "words", label: "Words" },
  { value: "lines", label: "Lines" },
];

export function ReverseText() {
  const [text, setText] = useState("Developer Toolkit\nSecond line here");
  const [mode, setMode] = useState<Mode>("characters");

  const output = useMemo(() => {
    if (mode === "characters") return [...text].reverse().join("");
    if (mode === "words")
      return text
        .split(/\r\n|\r|\n/)
        .map((line) => line.split(/(\s+)/).reverse().join(""))
        .join("\n");
    return text.split(/\r\n|\r|\n/).reverse().join("\n");
  }, [text, mode]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Mode">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <Button key={m.value} size="sm" variant={mode === m.value ? "default" : "outline"} onClick={() => setMode(m.value)}>
              {m.label}
            </Button>
          ))}
        </div>
      </ToolPanel>
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel title="Input">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="font-mono-editor min-h-[240px] resize-none border-0 bg-transparent focus-visible:ring-0"
          />
        </ToolPanel>
        <ToolPanel title="Reversed" actions={<CopyButton value={output} />}>
          <pre className="font-mono-editor min-h-[240px] overflow-auto whitespace-pre-wrap break-all">
            {output || <span className="text-muted-foreground">Output will appear here…</span>}
          </pre>
        </ToolPanel>
      </div>
    </div>
  );
}

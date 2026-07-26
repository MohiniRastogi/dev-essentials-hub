import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function RemoveDuplicateLines() {
  const [text, setText] = useState("alpha\nbeta\nAlpha\nbeta\n\ngamma");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trim, setTrim] = useState(true);
  const [dropEmpty, setDropEmpty] = useState(true);

  const { output, removed } = useMemo(() => {
    const lines = text.split(/\r\n|\r|\n/);
    const seen = new Set<string>();
    const kept: string[] = [];
    for (const raw of lines) {
      const line = trim ? raw.trim() : raw;
      if (dropEmpty && line.trim() === "") continue;
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      kept.push(line);
    }
    return { output: kept.join("\n"), removed: lines.length - kept.length };
  }, [text, caseSensitive, trim, dropEmpty]);

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-2 text-sm">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-muted-foreground">{label}</span>
    </label>
  );

  return (
    <div className="grid gap-4">
      <ToolPanel title="Options">
        <div className="flex flex-wrap gap-6">
          <Toggle label="Case sensitive" checked={caseSensitive} onChange={setCaseSensitive} />
          <Toggle label="Trim lines" checked={trim} onChange={setTrim} />
          <Toggle label="Remove empty lines" checked={dropEmpty} onChange={setDropEmpty} />
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
          title={`Output — ${removed} removed`}
          actions={
            <>
              <CopyButton value={output} />
              <Button size="sm" variant="outline" disabled={!output} onClick={() => downloadText("deduplicated.txt", output)}>
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

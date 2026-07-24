import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Download, Trash2, Wand2 } from "lucide-react";

export function CodeIO({
  input,
  output,
  onInput,
  onRun,
  onClear,
  runLabel = "Run",
  filename,
  mime = "text/plain",
  placeholder,
}: {
  input: string;
  output: string;
  onInput: (v: string) => void;
  onRun: () => void;
  onClear: () => void;
  runLabel?: string;
  filename: string;
  mime?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Input">
        <Textarea
          value={input}
          onChange={(e) => onInput(e.target.value)}
          placeholder={placeholder}
          className="font-mono-editor min-h-[320px] resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </ToolPanel>
      <ToolPanel
        title="Output"
        actions={
          <>
            <CopyButton value={output} />
            <Button size="sm" variant="outline" disabled={!output} onClick={() => downloadText(filename, output, mime)}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </>
        }
      >
        <pre className="font-mono-editor min-h-[320px] overflow-auto whitespace-pre-wrap break-all">
          {output || <span className="text-muted-foreground">Output will appear here…</span>}
        </pre>
      </ToolPanel>
      <div className="lg:col-span-2 flex gap-2">
        <Button onClick={onRun}><Wand2 className="h-4 w-4" /> {runLabel}</Button>
        <Button variant="outline" onClick={onClear}><Trash2 className="h-4 w-4" /> Clear</Button>
      </div>
    </div>
  );
}
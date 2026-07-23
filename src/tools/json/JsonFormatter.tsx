import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { ToolPanel } from "@/components/common/ToolShell";
import { Download, Wand2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      toast.success("Formatted");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Input JSON">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"hello":"world"}'
          className="font-mono-editor min-h-[380px] resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </ToolPanel>
      <ToolPanel
        title="Formatted"
        actions={
          <>
            <CopyButton value={output} />
            <Button variant="outline" size="sm" disabled={!output} onClick={() => downloadText("formatted.json", output, "application/json")}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </>
        }
      >
        <pre className="font-mono-editor min-h-[380px] overflow-auto whitespace-pre-wrap break-words text-foreground">{output || <span className="text-muted-foreground">Formatted JSON will appear here…</span>}</pre>
      </ToolPanel>
      <div className="lg:col-span-2 flex flex-wrap items-center gap-2">
        <Button onClick={format}><Wand2 className="h-4 w-4" /> Format</Button>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card/50 px-3 py-1.5 text-sm">
          Indent
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="bg-transparent outline-none">
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={0}>Tab</option>
          </select>
        </div>
        <Button variant="outline" onClick={() => { setInput(""); setOutput(""); }}>
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
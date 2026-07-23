import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Download, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export function JsonMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      toast.success("Minified");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Input JSON">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"hello": "world"}' className="font-mono-editor min-h-[360px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>
      <ToolPanel
        title="Minified"
        actions={
          <>
            <CopyButton value={output} />
            <Button variant="outline" size="sm" disabled={!output} onClick={() => downloadText("min.json", output, "application/json")}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </>
        }
      >
        <pre className="font-mono-editor min-h-[360px] overflow-auto whitespace-pre-wrap break-all">{output || <span className="text-muted-foreground">Minified output…</span>}</pre>
      </ToolPanel>
      <div className="lg:col-span-2 flex flex-wrap gap-2">
        <Button onClick={minify}><Wand2 className="h-4 w-4" /> Minify</Button>
        <Button variant="outline" onClick={() => { setInput(""); setOutput(""); }}><Trash2 className="h-4 w-4" /> Clear</Button>
        {output && <span className="ml-2 self-center text-sm text-muted-foreground">Saved {Math.max(0, input.length - output.length)} chars ({Math.round(((input.length - output.length) / Math.max(input.length, 1)) * 100)}%)</span>}
      </div>
    </div>
  );
}
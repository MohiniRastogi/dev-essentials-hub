import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export function Base64Tool({ mode }: { mode: "encode" | "decode" }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const run = () => {
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        let bin = "";
        bytes.forEach((b) => (bin += String.fromCharCode(b)));
        setOutput(btoa(bin));
      } else {
        const bin = atob(input.trim());
        const bytes = new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
        setOutput(new TextDecoder().decode(bytes));
      }
      toast.success(mode === "encode" ? "Encoded" : "Decoded");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title={mode === "encode" ? "Text" : "Base64"}>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="font-mono-editor min-h-[300px] resize-none border-0 bg-transparent focus-visible:ring-0" placeholder={mode === "encode" ? "Type text to encode…" : "Paste Base64 to decode…"} />
      </ToolPanel>
      <ToolPanel title={mode === "encode" ? "Base64" : "Text"} actions={<CopyButton value={output} />}>
        <pre className="font-mono-editor min-h-[300px] overflow-auto whitespace-pre-wrap break-all">{output || <span className="text-muted-foreground">Output will appear here…</span>}</pre>
      </ToolPanel>
      <div className="lg:col-span-2 flex gap-2">
        <Button onClick={run}><Wand2 className="h-4 w-4" /> {mode === "encode" ? "Encode" : "Decode"}</Button>
        <Button variant="outline" onClick={() => { setInput(""); setOutput(""); }}><Trash2 className="h-4 w-4" /> Clear</Button>
      </div>
    </div>
  );
}
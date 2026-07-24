import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";

function encode(s: string) {
  return s.replace(/[&<>"'`=/]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    "`": "&#96;", "=": "&#61;", "/": "&#47;",
  }[c] as string));
}

function decode(s: string) {
  const doc = new DOMParser().parseFromString(s, "text/html");
  return doc.documentElement.textContent ?? "";
}

export function HtmlEntityTool({ mode }: { mode: "encode" | "decode" }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const run = () => {
    try {
      setOutput(mode === "encode" ? encode(input) : decode(input));
      toast.success(mode === "encode" ? "Encoded" : "Decoded");
    } catch (e) { toast.error((e as Error).message); }
  };
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Input">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono-editor min-h-[280px] resize-none border-0 bg-transparent focus-visible:ring-0"
          placeholder={mode === "encode" ? "<div>Hello & welcome</div>" : "&lt;div&gt;Hello &amp; welcome&lt;/div&gt;"}
        />
      </ToolPanel>
      <ToolPanel title="Output" actions={<CopyButton value={output} />}>
        <pre className="font-mono-editor min-h-[280px] overflow-auto whitespace-pre-wrap break-all">
          {output || <span className="text-muted-foreground">Output will appear here…</span>}
        </pre>
      </ToolPanel>
      <div className="lg:col-span-2 flex gap-2">
        <Button onClick={run}><Wand2 className="h-4 w-4" /> {mode === "encode" ? "Encode" : "Decode"}</Button>
        <Button variant="outline" onClick={() => { setInput(""); setOutput(""); }}>
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
import { useState } from "react";
import Papa from "papaparse";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Download, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export function JsonToCsv() {
  const [input, setInput] = useState('[\n  {"name":"Ada","role":"CTO"},\n  {"name":"Linus","role":"Engineer"}\n]');
  const [csv, setCsv] = useState("");

  const convert = () => {
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data)) throw new Error("Input must be a JSON array of objects.");
      setCsv(Papa.unparse(data));
      toast.success("Converted to CSV");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="JSON array">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="font-mono-editor min-h-[360px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>
      <ToolPanel
        title="CSV"
        actions={
          <>
            <CopyButton value={csv} />
            <Button variant="outline" size="sm" disabled={!csv} onClick={() => downloadText("data.csv", csv, "text/csv")}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </>
        }
      >
        <pre className="font-mono-editor min-h-[360px] overflow-auto whitespace-pre">{csv || <span className="text-muted-foreground">CSV output…</span>}</pre>
      </ToolPanel>
      <div className="lg:col-span-2 flex flex-wrap gap-2">
        <Button onClick={convert}><Wand2 className="h-4 w-4" /> Convert</Button>
        <Button variant="outline" onClick={() => { setInput(""); setCsv(""); }}><Trash2 className="h-4 w-4" /> Clear</Button>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE = `<div style="font-family:sans-serif">
  <h1>Hello world</h1>
  <p>Paste any <strong>HTML</strong> to preview it.</p>
</div>`;

export function HtmlViewer() {
  const [input, setInput] = useState(SAMPLE);
  const [debounced, setDebounced] = useState(SAMPLE);
  const [mode, setMode] = useState<"preview" | "source">("preview");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(input), 300);
    return () => clearTimeout(id);
  }, [input]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="HTML input">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<html>…</html>"
          className="font-mono-editor min-h-[360px] resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </ToolPanel>

      <ToolPanel
        title={mode === "preview" ? "Rendered preview" : "Source view"}
        actions={
          <>
            <div className="mr-1 flex rounded-md border border-border/70 p-0.5">
              {(["preview", "source"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded px-2 py-1 text-xs transition",
                    mode === m ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "preview" ? "Preview" : "Source"}
                </button>
              ))}
            </div>
            <CopyButton value={input} />
            <Button
              size="sm"
              variant="outline"
              disabled={!input}
              onClick={() => {
                downloadText("document.html", input, "text/html");
                toast.success("Downloaded document.html");
              }}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          </>
        }
      >
        {mode === "preview" ? (
          <iframe
            title="HTML preview"
            sandbox="allow-same-origin"
            srcDoc={debounced}
            className="min-h-[360px] w-full rounded-md border border-border/60 bg-white"
          />
        ) : (
          <pre className="font-mono-editor min-h-[360px] overflow-auto whitespace-pre-wrap break-all">
            {debounced || <span className="text-muted-foreground">Nothing to show yet…</span>}
          </pre>
        )}
      </ToolPanel>

      <div className="lg:col-span-2 flex gap-2">
        <Button variant="outline" disabled={!input} onClick={() => setInput("")}>
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
        <p className="self-center text-xs text-muted-foreground">
          Scripts are blocked — the preview runs in a sandboxed iframe without JavaScript execution.
        </p>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/common/ToolShell";
import { CheckCircle2, XCircle } from "lucide-react";

function locateError(json: string, message: string) {
  const match = message.match(/position\s+(\d+)/i);
  if (!match) return null;
  const pos = Number(match[1]);
  const before = json.slice(0, pos);
  const line = before.split("\n").length;
  const column = pos - before.lastIndexOf("\n");
  return { line, column };
}

export function JsonValidator() {
  const [input, setInput] = useState("");
  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      JSON.parse(input);
      return { ok: true as const };
    } catch (e) {
      const msg = (e as Error).message;
      return { ok: false as const, message: msg, position: locateError(input, msg) };
    }
  }, [input]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="JSON to validate">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON…"
          className="font-mono-editor min-h-[320px] resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </ToolPanel>
      <div className="glass-card flex items-start gap-3 p-4">
        {!result ? (
          <p className="text-sm text-muted-foreground">Start typing to validate JSON in real time.</p>
        ) : result.ok ? (
          <>
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-[color:var(--success)]" />
            <div>
              <p className="font-medium">Valid JSON</p>
              <p className="text-sm text-muted-foreground">Your input parses successfully.</p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium">Invalid JSON</p>
              <p className="mt-1 font-mono-editor text-sm text-muted-foreground">{result.message}</p>
              {result.position && (
                <p className="mt-1 text-xs text-muted-foreground">Line {result.position.line}, column {result.position.column}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
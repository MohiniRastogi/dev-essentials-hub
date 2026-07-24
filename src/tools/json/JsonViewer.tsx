import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { ChevronRight, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

function Node({ name, value, depth = 0 }: { name?: string; value: JsonValue; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = value !== null && typeof value === "object";

  if (!isObj) {
    const cls =
      typeof value === "string" ? "text-green-400"
      : typeof value === "number" ? "text-amber-300"
      : typeof value === "boolean" ? "text-purple-400"
      : "text-muted-foreground";
    return (
      <div className="flex gap-2">
        {name !== undefined && <span className="text-sky-300">"{name}"</span>}
        {name !== undefined && <span className="text-muted-foreground">:</span>}
        <span className={cls}>{typeof value === "string" ? `"${value}"` : String(value)}</span>
      </div>
    );
  }

  const isArr = Array.isArray(value);
  const entries = isArr
    ? (value as JsonValue[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, JsonValue>);
  const openC = isArr ? "[" : "{";
  const closeC = isArr ? "]" : "}";

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 hover:text-foreground">
        <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
        {name !== undefined && <><span className="text-sky-300">"{name}"</span><span className="text-muted-foreground">:</span></>}
        <span className="text-muted-foreground">
          {openC}{!open && ` ${entries.length} ${isArr ? "items" : "keys"} ${closeC}`}
        </span>
      </button>
      {open && (
        <div className="ml-1.5 border-l border-border/60 pl-4">
          {entries.map(([k, v]) => (
            <Node key={k} name={isArr ? undefined : k} value={v} depth={depth + 1} />
          ))}
          <div className="text-muted-foreground">{closeC}</div>
        </div>
      )}
    </div>
  );
}

export function JsonViewer() {
  const [text, setText] = useState('{\n  "name": "Toolkit",\n  "items": [1, 2, 3],\n  "active": true,\n  "meta": { "version": "1.0" }\n}');
  const parsed = useMemo(() => {
    try { return { ok: true as const, value: JSON.parse(text) as JsonValue }; }
    catch (e) { return { ok: false as const, error: (e as Error).message }; }
  }, [text]);
  const formatted = useMemo(() => parsed.ok ? JSON.stringify(parsed.value, null, 2) : "", [parsed]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel
        title="JSON"
        actions={
          <Button size="sm" variant="outline" onClick={() => setText("")}><Trash2 className="h-4 w-4" /> Clear</Button>
        }
      >
        <Textarea
          value={text} onChange={(e) => setText(e.target.value)}
          className="font-mono-editor min-h-[320px] resize-none border-0 bg-transparent focus-visible:ring-0"
          placeholder='{"key": "value"}'
        />
        {!parsed.ok && text.trim() && (
          <p className="mt-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
            {parsed.error}
          </p>
        )}
      </ToolPanel>
      <ToolPanel
        title="Tree"
        actions={
          <>
            <CopyButton value={formatted} label="Copy" />
            <Button
              size="sm" variant="outline" disabled={!formatted}
              onClick={() => { downloadText("data.json", formatted, "application/json"); toast.success("Downloaded"); }}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          </>
        }
      >
        <div className="font-mono-editor min-h-[320px] overflow-auto text-sm">
          {parsed.ok
            ? <Node value={parsed.value} />
            : <span className="text-muted-foreground">Enter valid JSON to see the tree…</span>}
        </div>
      </ToolPanel>
    </div>
  );
}
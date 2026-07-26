import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { cn } from "@/lib/utils";

type Diff = { path: string; kind: "added" | "removed" | "changed"; left?: string; right?: string };

function fmt(v: unknown) {
  return typeof v === "string" ? JSON.stringify(v) : JSON.stringify(v) ?? "undefined";
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function diff(a: unknown, b: unknown, path = "$", out: Diff[] = []): Diff[] {
  if (Object.is(a, b)) return out;
  if (isObj(a) && isObj(b) && Array.isArray(a) === Array.isArray(b)) {
    const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
    for (const k of keys) {
      const child = Array.isArray(a) ? `${path}[${k}]` : `${path}.${k}`;
      const hasA = k in a;
      const hasB = k in b;
      if (!hasA) out.push({ path: child, kind: "added", right: fmt(b[k]) });
      else if (!hasB) out.push({ path: child, kind: "removed", left: fmt(a[k]) });
      else diff(a[k], b[k], child, out);
    }
    return out;
  }
  if (JSON.stringify(a) !== JSON.stringify(b)) out.push({ path, kind: "changed", left: fmt(a), right: fmt(b) });
  return out;
}

const SAMPLE_A = `{
  "name": "toolkit",
  "version": "1.0.0",
  "tags": ["json", "css"]
}`;
const SAMPLE_B = `{
  "name": "toolkit",
  "version": "1.1.0",
  "tags": ["json", "text"],
  "license": "MIT"
}`;

export function JsonCompare() {
  const [left, setLeft] = useState(SAMPLE_A);
  const [right, setRight] = useState(SAMPLE_B);

  const result = useMemo(() => {
    let a: unknown;
    let b: unknown;
    try {
      a = JSON.parse(left);
    } catch (e) {
      return { error: `Left JSON: ${(e as Error).message}`, diffs: [] as Diff[] };
    }
    try {
      b = JSON.parse(right);
    } catch (e) {
      return { error: `Right JSON: ${(e as Error).message}`, diffs: [] as Diff[] };
    }
    return { error: null as string | null, diffs: diff(a, b) };
  }, [left, right]);

  const report = result.diffs
    .map((d) => `${d.kind.toUpperCase()} ${d.path}${d.left !== undefined ? ` | left: ${d.left}` : ""}${d.right !== undefined ? ` | right: ${d.right}` : ""}`)
    .join("\n");

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel title="Left JSON">
          <Textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="font-mono-editor min-h-[240px] resize-none border-0 bg-transparent focus-visible:ring-0"
          />
        </ToolPanel>
        <ToolPanel title="Right JSON">
          <Textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="font-mono-editor min-h-[240px] resize-none border-0 bg-transparent focus-visible:ring-0"
          />
        </ToolPanel>
      </div>

      <ToolPanel
        title={result.error ? "Error" : `Differences (${result.diffs.length})`}
        actions={<CopyButton value={report} />}
      >
        {result.error ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : result.diffs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Both documents are identical.</p>
        ) : (
          <ul className="grid gap-2">
            {result.diffs.map((d) => (
              <li key={d.path + d.kind} className="rounded-md border border-border bg-card/40 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[11px] uppercase tracking-wider",
                      d.kind === "added" && "bg-primary/15 text-primary",
                      d.kind === "removed" && "bg-destructive/15 text-destructive",
                      d.kind === "changed" && "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {d.kind}
                  </span>
                  <span className="font-mono-editor text-sm break-all">{d.path}</span>
                </div>
                {(d.left !== undefined || d.right !== undefined) && (
                  <div className="mt-1.5 grid gap-1 font-mono-editor text-xs text-muted-foreground sm:grid-cols-2">
                    {d.left !== undefined && <span className="break-all">left: {d.left}</span>}
                    {d.right !== undefined && <span className="break-all">right: {d.right}</span>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </ToolPanel>
    </div>
  );
}

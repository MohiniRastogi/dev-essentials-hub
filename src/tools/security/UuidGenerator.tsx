import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { RefreshCcw } from "lucide-react";

function newUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>(() => Array.from({ length: 5 }, newUuid));
  const regen = () => setIds(Array.from({ length: count }, newUuid));
  const joined = ids.join("\n");

  return (
    <div className="grid gap-4">
      <ToolPanel
        title={`UUID v4 × ${ids.length}`}
        actions={
          <>
            <CopyButton value={joined} />
            <Button size="sm" onClick={regen}><RefreshCcw className="h-4 w-4" /> Regenerate</Button>
          </>
        }
      >
        <div className="grid gap-1.5">
          {ids.map((id) => (
            <div key={id} className="flex items-center justify-between gap-2 rounded-md bg-secondary/40 px-3 py-2">
              <code className="font-mono-editor break-all">{id}</code>
              <CopyButton value={id} label="" size="sm" variant="ghost" />
            </div>
          ))}
        </div>
      </ToolPanel>
      <div className="glass-card flex flex-wrap items-center gap-3 p-4">
        <label className="text-sm text-muted-foreground">How many</label>
        <input
          type="number"
          min={1}
          max={200}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(200, Number(e.target.value) || 1)))}
          className="w-24 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
        />
      </div>
    </div>
  );
}
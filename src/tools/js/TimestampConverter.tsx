import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Trash2, Clock } from "lucide-react";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card/40 px-3 py-2">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-mono-editor truncate text-sm">{value || "—"}</p>
      </div>
      <CopyButton value={value} label="" size="sm" variant="ghost" />
    </div>
  );
}

function toDate(raw: string): Date | null {
  const t = raw.trim();
  if (!t) return null;
  if (!/^-?\d+$/.test(t)) return null;
  const num = Number(t);
  if (!Number.isFinite(num)) return null;
  const ms = t.replace("-", "").length > 10 ? num : num * 1000;
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function TimestampConverter() {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [human, setHuman] = useState("");

  const date = useMemo(() => toDate(ts), [ts]);
  const fromHuman = useMemo(() => {
    if (!human.trim()) return null;
    const d = new Date(human);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [human]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel
        title="Unix timestamp → date"
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>
              <Clock className="h-4 w-4" /> Now
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setTs("")}><Trash2 className="h-4 w-4" /></Button>
          </>
        }
      >
        <Input value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1700000000" className="font-mono-editor" />
        {ts.trim() && !date && <p className="mt-2 text-sm text-destructive">Enter a valid numeric timestamp (seconds or milliseconds).</p>}
        <div className="mt-3 grid gap-2">
          <Row label="Local time" value={date ? date.toLocaleString() : ""} />
          <Row label="UTC time" value={date ? date.toUTCString() : ""} />
          <Row label="ISO 8601" value={date ? date.toISOString() : ""} />
        </div>
      </ToolPanel>

      <ToolPanel
        title="Date → Unix timestamp"
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => { setHuman(new Date().toISOString().slice(0, 19)); toast.success("Filled with current time"); }}>
              <Clock className="h-4 w-4" /> Now
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setHuman("")}><Trash2 className="h-4 w-4" /></Button>
          </>
        }
      >
        <Input value={human} onChange={(e) => setHuman(e.target.value)} placeholder="2024-01-31 14:20:00" className="font-mono-editor" />
        {human.trim() && !fromHuman && <p className="mt-2 text-sm text-destructive">Unrecognised date. Try 2024-01-31 14:20:00.</p>}
        <div className="mt-3 grid gap-2">
          <Row label="Seconds" value={fromHuman ? String(Math.floor(fromHuman.getTime() / 1000)) : ""} />
          <Row label="Milliseconds" value={fromHuman ? String(fromHuman.getTime()) : ""} />
          <Row label="UTC time" value={fromHuman ? fromHuman.toUTCString() : ""} />
        </div>
      </ToolPanel>
    </div>
  );
}

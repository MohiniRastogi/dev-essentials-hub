import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Trash2, Clock } from "lucide-react";

type Unit = "auto" | "s" | "ms";

function parse(raw: string, unit: Unit) {
  const t = raw.trim();
  if (!t) return { date: null as Date | null, error: null as string | null };
  if (!/^-?\d+$/.test(t)) return { date: null, error: "Only digits are allowed." };
  const num = Number(t);
  if (!Number.isFinite(num)) return { date: null, error: "Number is too large." };
  const digits = t.replace("-", "").length;
  const ms = unit === "ms" ? num : unit === "s" ? num * 1000 : digits > 10 ? num : num * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return { date: null, error: "Timestamp is out of range." };
  return { date: d, error: null };
}

export function UnixTimeConverter() {
  const [value, setValue] = useState(String(Date.now()));
  const [unit, setUnit] = useState<Unit>("auto");
  const { date, error } = useMemo(() => parse(value, unit), [value, unit]);

  const rows: [string, string][] = [
    ["Seconds", date ? String(Math.floor(date.getTime() / 1000)) : ""],
    ["Milliseconds", date ? String(date.getTime()) : ""],
    ["Local", date ? date.toLocaleString() : ""],
    ["UTC", date ? date.toUTCString() : ""],
    ["ISO 8601", date ? date.toISOString() : ""],
    ["Relative", date ? relative(date) : ""],
  ];

  return (
    <div className="grid gap-4">
      <ToolPanel
        title="Unix time"
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => setValue(String(Date.now()))}><Clock className="h-4 w-4" /> Now</Button>
            <Button size="sm" variant="ghost" onClick={() => setValue("")}><Trash2 className="h-4 w-4" /> Clear</Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="1700000000000" className="font-mono-editor min-w-[200px] flex-1" />
          {(["auto", "s", "ms"] as Unit[]).map((u) => (
            <Button key={u} size="sm" variant={unit === u ? "default" : "outline"} onClick={() => setUnit(u)}>
              {u === "auto" ? "Auto" : u === "s" ? "Seconds" : "Millis"}
            </Button>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </ToolPanel>

      <ToolPanel title="Converted">
        <div className="grid gap-2 sm:grid-cols-2">
          {rows.map(([label, v]) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card/40 px-3 py-2">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="font-mono-editor truncate text-sm">{v || "—"}</p>
              </div>
              <CopyButton value={v} label="" size="sm" variant="ghost" />
            </div>
          ))}
        </div>
      </ToolPanel>
    </div>
  );
}

function relative(d: Date) {
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [1000, "second"], [60000, "minute"], [3600000, "hour"], [86400000, "day"], [2592000000, "month"], [31536000000, "year"],
  ];
  let idx = 0;
  for (let i = 0; i < units.length; i++) if (abs >= units[i][0]) idx = i;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  return rtf.format(Math.round(diff / units[idx][0]), units[idx][1]);
}

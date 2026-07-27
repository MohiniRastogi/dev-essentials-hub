import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { hexToRgb, parseRgb, rgbToHex } from "@/lib/tool-logic";
import { Trash2 } from "lucide-react";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card/40 px-3 py-2">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-mono-editor truncate text-sm">{value || "—"}</p>
      </div>
      <CopyButton value={value} label="" size="sm" variant="ghost" disabled={!value} />
    </div>
  );
}

export function HexRgbConverter() {
  const [hex, setHex] = useState("#22C55E");
  const [rgbText, setRgbText] = useState("34, 197, 94");

  const fromHex = useMemo(() => hexToRgb(hex), [hex]);
  const fromRgb = useMemo(() => parseRgb(rgbText), [rgbText]);
  const preview = fromHex ? rgbToHex(fromHex.r, fromHex.g, fromHex.b) : "#000000";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Preview">
        <div className="h-56 rounded-xl border border-border" style={{ background: preview }} />
        <div className="mt-3 flex items-center gap-3">
          <input
            type="color"
            value={preview}
            onChange={(e) => {
              const c = hexToRgb(e.target.value);
              if (!c) return;
              setHex(e.target.value.toUpperCase());
              setRgbText(`${c.r}, ${c.g}, ${c.b}`);
            }}
            className="h-10 w-16 cursor-pointer rounded"
            aria-label="Color picker"
          />
          <Button
            size="sm"
            variant="ghost"
            disabled={!hex && !rgbText}
            onClick={() => {
              setHex("");
              setRgbText("");
              toast.success("Cleared");
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
        </div>
      </ToolPanel>

      <div className="grid gap-4">
        <ToolPanel title="HEX → RGB">
          <Input
            value={hex}
            onChange={(e) => {
              setHex(e.target.value);
              const c = hexToRgb(e.target.value);
              if (c) setRgbText(`${c.r}, ${c.g}, ${c.b}`);
            }}
            placeholder="#22C55E"
            aria-invalid={Boolean(hex.trim() && !fromHex)}
            className="font-mono-editor"
          />
          {hex.trim() && !fromHex && (
            <p className="mt-2 text-sm text-destructive">
              Enter a valid 3 or 6 digit HEX color, for example #22C55E or #2C5.
            </p>
          )}
          <div className="mt-3 grid gap-2">
            <Row label="RGB" value={fromHex ? `rgb(${fromHex.r}, ${fromHex.g}, ${fromHex.b})` : ""} />
            <Row label="Values" value={fromHex ? `${fromHex.r}, ${fromHex.g}, ${fromHex.b}` : ""} />
          </div>
        </ToolPanel>

        <ToolPanel title="RGB → HEX">
          <Input
            value={rgbText}
            onChange={(e) => {
              setRgbText(e.target.value);
              const c = parseRgb(e.target.value);
              if (c) setHex(rgbToHex(c.r, c.g, c.b));
            }}
            placeholder="34, 197, 94"
            aria-invalid={Boolean(rgbText.trim() && !fromRgb)}
            className="font-mono-editor"
          />
          {rgbText.trim() && !fromRgb && (
            <p className="mt-2 text-sm text-destructive">Enter three numbers between 0 and 255, for example 34, 197, 94.</p>
          )}
          <div className="mt-3 grid gap-2">
            <Row label="HEX" value={fromRgb ? rgbToHex(fromRgb.r, fromRgb.g, fromRgb.b) : ""} />
          </div>
        </ToolPanel>
      </div>
    </div>
  );
}

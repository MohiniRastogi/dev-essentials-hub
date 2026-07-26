import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Trash2 } from "lucide-react";

function hexToRgb(hex: string) {
  let h = hex.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function parseRgb(input: string) {
  const nums = input.match(/-?\d+(\.\d+)?/g);
  if (!nums || nums.length < 3) return null;
  const [r, g, b] = nums.slice(0, 3).map(Number);
  if ([r, g, b].some((v) => v < 0 || v > 255)) return null;
  return { r, g, b };
}

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
              setHex(e.target.value.toUpperCase());
              const c = hexToRgb(e.target.value)!;
              setRgbText(`${c.r}, ${c.g}, ${c.b}`);
            }}
            className="h-10 w-16 cursor-pointer rounded"
            aria-label="Color picker"
          />
          <Button size="sm" variant="ghost" onClick={() => { setHex(""); setRgbText(""); }}>
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
            className="font-mono-editor"
          />
          {hex.trim() && !fromHex && <p className="mt-2 text-sm text-destructive">Enter a valid 3 or 6 digit HEX color.</p>}
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
            className="font-mono-editor"
          />
          {rgbText.trim() && !fromRgb && <p className="mt-2 text-sm text-destructive">Enter three values between 0 and 255.</p>}
          <div className="mt-3 grid gap-2">
            <Row label="HEX" value={fromRgb ? rgbToHex(fromRgb.r, fromRgb.g, fromRgb.b) : ""} />
          </div>
        </ToolPanel>
      </div>
    </div>
  );
}

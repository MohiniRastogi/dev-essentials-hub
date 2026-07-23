import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorPickerTool() {
  const [hex, setHex] = useState("#8B5CF6");
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "";

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between rounded-md border border-border bg-card/40 px-3 py-2">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-mono-editor text-sm">{value || "—"}</p>
      </div>
      <CopyButton value={value} label="" size="sm" variant="ghost" />
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <ToolPanel title="Preview">
        <div className="h-72 rounded-xl" style={{ background: hex }} />
      </ToolPanel>
      <ToolPanel title="Color">
        <div className="grid gap-3">
          <div className="flex gap-3">
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-12 w-16 cursor-pointer rounded" />
            <Input value={hex} onChange={(e) => setHex(e.target.value)} className="font-mono-editor" />
          </div>
          <Row label="HEX" value={hex.toUpperCase()} />
          <Row label="RGB" value={rgbStr} />
          <Row label="HSL" value={hslStr} />
        </div>
      </ToolPanel>
    </div>
  );
}
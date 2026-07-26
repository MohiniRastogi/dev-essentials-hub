import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Download } from "lucide-react";

type Kind = "button" | "card" | "shadow" | "glass" | "flexbox" | "grid";
const KINDS: { key: Kind; label: string }[] = [
  { key: "button", label: "Button" },
  { key: "card", label: "Card" },
  { key: "shadow", label: "Shadow" },
  { key: "glass", label: "Glassmorphism" },
  { key: "flexbox", label: "Flexbox" },
  { key: "grid", label: "Grid" },
];

export function CssGenerator() {
  const [kind, setKind] = useState<Kind>("button");
  const [color, setColor] = useState("#8B5CF6");
  const [radius, setRadius] = useState(12);
  const [blur, setBlur] = useState(16);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(0.15);
  const [gap, setGap] = useState(16);
  const [columns, setColumns] = useState(3);

  const { css, style, demo } = useMemo(() => {
    switch (kind) {
      case "button":
        return {
          css: `.button {\n  background: ${color};\n  color: #ffffff;\n  padding: 12px 24px;\n  border: none;\n  border-radius: ${radius}px;\n  font-weight: 600;\n  cursor: pointer;\n  box-shadow: 0 ${Math.round(blur / 3)}px ${blur}px ${spread}px ${color}59;\n  transition: transform .15s ease, box-shadow .15s ease;\n}\n.button:hover {\n  transform: translateY(-1px);\n}`,
          style: { background: color, color: "#fff", padding: "12px 24px", borderRadius: radius, fontWeight: 600, boxShadow: `0 ${Math.round(blur / 3)}px ${blur}px ${spread}px ${color}59` } as React.CSSProperties,
          demo: "single" as const,
        };
      case "card":
        return {
          css: `.card {\n  background: ${color}1a;\n  border: 1px solid ${color}40;\n  border-radius: ${radius}px;\n  padding: 24px;\n  box-shadow: 0 ${Math.round(blur / 2)}px ${blur}px ${spread}px rgba(0,0,0,.18);\n}`,
          style: { background: `${color}1a`, border: `1px solid ${color}40`, borderRadius: radius, padding: 24, boxShadow: `0 ${Math.round(blur / 2)}px ${blur}px ${spread}px rgba(0,0,0,.18)`, width: "100%" },
          demo: "single" as const,
        };
      case "shadow":
        return {
          css: `.shadow {\n  box-shadow: 0 ${Math.round(blur / 2)}px ${blur}px ${spread}px ${color}${toHexAlpha(opacity)};\n  border-radius: ${radius}px;\n}`,
          style: { boxShadow: `0 ${Math.round(blur / 2)}px ${blur}px ${spread}px ${color}${toHexAlpha(opacity)}`, borderRadius: radius, padding: 32, width: "100%", background: "var(--card, #ffffff10)" },
          demo: "single" as const,
        };
      case "glass":
        return {
          css: `.glass {\n  background: rgba(255, 255, 255, ${opacity.toFixed(2)});\n  backdrop-filter: blur(${blur}px);\n  -webkit-backdrop-filter: blur(${blur}px);\n  border: 1px solid rgba(255, 255, 255, ${(opacity + 0.15).toFixed(2)});\n  border-radius: ${radius}px;\n  padding: 24px;\n}`,
          style: { background: `rgba(255,255,255,${opacity})`, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, border: `1px solid rgba(255,255,255,${opacity + 0.15})`, borderRadius: radius, padding: 24, width: "100%" },
          demo: "glass" as const,
        };
      case "flexbox":
        return {
          css: `.flex {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: ${gap}px;\n}`,
          style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap },
          demo: "items" as const,
        };
      case "grid":
      default:
        return {
          css: `.grid {\n  display: grid;\n  grid-template-columns: repeat(${columns}, minmax(0, 1fr));\n  gap: ${gap}px;\n}`,
          style: { display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap },
          demo: "items" as const,
        };
    }
  }, [kind, color, radius, blur, spread, opacity, gap, columns]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Snippet type">
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <Button key={k.key} size="sm" variant={kind === k.key ? "default" : "outline"} onClick={() => setKind(k.key)}>
              {k.label}
            </Button>
          ))}
        </div>
      </ToolPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel title="Live preview">
          <div className="grid min-h-[220px] place-items-center rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 p-6">
            {demo === "items" ? (
              <div style={style} className="w-full">
                {Array.from({ length: kind === "grid" ? columns * 2 : 3 }).map((_, i) => (
                  <div key={i} className="rounded-md p-4 text-center text-sm" style={{ background: `${color}33`, border: `1px solid ${color}55` }}>
                    Item {i + 1}
                  </div>
                ))}
              </div>
            ) : (
              <div style={style} className="text-center text-sm">
                {kind === "button" ? "Click me" : "Preview content"}
              </div>
            )}
          </div>
        </ToolPanel>

        <ToolPanel title="Controls">
          <div className="grid gap-4">
            {(kind !== "flexbox" && kind !== "grid") && (
              <>
                <Control label="Color">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded" />
                </Control>
                <Control label={`Radius — ${radius}px`}>
                  <Slider value={[radius]} min={0} max={48} step={1} onValueChange={([v]) => setRadius(v)} />
                </Control>
                <Control label={`Blur — ${blur}px`}>
                  <Slider value={[blur]} min={0} max={60} step={1} onValueChange={([v]) => setBlur(v)} />
                </Control>
              </>
            )}
            {(kind === "shadow" || kind === "card" || kind === "button") && (
              <Control label={`Spread — ${spread}px`}>
                <Slider value={[spread]} min={-20} max={40} step={1} onValueChange={([v]) => setSpread(v)} />
              </Control>
            )}
            {(kind === "glass" || kind === "shadow") && (
              <Control label={`Opacity — ${opacity.toFixed(2)}`}>
                <Slider value={[opacity]} min={0.02} max={0.9} step={0.01} onValueChange={([v]) => setOpacity(v)} />
              </Control>
            )}
            {(kind === "flexbox" || kind === "grid") && (
              <Control label={`Gap — ${gap}px`}>
                <Slider value={[gap]} min={0} max={48} step={2} onValueChange={([v]) => setGap(v)} />
              </Control>
            )}
            {kind === "grid" && (
              <Control label={`Columns — ${columns}`}>
                <Slider value={[columns]} min={1} max={6} step={1} onValueChange={([v]) => setColumns(v)} />
              </Control>
            )}
          </div>
        </ToolPanel>
      </div>

      <ToolPanel
        title="Generated CSS"
        actions={
          <>
            <CopyButton value={css} label="Copy CSS" />
            <Button size="sm" variant="outline" onClick={() => downloadText(`${kind}.css`, css, "text/css")}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </>
        }
      >
        <pre className="font-mono-editor overflow-auto whitespace-pre-wrap text-sm">{css}</pre>
      </ToolPanel>
    </div>
  );
}

function toHexAlpha(a: number) {
  return Math.round(a * 255).toString(16).padStart(2, "0");
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

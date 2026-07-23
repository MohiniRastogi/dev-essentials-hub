import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { Download } from "lucide-react";

export function QrGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(320);
  const [fg, setFg] = useState("#FAFAFA");
  const [bg, setBg] = useState("#09090B");
  const [svg, setSvg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text) return;
    QRCode.toCanvas(canvasRef.current!, text, { width: size, margin: 2, color: { dark: fg, light: bg } }).catch(() => {});
    QRCode.toString(text, { type: "svg", margin: 2, color: { dark: fg, light: bg } }).then(setSvg).catch(() => {});
  }, [text, size, fg, bg]);

  const downloadPng = () => {
    const url = canvasRef.current!.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url; a.download = "qr.png"; a.click();
  };
  const downloadSvg = () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "qr.svg"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <ToolPanel title="Preview">
        <div className="grid place-items-center rounded-xl p-6" style={{ background: bg }}>
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </ToolPanel>
      <ToolPanel title="Options">
        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Content</span>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <div>
            <div className="mb-2 flex justify-between text-sm"><span>Size</span><span className="font-mono-editor">{size}px</span></div>
            <Slider value={[size]} min={128} max={640} step={8} onValueChange={(v) => setSize(v[0])} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Foreground</span>
              <div className="flex gap-2">
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 w-9 rounded" />
                <Input value={fg} onChange={(e) => setFg(e.target.value)} className="font-mono-editor" />
              </div>
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Background</span>
              <div className="flex gap-2">
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-9 rounded" />
                <Input value={bg} onChange={(e) => setBg(e.target.value)} className="font-mono-editor" />
              </div>
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={downloadPng}><Download className="h-4 w-4" /> PNG</Button>
            <Button variant="outline" onClick={downloadSvg}><Download className="h-4 w-4" /> SVG</Button>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
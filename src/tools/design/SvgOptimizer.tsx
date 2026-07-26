import { useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";
import { Download, Trash2, Upload, Wand2 } from "lucide-react";

function optimizeSvg(src: string) {
  if (!/<svg[\s>]/i.test(src)) throw new Error("That does not look like an SVG document.");
  let out = src
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<desc[\s\S]*?<\/desc>/gi, "")
    .replace(/\s(xmlns:(?!xlink)[\w-]+|sodipodi:[\w-]+|inkscape:[\w-]+)="[^"]*"/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\/>/g, "/>")
    .trim();
  out = out.replace(/(\d+\.\d{3,})/g, (m) => String(+Number(m).toFixed(2)));
  return out;
}

export function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const run = (src: string) => {
    if (!src.trim()) { toast.error("Paste or upload an SVG first"); return; }
    try {
      const min = optimizeSvg(src);
      setOutput(min);
      const saved = Math.max(0, 100 - Math.round((min.length / src.length) * 100));
      toast.success(`Optimized — ${saved}% smaller`);
    } catch (e) {
      setOutput("");
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel
          title="Input SVG"
          actions={
            <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload
            </Button>
          }
        >
          <input
            ref={fileRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 2_000_000) { toast.error("File is larger than 2 MB"); return; }
              const text = await f.text();
              setInput(text);
              run(text);
              e.target.value = "";
            }}
          />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>'
            className="font-mono-editor min-h-[280px] resize-none border-0 bg-transparent focus-visible:ring-0"
          />
        </ToolPanel>

        <ToolPanel
          title="Optimized"
          actions={
            <>
              <CopyButton value={output} />
              <Button size="sm" variant="outline" disabled={!output} onClick={() => downloadText("optimized.svg", output, "image/svg+xml")}>
                <Download className="h-4 w-4" /> Download
              </Button>
            </>
          }
        >
          <pre className="font-mono-editor min-h-[280px] overflow-auto whitespace-pre-wrap break-all text-xs">
            {output || <span className="text-muted-foreground">Optimized SVG will appear here…</span>}
          </pre>
        </ToolPanel>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => run(input)}><Wand2 className="h-4 w-4" /> Optimize</Button>
        <Button variant="outline" onClick={() => { setInput(""); setOutput(""); }}><Trash2 className="h-4 w-4" /> Clear</Button>
      </div>

      {output && (
        <ToolPanel title="Preview">
          <div className="grid min-h-[200px] place-items-center rounded-xl bg-secondary/30 p-4 [&_svg]:max-h-52 [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: output }} />
        </ToolPanel>
      )}
    </div>
  );
}

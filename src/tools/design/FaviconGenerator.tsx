import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { Download, Trash2, Upload } from "lucide-react";

const SIZES = [16, 32, 48, 64, 180];

export function FaviconGenerator() {
  const [src, setSrc] = useState<string | null>(null);
  const [icons, setIcons] = useState<{ size: number; url: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    icons.forEach((i) => URL.revokeObjectURL(i.url));
    setIcons([]);
    setSrc(null);
  };

  const handleFile = async (file: File) => {
    if (!/^image\/(png|jpeg|jpg|svg\+xml|webp)$/.test(file.type)) {
      toast.error("Upload a PNG, JPG, WEBP or SVG image");
      return;
    }
    if (file.size > 5_000_000) {
      toast.error("File is larger than 5 MB");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(new Error("Could not read the file"));
      r.readAsDataURL(file);
    });

    const img = new Image();
    img.onload = () => {
      const generated: { size: number; url: string }[] = [];
      let pending = SIZES.length;
      SIZES.forEach((size) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) { pending--; return; }
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => {
          if (blob) generated.push({ size, url: URL.createObjectURL(blob) });
          pending--;
          if (pending === 0) {
            generated.sort((a, b) => a.size - b.size);
            setIcons(generated);
            setSrc(dataUrl);
            toast.success("Favicons generated");
          }
        }, "image/png");
      });
    };
    img.onerror = () => toast.error("That image could not be loaded");
    img.src = dataUrl;
  };

  const downloadAll = () => {
    icons.forEach((icon, idx) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = icon.url;
        a.download = `favicon-${icon.size}x${icon.size}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, idx * 250);
    });
    toast.success("Downloading all sizes");
  };

  return (
    <div className="grid gap-4">
      <ToolPanel
        title="Source image"
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload
            </Button>
            <Button size="sm" variant="ghost" onClick={reset} disabled={!src}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </>
        }
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="grid min-h-[200px] w-full place-items-center rounded-xl border border-dashed border-border bg-secondary/20 p-6 text-sm text-muted-foreground transition-colors hover:bg-secondary/40"
        >
          {src ? (
            <img src={src} alt="Uploaded favicon source" className="max-h-40 rounded-lg" />
          ) : (
            <span>Click to upload a PNG, JPG, WEBP or SVG</span>
          )}
        </button>
      </ToolPanel>

      <ToolPanel
        title="Generated sizes"
        actions={
          <Button size="sm" onClick={downloadAll} disabled={!icons.length}>
            <Download className="h-4 w-4" /> Download all
          </Button>
        }
      >
        {icons.length === 0 ? (
          <p className="text-sm text-muted-foreground">Upload an image to generate 16, 32, 48, 64 and 180 pixel favicons.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {icons.map((icon) => (
              <div key={icon.size} className="grid place-items-center gap-2 rounded-lg border border-border bg-card/40 p-4">
                <img src={icon.url} width={icon.size} height={icon.size} alt={`${icon.size} by ${icon.size} favicon preview`} />
                <p className="font-mono-editor text-xs text-muted-foreground">{icon.size}×{icon.size}</p>
                <a
                  href={icon.url}
                  download={`favicon-${icon.size}x${icon.size}.png`}
                  className="text-xs text-primary hover:underline"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </ToolPanel>
    </div>
  );
}

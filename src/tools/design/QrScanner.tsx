import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Camera, Upload, Trash2, ExternalLink, StopCircle } from "lucide-react";
import { toast } from "sonner";

function isUrl(s: string) {
  try { const u = new URL(s); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; }
}

export function QrScanner() {
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setScanning(true);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      const tick = () => {
        if (!streamRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(img.data, img.width, img.height);
          if (code && code.data) {
            setResult(code.data);
            toast.success("QR code detected");
            stopCamera();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      toast.error("Camera access denied or unavailable");
      console.error(e);
    }
  };

  const onFile = async (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const code = jsQR(data.data, data.width, data.height);
      if (code && code.data) {
        setResult(code.data);
        toast.success("QR code detected");
      } else {
        toast.error("No QR code found in image");
      }
    } catch {
      toast.error("Failed to read image");
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel
        title="Scanner"
        actions={
          scanning ? (
            <Button size="sm" variant="outline" onClick={stopCamera}><StopCircle className="h-4 w-4" /> Stop</Button>
          ) : (
            <Button size="sm" onClick={startCamera}><Camera className="h-4 w-4" /> Start camera</Button>
          )
        }
      >
        <div className="grid place-items-center rounded-xl bg-secondary/40 p-2 min-h-[280px]">
          <video ref={videoRef} className="max-h-[360px] w-full rounded-lg" muted playsInline />
        </div>
        <div className="mt-3 flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" /> Upload image
          </Button>
        </div>
      </ToolPanel>
      <ToolPanel
        title="Result"
        actions={
          <>
            <CopyButton value={result} />
            <Button size="sm" variant="outline" onClick={() => setResult("")}><Trash2 className="h-4 w-4" /> Clear</Button>
          </>
        }
      >
        <pre className="font-mono-editor min-h-[200px] whitespace-pre-wrap break-all">
          {result || <span className="text-muted-foreground">Decoded content will appear here…</span>}
        </pre>
        {result && isUrl(result) && (
          <Button className="mt-3" variant="outline" onClick={() => window.open(result, "_blank", "noopener,noreferrer")}>
            <ExternalLink className="h-4 w-4" /> Open URL
          </Button>
        )}
      </ToolPanel>
    </div>
  );
}
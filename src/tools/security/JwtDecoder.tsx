import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";

function b64urlDecode(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
}

export function JwtDecoder() {
  const [token, setToken] = useState("");

  const parts = useMemo(() => {
    if (!token.trim()) return null;
    const segments = token.trim().split(".");
    if (segments.length < 2) return { error: "A JWT must contain at least header.payload.signature." };
    try {
      const header = JSON.parse(b64urlDecode(segments[0]));
      const payload = JSON.parse(b64urlDecode(segments[1]));
      return { header, payload, signature: segments[2] ?? "" };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [token]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="JWT">
        <Textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" className="font-mono-editor min-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>
      {parts && "error" in parts && (
        <div className="glass-card p-4 text-sm text-destructive">{parts.error}</div>
      )}
      {parts && "header" in parts && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ToolPanel title="Header" actions={<CopyButton value={JSON.stringify(parts.header, null, 2)} />}>
            <pre className="font-mono-editor min-h-[200px] overflow-auto whitespace-pre-wrap">{JSON.stringify(parts.header, null, 2)}</pre>
          </ToolPanel>
          <ToolPanel title="Payload" actions={<CopyButton value={JSON.stringify(parts.payload, null, 2)} />}>
            <pre className="font-mono-editor min-h-[200px] overflow-auto whitespace-pre-wrap">{JSON.stringify(parts.payload, null, 2)}</pre>
          </ToolPanel>
          <ToolPanel title="Signature (not verified)" className="lg:col-span-2">
            <pre className="font-mono-editor overflow-auto whitespace-pre-wrap break-all text-muted-foreground">{parts.signature || "(none)"}</pre>
          </ToolPanel>
        </div>
      )}
    </div>
  );
}
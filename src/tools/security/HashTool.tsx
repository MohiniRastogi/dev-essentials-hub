import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-512" | "MD5";

async function hash(algo: Algorithm, input: string): Promise<string> {
  if (algo === "MD5") return CryptoJS.MD5(input).toString();
  if (typeof crypto === "undefined" || !("subtle" in crypto)) {
    if (algo === "SHA-1") return CryptoJS.SHA1(input).toString();
    if (algo === "SHA-256") return CryptoJS.SHA256(input).toString();
    return CryptoJS.SHA512(input).toString();
  }
  const bytes = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest(algo, bytes);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function HashTool({ algorithm }: { algorithm: Algorithm }) {
  const [input, setInput] = useState("");
  const [digest, setDigest] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!input) {
      setDigest("");
      return;
    }
    hash(algorithm, input).then((d) => {
      if (!cancelled) setDigest(d);
    });
    return () => {
      cancelled = true;
    };
  }, [input, algorithm]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Input">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text…" className="font-mono-editor min-h-[220px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>
      <ToolPanel title={`${algorithm} digest`} actions={<CopyButton value={digest} />}>
        <code className="font-mono-editor block break-all rounded-md bg-secondary/40 px-3 py-3 text-sm">{digest || <span className="text-muted-foreground">Digest will appear here…</span>}</code>
      </ToolPanel>
    </div>
  );
}
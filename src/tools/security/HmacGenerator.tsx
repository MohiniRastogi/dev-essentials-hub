import { useState } from "react";
import CryptoJS from "crypto-js";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Hash, Trash2 } from "lucide-react";

const ALGORITHMS = ["SHA-256", "SHA-512", "SHA-1", "MD5"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

function hmac(algorithm: Algorithm, message: string, key: string) {
  switch (algorithm) {
    case "SHA-256":
      return CryptoJS.HmacSHA256(message, key);
    case "SHA-512":
      return CryptoJS.HmacSHA512(message, key);
    case "SHA-1":
      return CryptoJS.HmacSHA1(message, key);
    default:
      return CryptoJS.HmacMD5(message, key);
  }
}

export function HmacGenerator() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hex, setHex] = useState("");
  const [base64, setBase64] = useState("");

  const run = () => {
    if (!message) {
      toast.error("Enter a message to sign");
      return;
    }
    if (!secret) {
      toast.error("Enter a secret key");
      return;
    }
    try {
      const digest = hmac(algorithm, message, secret);
      setHex(digest.toString(CryptoJS.enc.Hex));
      setBase64(digest.toString(CryptoJS.enc.Base64));
      toast.success(`HMAC-${algorithm} generated`);
    } catch (e) {
      toast.error((e as Error).message || "Could not generate HMAC");
    }
  };

  const clear = () => {
    setMessage("");
    setSecret("");
    setHex("");
    setBase64("");
  };

  return (
    <div className="grid gap-4">
      <ToolPanel title="Message">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Payload to sign…"
          className="font-mono-editor min-h-[180px] resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </ToolPanel>

      <ToolPanel title="Options">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Secret key</span>
            <Input value={secret} onChange={(e) => setSecret(e.target.value)} className="font-mono-editor" placeholder="my-secret" />
          </label>
          <div className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Algorithm</span>
            <div className="flex flex-wrap gap-2">
              {ALGORITHMS.map((a) => (
                <Button key={a} size="sm" variant={a === algorithm ? "default" : "outline"} onClick={() => setAlgorithm(a)}>
                  {a}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={run} disabled={!message || !secret}>
            <Hash className="h-4 w-4" /> Generate
          </Button>
          <Button variant="outline" onClick={clear} disabled={!message && !secret && !hex}>
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
        </div>
      </ToolPanel>

      <ToolPanel title="Hex" actions={<CopyButton value={hex} disabled={!hex} />}>
        <code className="font-mono-editor block break-all rounded-md bg-secondary/40 px-3 py-3 text-sm">
          {hex || <span className="text-muted-foreground">Signature will appear here…</span>}
        </code>
      </ToolPanel>
      <ToolPanel title="Base64" actions={<CopyButton value={base64} disabled={!base64} />}>
        <code className="font-mono-editor block break-all rounded-md bg-secondary/40 px-3 py-3 text-sm">
          {base64 || <span className="text-muted-foreground">Signature will appear here…</span>}
        </code>
      </ToolPanel>
    </div>
  );
}

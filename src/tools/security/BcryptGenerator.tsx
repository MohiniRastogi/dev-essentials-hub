import { useState } from "react";
import bcrypt from "bcryptjs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Hash, ShieldCheck, Trash2 } from "lucide-react";

export function BcryptGenerator() {
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [busy, setBusy] = useState(false);

  const [compareHash, setCompareHash] = useState("");
  const [comparePassword, setComparePassword] = useState("");
  const [match, setMatch] = useState<boolean | null>(null);

  const generate = async () => {
    if (!password) {
      toast.error("Enter a password to hash");
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      toast.error("bcrypt only uses the first 72 bytes — shorten the password");
      return;
    }
    setBusy(true);
    try {
      const salt = await bcrypt.genSalt(rounds);
      setHash(await bcrypt.hash(password, salt));
      toast.success(`Hashed with ${rounds} rounds`);
    } catch (e) {
      toast.error((e as Error).message || "Hashing failed");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (!comparePassword || !compareHash.trim()) {
      toast.error("Enter both a password and a bcrypt hash");
      return;
    }
    if (!/^\$2[aby]?\$\d{2}\$/.test(compareHash.trim())) {
      toast.error("That does not look like a bcrypt hash (expected $2a$/$2b$…)");
      return;
    }
    setBusy(true);
    try {
      const ok = await bcrypt.compare(comparePassword, compareHash.trim());
      setMatch(ok);
      ok ? toast.success("Password matches the hash") : toast.error("Password does not match");
    } catch (e) {
      setMatch(null);
      toast.error((e as Error).message || "Comparison failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4">
      <ToolPanel title="Generate hash">
        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Password</span>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="correct horse battery staple"
              className="font-mono-editor"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Cost / rounds: {rounds}</span>
            <Slider value={[rounds]} min={4} max={14} step={1} onValueChange={([v]) => setRounds(v)} />
          </label>
          <div className="flex gap-2">
            <Button onClick={generate} disabled={busy || !password}>
              <Hash className="h-4 w-4" /> {busy ? "Hashing…" : "Generate"}
            </Button>
            <Button
              variant="outline"
              disabled={busy || (!password && !hash)}
              onClick={() => {
                setPassword("");
                setHash("");
              }}
            >
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </div>
        </div>
      </ToolPanel>

      <ToolPanel title="Bcrypt hash" actions={<CopyButton value={hash} disabled={!hash} />}>
        <code className="font-mono-editor block break-all rounded-md bg-secondary/40 px-3 py-3 text-sm">
          {hash || <span className="text-muted-foreground">Hash will appear here…</span>}
        </code>
      </ToolPanel>

      <ToolPanel title="Verify a password against a hash">
        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Password</span>
            <Input value={comparePassword} onChange={(e) => setComparePassword(e.target.value)} className="font-mono-editor" />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Bcrypt hash</span>
            <Input
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder="$2b$10$…"
              className="font-mono-editor"
            />
          </label>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={verify} disabled={busy}>
              <ShieldCheck className="h-4 w-4" /> Verify
            </Button>
            {match !== null && (
              <span className={match ? "text-sm text-primary" : "text-sm text-destructive"}>
                {match ? "Match" : "No match"}
              </span>
            )}
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}

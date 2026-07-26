import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Eye, EyeOff, Trash2 } from "lucide-react";

const LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

function analyze(pw: string) {
  const sets = [
    { re: /[a-z]/, size: 26, tip: "Add lowercase letters" },
    { re: /[A-Z]/, size: 26, tip: "Add uppercase letters" },
    { re: /\d/, size: 10, tip: "Add numbers" },
    { re: /[^a-zA-Z0-9]/, size: 33, tip: "Add symbols like !@#$" },
  ];
  let pool = 0;
  const suggestions: string[] = [];
  for (const s of sets) {
    if (s.re.test(pw)) pool += s.size;
    else suggestions.push(s.tip);
  }
  const entropy = pw.length && pool ? +(pw.length * Math.log2(pool)).toFixed(1) : 0;
  if (pw.length < 12) suggestions.unshift("Use at least 12 characters");
  if (/(.)\1{2,}/.test(pw)) suggestions.push("Avoid repeated characters");
  if (/^\d+$/.test(pw) && pw.length > 0) suggestions.push("Avoid digit-only passwords");
  if (/(password|qwerty|1234|admin|letmein)/i.test(pw)) suggestions.push("Avoid common words and sequences");

  let level = 0;
  if (entropy >= 36) level = 1;
  if (entropy >= 60) level = 2;
  if (entropy >= 80) level = 3;
  if (entropy >= 110) level = 4;
  if (/(password|qwerty|1234|admin|letmein)/i.test(pw)) level = Math.min(level, 1);

  const guesses = entropy ? Math.pow(2, entropy) : 0;
  const crack = entropy ? humanTime(guesses / 2 / 1e10) : "—";
  return { entropy, level, suggestions, crack, pool };
}

function humanTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "centuries";
  const steps: [number, string][] = [
    [60, "seconds"], [3600, "minutes"], [86400, "hours"], [2592000, "days"], [31536000, "months"], [3153600000, "years"],
  ];
  if (seconds < 1) return "instantly";
  let value = seconds, unit = "seconds";
  for (let i = 0; i < steps.length; i++) {
    if (seconds < steps[i][0]) { value = seconds / (i === 0 ? 1 : steps[i - 1][0]); unit = steps[i][1]; break; }
    value = seconds / steps[i][0]; unit = i === steps.length - 1 ? "centuries" : steps[i][1];
  }
  if (value > 1e6) return "millions of years";
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${unit}`;
}

export function PasswordStrength() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const a = useMemo(() => analyze(pw), [pw]);

  const summary = pw
    ? `Strength: ${LABELS[a.level]} · Entropy: ${a.entropy} bits · Est. crack time: ${a.crack}`
    : "";

  return (
    <div className="grid gap-4">
      <ToolPanel
        title="Password"
        actions={
          <>
            <Button size="sm" variant="ghost" onClick={() => setShow((s) => !s)}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPw("")}><Trash2 className="h-4 w-4" /> Clear</Button>
          </>
        }
      >
        <Input
          type={show ? "text" : "password"}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Type a password to analyse"
          className="font-mono-editor"
          autoComplete="off"
        />
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-full bg-secondary/60"
              style={pw && i <= a.level ? { background: COLORS[a.level] } : undefined}
            />
          ))}
        </div>
        <p className="mt-2 text-sm" style={pw ? { color: COLORS[a.level] } : undefined}>
          {pw ? LABELS[a.level] : <span className="text-muted-foreground">Awaiting input…</span>}
        </p>
      </ToolPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel title="Analysis" actions={<CopyButton value={summary} label="Copy score" />}>
          <div className="grid gap-2 text-sm">
            <Stat label="Length" value={String(pw.length)} />
            <Stat label="Character pool" value={String(a.pool)} />
            <Stat label="Entropy" value={`${a.entropy} bits`} />
            <Stat label="Est. offline crack time" value={a.crack} />
          </div>
        </ToolPanel>
        <ToolPanel title="Suggestions">
          {pw && a.suggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Looks great — nothing to improve.</p>
          ) : (
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {(pw ? a.suggestions : ["Enter a password to get suggestions"]).map((s) => <li key={s}>{s}</li>)}
            </ul>
          )}
        </ToolPanel>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card/40 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono-editor">{value}</span>
    </div>
  );
}

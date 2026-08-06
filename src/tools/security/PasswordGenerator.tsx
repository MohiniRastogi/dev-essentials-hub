import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Info, RefreshCcw } from "lucide-react";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
};
const SIMILAR = /[il1Lo0O]/g;
const AMBIGUOUS = /[{}[\]()/\\'"`~,;:.<>]/g;

function randomInt(max: number) {
  if (max <= 0) return 0;
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % max;
}

/** Pick 2–4 letters from the name, styled to the enabled character sets. */
function nameFragment(
  name: string,
  maxLen: number,
  opts: { lower: boolean; upper: boolean },
) {
  const letters = name.replace(/[^a-zA-Z]/g, "");
  if (!letters || maxLen < 2) return "";
  const take = Math.min(letters.length, maxLen, 2 + randomInt(3)); // 2–4
  const start = randomInt(Math.max(1, letters.length - take + 1));
  const slice = letters.slice(start, start + take);
  return slice
    .split("")
    .map((c) => {
      if (opts.lower && opts.upper) return randomInt(2) === 0 ? c.toLowerCase() : c.toUpperCase();
      if (opts.upper) return c.toUpperCase();
      if (opts.lower) return c.toLowerCase();
      return c;
    })
    .join("");
}

function generate(opts: {
  length: number; lower: boolean; upper: boolean; digits: boolean; symbols: boolean;
  excludeSimilar: boolean; excludeAmbiguous: boolean; name?: string;
}) {
  let pool = "";
  if (opts.lower) pool += SETS.lower;
  if (opts.upper) pool += SETS.upper;
  if (opts.digits) pool += SETS.digits;
  if (opts.symbols) pool += SETS.symbols;
  if (opts.excludeSimilar) pool = pool.replace(SIMILAR, "");
  if (opts.excludeAmbiguous) pool = pool.replace(AMBIGUOUS, "");
  if (!pool) return "";

  // Name-derived part is capped to a minority (max ~1/3) of the password.
  const fragment = (opts.name ?? "").trim()
    ? nameFragment((opts.name ?? "").trim(), Math.floor(opts.length / 3), opts)
    : "";

  const randomCount = opts.length - fragment.length;
  const arr = new Uint32Array(Math.max(randomCount, 0));
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < randomCount; i++) out += pool[arr[i] % pool.length];
  if (!fragment) return out;
  const at = randomInt(out.length + 1);
  return out.slice(0, at) + fragment + out.slice(at);
}


function scorePassword(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (pw.length >= 16) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return Math.min(s, 5);
}
const LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#22c55e", "#3b82f6"];

export function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const nameRef = useRef("");
  nameRef.current = name;

  const opts = useMemo(() => ({ length, lower, upper, digits, symbols, excludeSimilar, excludeAmbiguous }), [length, lower, upper, digits, symbols, excludeSimilar, excludeAmbiguous]);

  useEffect(() => { setPw(generate({ ...opts, name: nameRef.current })); }, [opts]);
  const score = scorePassword(pw);

  return (
    <div className="grid gap-4">
      <ToolPanel
        title="Generated password"
        actions={
          <>
            <CopyButton value={pw} />
            <Button size="sm" onClick={() => setPw(generate({ ...opts, name }))}><RefreshCcw className="h-4 w-4" /> Generate</Button>
          </>
        }
      >

        <div className="font-mono-editor break-all rounded-md bg-secondary/40 px-4 py-4 text-lg">{pw || <span className="text-muted-foreground">Enable at least one character set</span>}</div>
        <div className="mt-3 flex items-center gap-3 text-xs">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/40">
            <div className="h-full transition-all" style={{ width: `${(score / 5) * 100}%`, backgroundColor: COLORS[score] }} />
          </div>
          <span style={{ color: COLORS[score] }}>{LABELS[score]}</span>
        </div>
      </ToolPanel>

      <ToolPanel title="Options">
        <div className="grid gap-5">
          <div>
            <Label htmlFor="pw-name" className="text-sm">Your name (optional)</Label>
            <Input
              id="pw-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mohini"
              autoComplete="off"
              className="mt-2"
            />
            <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              For security, only part of your password is based on your name — the rest is random.
            </p>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm"><span>Length</span><span className="font-mono-editor">{length}</span></div>
            <Slider value={[length]} onValueChange={(v) => setLength(v[0])} min={6} max={64} step={1} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Row label="Uppercase (A–Z)" checked={upper} onChange={setUpper} />
            <Row label="Lowercase (a–z)" checked={lower} onChange={setLower} />
            <Row label="Digits (0–9)" checked={digits} onChange={setDigits} />
            <Row label="Symbols" checked={symbols} onChange={setSymbols} />
            <Row label="Exclude similar (i,l,1,L,o,0,O)" checked={excludeSimilar} onChange={setExcludeSimilar} />
            <Row label="Exclude ambiguous ({}[]()/\)" checked={excludeAmbiguous} onChange={setExcludeAmbiguous} />
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-border bg-card/40 px-3 py-2 text-sm">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
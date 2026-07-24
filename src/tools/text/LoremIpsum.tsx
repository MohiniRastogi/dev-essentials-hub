import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { cn } from "@/lib/utils";

const WORDS = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum").split(" ");

const rand = (n: number) => Math.floor(Math.random() * n);
const words = (n: number) => Array.from({ length: n }, () => WORDS[rand(WORDS.length)]).join(" ");
function sentence() {
  const n = 6 + rand(10);
  const s = words(n);
  return s[0].toUpperCase() + s.slice(1) + ".";
}
function paragraph() {
  return Array.from({ length: 3 + rand(4) }, sentence).join(" ");
}

type Unit = "paragraphs" | "sentences" | "words";

export function LoremIpsum() {
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(0);

  const text = useMemo(() => {
    void seed;
    if (unit === "words") return words(count);
    if (unit === "sentences") return Array.from({ length: count }, sentence).join(" ");
    return Array.from({ length: count }, paragraph).join("\n\n");
  }, [unit, count, seed]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Options">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-md border border-border bg-secondary/40 p-1">
            {(["paragraphs", "sentences", "words"] as Unit[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={cn("rounded px-3 py-1.5 text-xs capitalize", unit === u ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground")}
              >{u}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Count</span>
            <input
              type="number" min={1} max={100} value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
              className="w-24 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
            />
          </label>
          <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>Regenerate</Button>
        </div>
      </ToolPanel>
      <ToolPanel title="Output" actions={<CopyButton value={text} />}>
        <pre className="min-h-[240px] whitespace-pre-wrap break-words leading-relaxed">{text}</pre>
      </ToolPanel>
    </div>
  );
}
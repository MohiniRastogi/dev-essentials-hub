import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Trash2 } from "lucide-react";

const FLAGS = ["g", "i", "m", "s"] as const;

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact us at hello@example.com or team@dev.io.");

  const toggleFlag = (f: string) =>
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));

  const { error, matches, highlighted } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const found: { match: string; index: number }[] = [];
      if (flags.includes("g")) {
        for (const m of text.matchAll(re)) found.push({ match: m[0], index: m.index ?? 0 });
      } else {
        const m = re.exec(text);
        if (m) found.push({ match: m[0], index: m.index });
      }
      let out = "";
      let last = 0;
      for (const m of found) {
        if (m.index < last) continue;
        out += escapeHtml(text.slice(last, m.index));
        out += `<mark class="rounded bg-primary/30 text-foreground px-0.5">${escapeHtml(m.match)}</mark>`;
        last = m.index + Math.max(m.match.length, 0);
      }
      out += escapeHtml(text.slice(last));
      return { error: null as string | null, matches: found, highlighted: out };
    } catch (e) {
      return { error: (e as Error).message, matches: [], highlighted: escapeHtml(text) };
    }
  }, [pattern, flags, text]);

  return (
    <div className="grid gap-4">
      <ToolPanel
        title="Pattern"
        actions={
          <>
            <CopyButton value={pattern ? `/${pattern}/${flags}` : ""} label="Copy regex" />
            <Button size="sm" variant="ghost" onClick={() => { setPattern(""); setText(""); }}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-2">
          <span className="font-mono-editor text-muted-foreground">/</span>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono-editor" placeholder="pattern" />
          <span className="font-mono-editor text-muted-foreground">/</span>
          <Input value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))} className="w-24 font-mono-editor" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <Button key={f} size="sm" variant={flags.includes(f) ? "default" : "outline"} onClick={() => toggleFlag(f)}>
              {f}
            </Button>
          ))}
        </div>
        {error ? (
          <p className="mt-2 text-sm text-destructive">Invalid pattern: {error}</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {pattern ? (matches.length ? `${matches.length} match${matches.length === 1 ? "" : "es"} found` : "No matches") : "Enter a pattern to begin"}
          </p>
        )}
      </ToolPanel>

      <ToolPanel title="Test string">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>

      <ToolPanel title={`Matches (${matches.length})`} actions={<CopyButton value={matches.map((m) => m.match).join("\n")} label="Copy matches" />}>
        <pre className="font-mono-editor whitespace-pre-wrap break-words text-sm" dangerouslySetInnerHTML={{ __html: highlighted || "(no input)" }} />
      </ToolPanel>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

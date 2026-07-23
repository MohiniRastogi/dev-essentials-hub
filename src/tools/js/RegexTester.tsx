import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/common/ToolShell";

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact us at hello@example.com or team@dev.io.");

  const { error, matches, highlighted } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; index: number }[] = [];
      if (flags.includes("g")) {
        for (const m of text.matchAll(re)) matches.push({ match: m[0], index: m.index ?? 0 });
      } else {
        const m = re.exec(text);
        if (m) matches.push({ match: m[0], index: m.index });
      }
      let out = "";
      let last = 0;
      for (const m of matches) {
        out += escapeHtml(text.slice(last, m.index));
        out += `<mark class="rounded bg-primary/30 text-primary-foreground px-0.5">${escapeHtml(m.match)}</mark>`;
        last = m.index + m.match.length;
      }
      out += escapeHtml(text.slice(last));
      return { error: null as string | null, matches, highlighted: out };
    } catch (e) {
      return { error: (e as Error).message, matches: [], highlighted: escapeHtml(text) };
    }
  }, [pattern, flags, text]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Pattern">
        <div className="flex items-center gap-2">
          <span className="font-mono-editor text-muted-foreground">/</span>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono-editor" />
          <span className="font-mono-editor text-muted-foreground">/</span>
          <Input value={flags} onChange={(e) => setFlags(e.target.value)} className="w-24 font-mono-editor" />
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </ToolPanel>
      <ToolPanel title="Test string">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>
      <ToolPanel title={`Matches (${matches.length})`}>
        <pre className="font-mono-editor whitespace-pre-wrap break-words text-sm" dangerouslySetInnerHTML={{ __html: highlighted || "(no input)" }} />
      </ToolPanel>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
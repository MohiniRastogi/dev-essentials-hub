import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/common/ToolShell";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-card/40 px-3 py-2.5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-mono-editor text-xl">{value.toLocaleString()}</p>
    </div>
  );
}

export function CharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = [...text];
    return {
      characters: chars.length,
      withoutSpaces: chars.filter((c) => !/\s/.test(c)).length,
      letters: chars.filter((c) => /\p{L}/u.test(c)).length,
      digits: chars.filter((c) => /\p{Nd}/u.test(c)).length,
      spaces: chars.filter((c) => /\s/.test(c)).length,
      punctuation: chars.filter((c) => /[\p{P}\p{S}]/u.test(c)).length,
      lines: text === "" ? 0 : text.split(/\r\n|\r|\n/).length,
      bytes: new TextEncoder().encode(text).length,
    };
  }, [text]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Text">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste text…"
          className="min-h-[220px] resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </ToolPanel>
      <ToolPanel title="Counts">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Characters" value={stats.characters} />
          <Stat label="No spaces" value={stats.withoutSpaces} />
          <Stat label="Letters" value={stats.letters} />
          <Stat label="Digits" value={stats.digits} />
          <Stat label="Spaces" value={stats.spaces} />
          <Stat label="Punctuation" value={stats.punctuation} />
          <Stat label="Lines" value={stats.lines} />
          <Stat label="UTF-8 bytes" value={stats.bytes} />
        </div>
      </ToolPanel>
    </div>
  );
}

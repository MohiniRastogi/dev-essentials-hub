import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/common/ToolShell";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border bg-card/40 px-3 py-2.5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-mono-editor text-xl">{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  );
}

export function ParagraphCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const sentences = text.split(/[.!?…]+(?=\s|$)/).map((s) => s.trim()).filter(Boolean);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return {
      paragraphs: paragraphs.length,
      sentences: sentences.length,
      words,
      avgWordsPerSentence: sentences.length ? (words / sentences.length).toFixed(1) : "0",
      avgSentencesPerParagraph: paragraphs.length ? (sentences.length / paragraphs.length).toFixed(1) : "0",
      longestParagraph: paragraphs.reduce((max, p) => Math.max(max, p.split(/\s+/).length), 0),
    };
  }, [text]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Text">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a few paragraphs…"
          className="min-h-[220px] resize-none border-0 bg-transparent focus-visible:ring-0"
        />
      </ToolPanel>
      <ToolPanel title="Structure">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Paragraphs" value={stats.paragraphs} />
          <Stat label="Sentences" value={stats.sentences} />
          <Stat label="Words" value={stats.words} />
          <Stat label="Words / sentence" value={stats.avgWordsPerSentence} />
          <Stat label="Sentences / paragraph" value={stats.avgSentencesPerParagraph} />
          <Stat label="Longest paragraph (words)" value={stats.longestParagraph} />
        </div>
      </ToolPanel>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/common/ToolShell";

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+\s/).filter(Boolean).length : 0;
    const readingMin = Math.max(1, Math.round(words / 225));
    const speakingMin = Math.max(1, Math.round(words / 150));
    return { chars, charsNoSpaces, words, paragraphs, sentences, readingMin, speakingMin };
  }, [text]);

  const Stat = ({ label, value }: { label: string; value: string | number }) => (
    <div className="glass-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );

  return (
    <div className="grid gap-4">
      <ToolPanel title="Your text">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing…" className="min-h-[240px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="No spaces" value={stats.charsNoSpaces} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading time" value={`${stats.readingMin} min`} />
        <Stat label="Speaking time" value={`${stats.speakingMin} min`} />
      </div>
    </div>
  );
}
import { useState } from "react";
import { toast } from "sonner";
import { CodeIO } from "@/tools/_shared/CodeIO";

const MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtmlString(s: string) {
  return s.replace(/[&<>"']/g, (c) => MAP[c]);
}

export function HtmlEscape() {
  const [input, setInput] = useState(`<a href="/x" title='hi'>Tom & Jerry</a>`);
  const [output, setOutput] = useState("");

  const run = () => {
    if (!input.trim()) {
      toast.error("Enter a string to escape");
      return;
    }
    setOutput(escapeHtmlString(input));
    toast.success("String escaped");
  };

  return (
    <div className="grid gap-4">
      <div className="glass-card p-4 text-sm text-muted-foreground">
        <p>
          <span className="text-foreground">HTML Escape</span> converts only the five characters that can break out of
          markup — <code className="font-mono-editor">&amp;</code>, <code className="font-mono-editor">&lt;</code>,{" "}
          <code className="font-mono-editor">&gt;</code>, <code className="font-mono-editor">"</code> and{" "}
          <code className="font-mono-editor">'</code> — so a string is safe to drop inside an HTML attribute or render as
          literal text. Use <span className="text-foreground">HTML Encoder</span> instead when you want a full entity
          encoding of the whole document, including slashes, backticks and equals signs.
        </p>
      </div>
      <CodeIO
        input={input}
        output={output}
        onInput={setInput}
        onRun={run}
        onClear={() => {
          setInput("");
          setOutput("");
        }}
        runLabel="Escape"
        filename="escaped.txt"
        mime="text/plain"
        placeholder={`<a href="/x">Tom & Jerry</a>`}
      />
    </div>
  );
}

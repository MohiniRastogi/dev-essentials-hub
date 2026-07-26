import { useState } from "react";
import { CodeIO } from "@/tools/_shared/CodeIO";
import { toast } from "sonner";

export function JsonEscapeTool({ mode }: { mode: "escape" | "unescape" }) {
  const [input, setInput] = useState(
    mode === "escape" ? 'He said "hello"\nNew line\tTabbed' : '"He said \\"hello\\"\\nNew line\\tTabbed"',
  );
  const [output, setOutput] = useState("");

  const run = () => {
    try {
      if (mode === "escape") {
        const escaped = JSON.stringify(input);
        setOutput(escaped.slice(1, -1));
      } else {
        const trimmed = input.trim();
        const wrapped = trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed : `"${trimmed}"`;
        const parsed = JSON.parse(wrapped);
        if (typeof parsed !== "string") throw new Error("Input is not a JSON string");
        setOutput(parsed);
      }
    } catch (e) {
      setOutput("");
      toast.error((e as Error).message);
    }
  };

  return (
    <CodeIO
      input={input}
      output={output}
      onInput={setInput}
      onRun={run}
      onClear={() => {
        setInput("");
        setOutput("");
      }}
      runLabel={mode === "escape" ? "Escape" : "Unescape"}
      filename={mode === "escape" ? "escaped.txt" : "unescaped.txt"}
      placeholder={mode === "escape" ? "Paste raw text…" : "Paste an escaped JSON string…"}
    />
  );
}

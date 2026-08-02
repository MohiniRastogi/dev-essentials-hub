import { useState } from "react";
import { CodeIO } from "@/tools/_shared/CodeIO";
import { toast } from "sonner";

/** Pretty-prints raw console output: JSON blobs get indented, noise trimmed. */
function formatConsole(raw: string) {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Split "prefix { json }" into prefix + pretty JSON when possible.
    const start = trimmed.search(/[[{]/);
    if (start !== -1) {
      const candidate = trimmed.slice(start);
      try {
        const parsed = JSON.parse(candidate);
        const prefix = trimmed.slice(0, start).trim();
        if (prefix) out.push(prefix);
        out.push(JSON.stringify(parsed, null, 2));
        continue;
      } catch {
        // fall through to plain output
      }
    }

    // Collapse stack-trace frames into an indented block.
    if (/^at\s+/.test(trimmed)) {
      out.push("    " + trimmed);
      continue;
    }
    out.push(trimmed);
  }

  return out.join("\n");
}

export function ConsoleFormatter() {
  const [input, setInput] = useState(
    'LOG  fetch ok {"id":1,"name":"Ada","roles":["admin","dev"]}\nERROR  TypeError: x is not a function\n    at run (app.js:12:5)',
  );
  const [output, setOutput] = useState("");

  const run = () => {
    if (!input.trim()) {
      toast.error("Paste some console output first");
      return;
    }
    const result = formatConsole(input);
    if (!result) {
      toast.error("Nothing to format");
      return;
    }
    setOutput(result);
    toast.success("Console output formatted");
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
      runLabel="Format"
      filename="console.log"
      placeholder="Paste raw console / log output…"
    />
  );
}

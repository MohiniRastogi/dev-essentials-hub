import { useState } from "react";
import { CodeIO } from "@/tools/_shared/CodeIO";
import { toast } from "sonner";

function minifyCss(src: string) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const run = () => {
    try { setOutput(minifyCss(input)); toast.success("CSS minified"); }
    catch (e) { toast.error((e as Error).message); }
  };
  return (
    <CodeIO
      input={input} output={output}
      onInput={setInput} onRun={run}
      onClear={() => { setInput(""); setOutput(""); }}
      runLabel="Minify" filename="minified.css" mime="text/css"
      placeholder="body { … }"
    />
  );
}
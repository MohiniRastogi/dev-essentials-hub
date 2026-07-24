import { useState } from "react";
import beautify from "js-beautify";
import { CodeIO } from "@/tools/_shared/CodeIO";
import { toast } from "sonner";

export function CssBeautifier() {
  const [input, setInput] = useState("body{margin:0;padding:0;color:#fff;}");
  const [output, setOutput] = useState("");
  const run = () => {
    try { setOutput(beautify.css(input, { indent_size: 2 })); toast.success("CSS beautified"); }
    catch (e) { toast.error((e as Error).message); }
  };
  return (
    <CodeIO
      input={input} output={output}
      onInput={setInput} onRun={run}
      onClear={() => { setInput(""); setOutput(""); }}
      runLabel="Beautify" filename="beautified.css" mime="text/css"
      placeholder="body { … }"
    />
  );
}
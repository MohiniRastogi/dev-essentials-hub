import { useState } from "react";
import beautify from "js-beautify";
import { CodeIO } from "@/tools/_shared/CodeIO";
import { toast } from "sonner";

export function HtmlBeautifier() {
  const [input, setInput] = useState("<div><p>Hello <strong>world</strong></p></div>");
  const [output, setOutput] = useState("");
  const run = () => {
    try {
      setOutput(beautify.html(input, { indent_size: 2, wrap_line_length: 0, preserve_newlines: true }));
      toast.success("HTML beautified");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  return (
    <CodeIO
      input={input} output={output}
      onInput={setInput} onRun={run}
      onClear={() => { setInput(""); setOutput(""); }}
      runLabel="Beautify" filename="beautified.html" mime="text/html"
      placeholder="<html>…</html>"
    />
  );
}
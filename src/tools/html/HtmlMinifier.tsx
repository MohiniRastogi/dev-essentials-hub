import { useState } from "react";
import { CodeIO } from "@/tools/_shared/CodeIO";
import { toast } from "sonner";

function minifyHtml(src: string) {
  return src
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+>/g, ">")
    .replace(/<\s+/g, "<")
    .trim();
}

export function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const run = () => {
    try { setOutput(minifyHtml(input)); toast.success("HTML minified"); }
    catch (e) { toast.error((e as Error).message); }
  };
  return (
    <CodeIO
      input={input} output={output}
      onInput={setInput} onRun={run}
      onClear={() => { setInput(""); setOutput(""); }}
      runLabel="Minify" filename="minified.html" mime="text/html"
      placeholder="<html>…</html>"
    />
  );
}
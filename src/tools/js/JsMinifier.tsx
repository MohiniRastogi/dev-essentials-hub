import { useState } from "react";
import { toast } from "sonner";
import { CodeIO } from "@/tools/_shared/CodeIO";

export function minifyJs(src: string) {
  let out = "";
  let i = 0;
  const n = src.length;
  let prev = "";
  while (i < n) {
    const c = src[i];
    const next = src[i + 1];
    // line comment
    if (c === "/" && next === "/") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    // block comment
    if (c === "/" && next === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++;
      if (i >= n) throw new Error("Unterminated block comment");
      i += 2;
      continue;
    }
    // strings + templates
    if (c === '"' || c === "'" || c === "`") {
      let s = c;
      i++;
      while (i < n) {
        if (src[i] === "\\") { s += src[i] + (src[i + 1] ?? ""); i += 2; continue; }
        s += src[i];
        if (src[i] === c) { i++; break; }
        i++;
        if (i >= n) throw new Error("Unterminated string literal");
      }
      out += s;
      prev = c;
      continue;
    }
    // whitespace collapse
    if (/\s/.test(c)) {
      let j = i;
      while (j < n && /\s/.test(src[j])) j++;
      const after = src[j] ?? "";
      const needs = /[\w$)\]}'"`]/.test(prev) && /[\w$([{'"`+\-/]/.test(after);
      if (needs) { out += " "; prev = " "; }
      i = j;
      continue;
    }
    out += c;
    prev = c;
    i++;
  }
  return out.replace(/;\s*}/g, "}").trim();
}

export function JsMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <CodeIO
      input={input}
      output={output}
      onInput={setInput}
      onRun={() => {
        if (!input.trim()) { toast.error("Paste some JavaScript first"); return; }
        try {
          new Function(input);
        } catch (e) {
          toast.error(`Syntax error: ${(e as Error).message}`);
          return;
        }
        try {
          const min = minifyJs(input);
          setOutput(min);
          const saved = Math.max(0, 100 - Math.round((min.length / input.length) * 100));
          toast.success(`Minified — ${saved}% smaller`);
        } catch (e) {
          toast.error((e as Error).message);
        }
      }}
      onClear={() => { setInput(""); setOutput(""); }}
      runLabel="Minify"
      filename="script.min.js"
      mime="text/javascript"
      placeholder="function hello(name) {\n  console.log('hi', name)\n}"
    />
  );
}

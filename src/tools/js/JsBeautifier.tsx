import { useState } from "react";
import beautify from "js-beautify";
import { CodeIO } from "@/tools/_shared/CodeIO";
import { toast } from "sonner";

export function JsBeautifier() {
  const [input, setInput] = useState('function hi(name){if(!name){return "hello"}return "hello "+name}');
  const [output, setOutput] = useState("");

  const run = () => {
    if (!input.trim()) {
      toast.error("Paste some JavaScript first");
      return;
    }
    try {
      setOutput(
        beautify.js(input, {
          indent_size: 2,
          space_in_empty_paren: false,
          preserve_newlines: true,
          max_preserve_newlines: 2,
        }),
      );
      toast.success("JavaScript beautified");
    } catch (e) {
      toast.error((e as Error).message || "Could not beautify this input");
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
      runLabel="Beautify"
      filename="beautified.js"
      mime="text/javascript"
      placeholder="function example() { … }"
    />
  );
}

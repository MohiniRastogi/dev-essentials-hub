import { useState } from "react";
import { CodeIO } from "@/tools/_shared/CodeIO";
import { toast } from "sonner";

export function unicodeEncode(input: string) {
  return Array.from(input)
    .map((ch) => {
      const cp = ch.codePointAt(0)!;
      if (cp < 128 && cp !== 92) return ch;
      if (cp > 0xffff) {
        const high = Math.floor((cp - 0x10000) / 0x400) + 0xd800;
        const low = ((cp - 0x10000) % 0x400) + 0xdc00;
        return `\\u${high.toString(16).padStart(4, "0")}\\u${low.toString(16).padStart(4, "0")}`;
      }

      return `\\u${cp.toString(16).padStart(4, "0")}`;
    })
    .join("");
}

export function unicodeDecode(input: string) {
  if (/\\u(?![0-9a-fA-F]{4})/.test(input) && !/\\u\{[0-9a-fA-F]+\}/.test(input)) {
    throw new Error("Invalid escape sequence — \\u must be followed by 4 hex digits");
  }
  return input
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\\\/g, "\\");
}

export function UnicodeTool({ mode }: { mode: "encode" | "decode" }) {
  const encoding = mode === "encode";
  const [input, setInput] = useState(encoding ? "Héllo — 世界 🚀" : "H\\u00e9llo \\u2014 \\u4e16\\u754c");
  const [output, setOutput] = useState("");

  const run = () => {
    if (!input.trim()) {
      toast.error("Enter some text first");
      return;
    }
    try {
      setOutput(encoding ? unicodeEncode(input) : unicodeDecode(input));
      toast.success(encoding ? "Encoded to Unicode escapes" : "Decoded Unicode escapes");
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
      runLabel={encoding ? "Encode" : "Decode"}
      filename={encoding ? "unicode-encoded.txt" : "unicode-decoded.txt"}
      placeholder={encoding ? "Text with accents, emoji, CJK…" : "\\u0048\\u0065\\u006c\\u006c\\u006f"}
    />
  );
}

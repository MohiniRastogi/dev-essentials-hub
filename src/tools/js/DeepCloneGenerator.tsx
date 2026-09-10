import { useMemo, useState } from "react";
import { ToolPanel } from "@/components/common/ToolShell";
import { CodeOutput, Field, inputClass } from "./_shared/CodeOutput";

const SAMPLE = `{
  "name": "config",
  "nested": { "list": [1, 2, { "deep": true }] },
  "created": "2024-01-01"
}`;

export function DeepCloneGenerator() {
  const [fnName, setFnName] = useState("deepClone");
  const [useStructured, setUseStructured] = useState(true);
  const [handleDates, setHandleDates] = useState(true);
  const [handleMaps, setHandleMaps] = useState(true);
  const [esm, setEsm] = useState(true);
  const [input, setInput] = useState(SAMPLE);

  const safeName = /^[A-Za-z_$][\w$]*$/.test(fnName.trim()) ? fnName.trim() : "deepClone";

  const code = useMemo(() => {
    const lines: string[] = [];
    lines.push(`${esm ? "export " : ""}function ${safeName}(value) {`);
    if (useStructured) {
      lines.push(`  if (typeof structuredClone === "function") {`);
      lines.push(`    try {`);
      lines.push(`      return structuredClone(value);`);
      lines.push(`    } catch (err) {`);
      lines.push(`      // Falls through to the recursive clone (e.g. functions, DOM nodes).`);
      lines.push(`    }`);
      lines.push(`  }`);
      lines.push(``);
    }
    lines.push(`  return cloneRecursive(value, new WeakMap());`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`function cloneRecursive(value, seen) {`);
    lines.push(`  if (value === null || typeof value !== "object") return value;`);
    lines.push(`  if (seen.has(value)) return seen.get(value);`);
    if (handleDates) {
      lines.push(``);
      lines.push(`  if (value instanceof Date) return new Date(value.getTime());`);
      lines.push(`  if (value instanceof RegExp) return new RegExp(value.source, value.flags);`);
    }
    if (handleMaps) {
      lines.push(``);
      lines.push(`  if (value instanceof Map) {`);
      lines.push(`    const map = new Map();`);
      lines.push(`    seen.set(value, map);`);
      lines.push(`    value.forEach((v, k) => map.set(cloneRecursive(k, seen), cloneRecursive(v, seen)));`);
      lines.push(`    return map;`);
      lines.push(`  }`);
      lines.push(``);
      lines.push(`  if (value instanceof Set) {`);
      lines.push(`    const set = new Set();`);
      lines.push(`    seen.set(value, set);`);
      lines.push(`    value.forEach((v) => set.add(cloneRecursive(v, seen)));`);
      lines.push(`    return set;`);
      lines.push(`  }`);
    }
    lines.push(``);
    lines.push(`  if (Array.isArray(value)) {`);
    lines.push(`    const arr = [];`);
    lines.push(`    seen.set(value, arr);`);
    lines.push(`    for (let i = 0; i < value.length; i++) arr[i] = cloneRecursive(value[i], seen);`);
    lines.push(`    return arr;`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  const out = Object.create(Object.getPrototypeOf(value));`);
    lines.push(`  seen.set(value, out);`);
    lines.push(`  for (const key of Object.keys(value)) {`);
    lines.push(`    out[key] = cloneRecursive(value[key], seen);`);
    lines.push(`  }`);
    lines.push(`  return out;`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`// Example usage`);
    lines.push(`const original = { user: { name: "Ada", tags: ["admin"] } };`);
    lines.push(`const copy = ${safeName}(original);`);
    lines.push(`copy.user.tags.push("editor");`);
    lines.push(`console.log(original.user.tags); // ["admin"] — untouched`);
    lines.push(`console.log(copy.user.tags);     // ["admin", "editor"]`);
    return lines.join("\n");
  }, [safeName, useStructured, handleDates, handleMaps, esm]);

  const preview = useMemo(() => {
    if (!input.trim()) return { ok: false, text: "Paste JSON to test the clone." };
    try {
      const parsed = JSON.parse(input);
      const clone =
        typeof structuredClone === "function" ? structuredClone(parsed) : JSON.parse(JSON.stringify(parsed));
      const independent = clone !== parsed;
      return {
        ok: true,
        text: `${JSON.stringify(clone, null, 2)}\n\n// New reference: ${independent ? "yes" : "no"}`,
      };
    } catch {
      return { ok: false, text: "Invalid JSON — check for a missing comma or quote." };
    }
  }, [input]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Field label="Function name">
            <input value={fnName} onChange={(e) => setFnName(e.target.value)} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useStructured} onChange={(e) => setUseStructured(e.target.checked)} />
            Use structuredClone when available
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={handleDates} onChange={(e) => setHandleDates(e.target.checked)} />
            Handle Date and RegExp
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={handleMaps} onChange={(e) => setHandleMaps(e.target.checked)} />
            Handle Map and Set
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={esm} onChange={(e) => setEsm(e.target.checked)} />
            Add <code className="font-mono-editor">export</code> keyword
          </label>
          <Field label="Test data (JSON)">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="font-mono-editor min-h-40 w-full rounded-md border border-border bg-card/40 p-2 text-sm text-foreground"
            />
          </Field>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <pre
          className={`font-mono-editor max-h-96 overflow-auto whitespace-pre-wrap break-words text-sm ${
            preview.ok ? "" : "text-muted-foreground"
          }`}
        >
          {preview.text}
        </pre>
      </ToolPanel>

      <CodeOutput
        title="Generated JavaScript"
        code={code}
        filename="deep-clone.js"
        mime="text/javascript"
        className="lg:col-span-2"
      />
    </div>
  );
}

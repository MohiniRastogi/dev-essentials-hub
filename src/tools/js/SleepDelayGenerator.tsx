import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/common/ToolShell";
import { CodeOutput, Field, inputClass } from "./_shared/CodeOutput";

export function SleepDelayGenerator() {
  const [fnName, setFnName] = useState("sleep");
  const [defaultMs, setDefaultMs] = useState(1000);
  const [abortable, setAbortable] = useState(true);
  const [withRetry, setWithRetry] = useState(false);
  const [esm, setEsm] = useState(true);

  const [previewMs, setPreviewMs] = useState(1200);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const safeName = /^[A-Za-z_$][\w$]*$/.test(fnName.trim()) ? fnName.trim() : "sleep";
  const safeDefault = Math.max(0, Math.min(600000, Number.isFinite(defaultMs) ? defaultMs : 1000));

  const code = useMemo(() => {
    const lines: string[] = [];
    if (abortable) {
      lines.push(`${esm ? "export " : ""}function ${safeName}(ms = ${safeDefault}, signal) {`);
      lines.push(`  return new Promise((resolve, reject) => {`);
      lines.push(`    if (signal?.aborted) return reject(signal.reason ?? new Error("Aborted"));`);
      lines.push(``);
      lines.push(`    const timer = setTimeout(() => {`);
      lines.push(`      signal?.removeEventListener("abort", onAbort);`);
      lines.push(`      resolve();`);
      lines.push(`    }, ms);`);
      lines.push(``);
      lines.push(`    function onAbort() {`);
      lines.push(`      clearTimeout(timer);`);
      lines.push(`      reject(signal.reason ?? new Error("Aborted"));`);
      lines.push(`    }`);
      lines.push(``);
      lines.push(`    signal?.addEventListener("abort", onAbort, { once: true });`);
      lines.push(`  });`);
      lines.push(`}`);
    } else {
      lines.push(`${esm ? "export " : ""}function ${safeName}(ms = ${safeDefault}) {`);
      lines.push(`  return new Promise((resolve) => setTimeout(resolve, ms));`);
      lines.push(`}`);
    }

    if (withRetry) {
      lines.push(``);
      lines.push(`${esm ? "export " : ""}async function retry(task, attempts = 3, delayMs = ${safeDefault}) {`);
      lines.push(`  let lastError;`);
      lines.push(`  for (let attempt = 1; attempt <= attempts; attempt++) {`);
      lines.push(`    try {`);
      lines.push(`      return await task(attempt);`);
      lines.push(`    } catch (error) {`);
      lines.push(`      lastError = error;`);
      lines.push(`      if (attempt < attempts) await ${safeName}(delayMs * attempt);`);
      lines.push(`    }`);
      lines.push(`  }`);
      lines.push(`  throw lastError;`);
      lines.push(`}`);
    }

    lines.push(``);
    lines.push(`// Example usage`);
    lines.push(`async function loadWithDelay() {`);
    lines.push(`  console.log("loading...");`);
    lines.push(`  await ${safeName}(${safeDefault});`);
    lines.push(`  console.log("done after ${safeDefault}ms");`);
    lines.push(`}`);
    if (abortable) {
      lines.push(``);
      lines.push(`// Cancel a pending delay`);
      lines.push(`const controller = new AbortController();`);
      lines.push(`${safeName}(5000, controller.signal).catch((err) => console.log(err.message));`);
      lines.push(`controller.abort();`);
    }
    if (withRetry) {
      lines.push(``);
      lines.push(`// Retry with backoff`);
      lines.push(`retry(() => fetch("/api/data").then((r) => r.json()), 3, 500);`);
    }
    return lines.join("\n");
  }, [safeName, safeDefault, abortable, withRetry, esm]);

  async function runPreview() {
    const ms = Math.max(0, Math.min(10000, previewMs));
    setRunning(true);
    setLog([`0ms — started, awaiting ${safeName}(${ms})`]);
    const started = performance.now();
    await new Promise((resolve) => setTimeout(resolve, ms));
    const elapsed = Math.round(performance.now() - started);
    setLog((l) => [...l, `${elapsed}ms — resolved, execution continues`]);
    setRunning(false);
    toast.success(`Delay resolved after ${elapsed}ms`);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Field label="Function name">
            <input value={fnName} onChange={(e) => setFnName(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Default delay (ms)">
            <input
              type="number"
              min={0}
              max={600000}
              value={defaultMs}
              onChange={(e) => setDefaultMs(parseInt(e.target.value, 10) || 0)}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={abortable} onChange={(e) => setAbortable(e.target.checked)} />
            Support cancellation with AbortSignal
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={withRetry} onChange={(e) => setWithRetry(e.target.checked)} />
            Include retry-with-backoff helper
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={esm} onChange={(e) => setEsm(e.target.checked)} />
            Add <code className="font-mono-editor">export</code> keyword
          </label>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <div className="grid gap-3">
          <Field label="Try a delay (ms, max 10000)">
            <input
              type="number"
              min={0}
              max={10000}
              value={previewMs}
              onChange={(e) => setPreviewMs(parseInt(e.target.value, 10) || 0)}
              className={inputClass}
            />
          </Field>
          <Button size="sm" onClick={runPreview} disabled={running} className="w-fit">
            {running ? "Waiting…" : "Run delay"}
          </Button>
          <pre className="font-mono-editor min-h-24 whitespace-pre-wrap rounded-xl border border-border bg-card/40 p-3 text-sm">
            {log.length ? log.join("\n") : "Run the delay to see the timing log."}
          </pre>
        </div>
      </ToolPanel>

      <CodeOutput
        title="Generated JavaScript"
        code={code}
        filename="sleep.js"
        mime="text/javascript"
        className="lg:col-span-2"
      />
    </div>
  );
}

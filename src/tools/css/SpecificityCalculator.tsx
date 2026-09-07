import { useMemo, useState } from "react";
import { ToolPanel } from "@/components/common/ToolShell";
import { Control } from "./_shared/CssOutput";
import { CopyButton } from "@/components/common/CopyButton";

export interface Specificity {
  ids: number;
  classes: number;
  types: number;
}

export function calcSpecificity(selector: string): Specificity {
  let s = selector.trim();
  if (!s) return { ids: 0, classes: 0, types: 0 };
  // strip strings and comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/"[^"]*"|'[^']*'/g, '""');
  const ids = (s.match(/#[-\w]+/g) || []).length;
  const classes =
    (s.match(/\.[-\w]+/g) || []).length +
    (s.match(/\[[^\]]*\]/g) || []).length +
    (s.match(/:(?!:)(?!not\b|is\b|where\b|has\b)[-\w]+(\([^)]*\))?/g) || []).length;
  const types =
    (s.replace(/#[-\w]+|\.[-\w]+|\[[^\]]*\]|:{1,2}[-\w]+(\([^)]*\))?/g, " ").match(/\b[a-zA-Z][-\w]*\b/g) || []).length +
    (s.match(/::[-\w]+/g) || []).length;
  return { ids, classes, types };
}

export function SpecificityCalculator() {
  const [input, setInput] = useState("#app .card > ul li a:hover");

  const rows = useMemo(
    () =>
      input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const sp = calcSpecificity(s);
          return { selector: s, sp, score: sp.ids * 100 + sp.classes * 10 + sp.types };
        })
        .sort((a, b) => b.score - a.score),
    [input],
  );

  const summary = rows.map((r) => `${r.selector} → (${r.sp.ids},${r.sp.classes},${r.sp.types})`).join("\n");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="CSS selector">
        <Control label="Paste one or more selectors (comma separated)">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            spellCheck={false}
            placeholder="#app .card > ul li a:hover"
            className="w-full rounded-md border border-border bg-card/40 p-3 font-mono-editor text-sm text-foreground"
          />
        </Control>
        <p className="mt-3 text-xs text-muted-foreground">
          Specificity is read as (IDs, classes/attributes/pseudo-classes, elements/pseudo-elements). Higher wins.
        </p>
      </ToolPanel>

      <ToolPanel
        title="Specificity"
        actions={<CopyButton value={summary} label="Copy" disabled={!summary} />}
      >
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Enter a selector to calculate its specificity.</p>
        ) : (
          <div className="grid gap-3">
            {rows.map((r, i) => (
              <div key={i} className="grid gap-2 rounded-md border border-border bg-card/40 p-3">
                <p className="font-mono-editor break-all text-sm">{r.selector}</p>
                <div className="flex items-center gap-3 font-mono-editor text-xs text-muted-foreground">
                  <span className="rounded bg-primary/15 px-2 py-1 text-primary">
                    {r.sp.ids},{r.sp.classes},{r.sp.types}
                  </span>
                  <span>weight {r.score}</span>
                  {i === 0 && rows.length > 1 && <span className="text-primary">most specific</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </ToolPanel>
    </div>
  );
}

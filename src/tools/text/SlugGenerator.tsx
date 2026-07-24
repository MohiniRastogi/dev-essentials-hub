import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton } from "@/components/common/CopyButton";
import { Trash2 } from "lucide-react";

function slugify(input: string, sep: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, sep);
}

export function SlugGenerator() {
  const [text, setText] = useState("Hello World! This is a Blog Post — 2026");
  const [sep, setSep] = useState("-");
  const slug = useMemo(() => slugify(text, sep || "-"), [text, sep]);

  return (
    <div className="grid gap-4">
      <ToolPanel title="Input">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0" />
      </ToolPanel>
      <ToolPanel title="Options">
        <label className="grid max-w-xs gap-1.5 text-sm">
          <span className="text-muted-foreground">Separator</span>
          <Input value={sep} maxLength={3} onChange={(e) => setSep(e.target.value)} className="font-mono-editor" />
        </label>
      </ToolPanel>
      <ToolPanel
        title="Slug"
        actions={
          <>
            <CopyButton value={slug} />
            <Button size="sm" variant="outline" onClick={() => setText("")}><Trash2 className="h-4 w-4" /> Clear</Button>
          </>
        }
      >
        <div className="font-mono-editor break-all rounded-md bg-secondary/40 px-4 py-3">
          {slug || <span className="text-muted-foreground">slug-appears-here</span>}
        </div>
      </ToolPanel>
    </div>
  );
}
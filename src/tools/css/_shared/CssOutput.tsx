import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";

export function CssOutput({ css, filename, className }: { css: string; filename: string; className?: string }) {
  return (
    <ToolPanel
      title="Generated CSS"
      className={className}
      actions={
        <>
          <CopyButton value={css} label="Copy CSS" disabled={!css} />
          <Button
            size="sm"
            variant="outline"
            disabled={!css}
            onClick={() => {
              downloadText(filename, css, "text/css");
              toast.success(`Downloaded ${filename}`);
            }}
          >
            <Download className="h-4 w-4" /> Download
          </Button>
        </>
      }
    >
      <pre className="font-mono-editor max-h-64 overflow-auto whitespace-pre-wrap break-all text-sm">{css}</pre>
    </ToolPanel>
  );
}

export function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <Control label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-border bg-card/40 px-2 font-mono-editor text-sm text-foreground"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background text-foreground">
            {o}
          </option>
        ))}
      </select>
    </Control>
  );
}

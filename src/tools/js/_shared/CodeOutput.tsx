import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { ToolPanel } from "@/components/common/ToolShell";
import { CopyButton, downloadText } from "@/components/common/CopyButton";

export function CodeOutput({
  title,
  code,
  filename,
  mime = "text/plain",
  className,
}: {
  title: string;
  code: string;
  filename: string;
  mime?: string;
  className?: string;
}) {
  return (
    <ToolPanel
      title={title}
      className={className}
      actions={
        <>
          <CopyButton value={code} label="Copy code" disabled={!code} />
          <Button
            size="sm"
            variant="outline"
            disabled={!code}
            onClick={() => {
              downloadText(filename, code, mime);
              toast.success(`Downloaded ${filename}`);
            }}
          >
            <Download className="h-4 w-4" /> Download
          </Button>
        </>
      }
    >
      <pre className="font-mono-editor max-h-80 overflow-auto whitespace-pre-wrap break-words text-sm">{code}</pre>
    </ToolPanel>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export const inputClass =
  "h-9 w-full rounded-md border border-border bg-card/40 px-2 text-sm text-foreground";

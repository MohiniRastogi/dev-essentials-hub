import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToolCard } from "@/components/common/ToolCard";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "All tools — Developer Toolkit" },
      { name: "description", content: "Browse the complete catalog of client-side developer utilities." },
      { property: "og:title", content: "All tools — Developer Toolkit" },
      { property: "og:description", content: "The full catalog of developer tools." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/tools" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: AllTools,
});

function AllTools() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (!n) return true;
      return t.name.toLowerCase().includes(n) || t.description.toLowerCase().includes(n);
    });
  }, [q, cat]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">All tools</h1>
          <p className="mt-2 text-muted-foreground">{TOOLS.length} developer utilities. Search or filter to jump in.</p>
        </header>
        <div className="glass-card mb-6 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools…" className="border-0 bg-transparent pl-9 focus-visible:ring-0" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border/50 pt-3">
            <Chip active={cat === "all"} onClick={() => setCat("all")}>All ({TOOLS.length})</Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</Chip>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="glass-card p-10 text-center text-sm text-muted-foreground">No tools match your search.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("rounded-full border px-3 py-1 text-xs transition", active ? "border-primary/50 bg-primary/15 text-foreground" : "border-border/70 bg-secondary/40 text-muted-foreground hover:text-foreground")}>{children}</button>
  );
}
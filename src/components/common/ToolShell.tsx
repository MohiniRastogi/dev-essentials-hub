import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Star } from "lucide-react";
import type { Tool } from "@/lib/tools-registry";
import { getCategory } from "@/lib/tools-registry";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const category = getCategory(tool.category)!;
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(tool.slug);
  const Icon = tool.icon;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:pt-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-foreground">
          {category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 flex items-start justify-between gap-4"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
            style={{ background: `color-mix(in oklab, ${category.accent} 18%, transparent)`, color: category.accent }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold sm:text-3xl">{tool.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => toggle(tool.slug)} className="shrink-0" aria-pressed={fav}>
          <Star className={cn("h-4 w-4", fav && "fill-primary text-primary")} />
          <span className="hidden sm:inline">{fav ? "Favorited" : "Favorite"}</span>
        </Button>
      </motion.header>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        {children}
      </motion.section>
    </div>
  );
}

export function ToolPanel({
  title,
  actions,
  children,
  className,
}: {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
          <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function ComingSoon({ toolName }: { toolName: string }) {
  return (
    <div className="glass-card p-10 text-center">
      <p className="text-sm uppercase tracking-widest text-primary">Coming soon</p>
      <h2 className="mt-3 text-xl font-semibold">{toolName} is on the way</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        This tool is planned for a follow-up release. In the meantime, explore the tools already available.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/tools">Browse all tools</Link>
        </Button>
      </div>
    </div>
  );
}
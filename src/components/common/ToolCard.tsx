import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Tool } from "@/lib/tools-registry";
import { getCategory, isImplemented } from "@/lib/tools-registry";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category)!;
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(tool.slug);
  const Icon = tool.icon;
  const live = isImplemented(tool);

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, scale: 0.97, y: 10 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative"
    >

      <Link
        to="/t/$toolSlug"
        params={{ toolSlug: tool.slug }}
        className="glass-card block h-full p-5 transition-colors hover:border-primary/40"
      >
        <div className="flex items-start justify-between">
          <div
            className="grid h-11 w-11 place-items-center rounded-xl"
            style={{ background: `color-mix(in oklab, ${category.accent} 18%, transparent)`, color: category.accent }}
          >
            <Icon className="h-5 w-5" />
          </div>
          {!live && (
            <span className="rounded-full border border-border/70 bg-secondary/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              Soon
            </span>
          )}
        </div>
        <h3 className="mt-4 text-sm font-semibold">{tool.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
      </Link>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); toggle(tool.slug); }}
        aria-label={fav ? "Unfavorite" : "Favorite"}
        className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-secondary/60 hover:text-foreground"
      >
        <Star className={cn("h-4 w-4", fav && "fill-primary text-primary opacity-100")} />
      </button>
    </motion.div>
  );
}
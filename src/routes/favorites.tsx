import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToolCard } from "@/components/common/ToolCard";
import { useFavorites } from "@/hooks/use-favorites";
import { getTool } from "@/lib/tools-registry";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Developer Toolkit" },
      { name: "description", content: "Your saved developer utilities." },
      { property: "og:title", content: "Favorites — Developer Toolkit" },
      { property: "og:description", content: "Your saved developer utilities." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/favorites" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useFavorites();
  const tools = favorites.map(getTool).filter(Boolean);
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10">
        <header className="mb-8 flex items-center gap-3">
          <Star className="h-6 w-6 fill-primary text-primary" />
          <h1 className="text-3xl font-bold">Favorites</h1>
        </header>
        {tools.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-sm text-muted-foreground">You haven't favorited any tools yet.</p>
            <div className="mt-4"><Button asChild><Link to="/tools">Browse tools</Link></Button></div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((t) => t && <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
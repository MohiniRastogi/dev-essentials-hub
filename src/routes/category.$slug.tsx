import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToolCard } from "@/components/common/ToolCard";
import { getCategory, toolsByCategory } from "@/lib/tools-registry";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Category — Developer Toolkit" }, { name: "robots", content: "noindex" }] };
    const { cat } = loaderData;
    return {
      meta: [
        { title: `${cat.name} — Developer Toolkit` },
        { name: "description", content: cat.description },
        { property: "og:title", content: `${cat.name} — Developer Toolkit` },
        { property: "og:description", content: cat.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${cat.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${cat.slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const tools = toolsByCategory(cat.slug);
  const Icon = cat.icon;
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{cat.name}</span>
        </nav>
        <header className="mb-10 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: `color-mix(in oklab, ${cat.accent} 20%, transparent)`, color: cat.accent }}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{cat.name}</h1>
            <p className="mt-1 text-muted-foreground">{cat.description}</p>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </div>
    </SiteLayout>
  );
}
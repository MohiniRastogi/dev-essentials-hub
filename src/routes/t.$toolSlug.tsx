import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToolShell, ComingSoon } from "@/components/common/ToolShell";
import { getTool, isImplemented } from "@/lib/tools-registry";
import { useTrackRecent } from "@/hooks/use-recents";

export const Route = createFileRoute("/t/$toolSlug")({
  loader: ({ params }) => {
    const tool = getTool(params.toolSlug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tool — Developer Toolkit" }, { name: "robots", content: "noindex" }] };
    const { tool } = loaderData;
    return {
      meta: [
        { title: `${tool.name} — Developer Toolkit` },
        { name: "description", content: tool.description },
        { property: "og:title", content: `${tool.name} — Developer Toolkit` },
        { property: "og:description", content: tool.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/t/${tool.slug}` },
      ],
      links: [{ rel: "canonical", href: `/t/${tool.slug}` }],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  useTrackRecent(tool.slug);
  const Component = tool.component;
  return (
    <SiteLayout>
      <ToolShell tool={tool}>
        {isImplemented(tool) && Component ? <Component /> : <ComingSoon toolName={tool.name} />}
      </ToolShell>
    </SiteLayout>
  );
}
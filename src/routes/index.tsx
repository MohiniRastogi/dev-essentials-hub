import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToolCard } from "@/components/common/ToolCard";
import { CATEGORIES, TOOLS, toolCount, getTool } from "@/lib/tools-registry";
import { useRecents } from "@/hooks/use-recents";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Developer Toolkit — 60+ free utilities for developers" },
      { name: "description", content: "A blazing-fast, client-side collection of JSON, encoding, security, text and design tools built for developers." },
      { property: "og:title", content: "Developer Toolkit — 60+ utilities for developers" },
      { property: "og:description", content: "JSON, JWT, Base64, Regex, QR, gradients and more — all in one dark, fast toolkit." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
  }),
  component: Index,
});

function Index() {
  const popular = TOOLS.filter((t) => t.popular).slice(0, 8);
  const { recents } = useRecents();
  const recentTools = recents.map(getTool).filter(Boolean).slice(0, 4);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:pt-28">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {TOOLS.length}+ tools, 100% client-side
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="mx-auto mt-6 max-w-3xl bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-6xl"
          >
            The developer toolkit that lives in your browser.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Format JSON, decode JWTs, hash strings, generate QR codes, tune gradients — everything is instant, private and free.
          </motion.p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="glow-primary">
              <Link to="/tools">Browse all tools <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/t/$toolSlug" params={{ toolSlug: "json-formatter" }}>Try JSON Formatter</Link>
            </Button>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <Feature icon={<Zap className="h-4 w-4" />} title="Blazing fast" desc="All processing runs locally in your browser." />
            <Feature icon={<ShieldCheck className="h-4 w-4" />} title="Private by design" desc="Your data never leaves your device." />
            <Feature icon={<Sparkles className="h-4 w-4" />} title="Always growing" desc="New tools shipped every release." />
          </div>
        </div>
      </section>

      {recentTools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-6">
          <SectionHeader title="Recently used" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentTools.map((t) => t && <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8">
        <SectionHeader title="Popular tools" cta={<Link to="/tools" className="text-sm text-primary hover:underline">See all →</Link>} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6">
        <SectionHeader title="Browse by category" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="glass-card group relative overflow-hidden p-5 transition-colors hover:border-primary/40">
                <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${c.accent} 18%, transparent)`, color: c.accent }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{c.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                <p className="mt-4 text-xs text-muted-foreground"><span className="text-foreground">{toolCount(c.slug)}</span> tools</p>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

function SectionHeader({ title, cta }: { title: string; cta?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      {cta}
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-sm font-medium text-foreground">{title}</span></div>
      <p className="mt-1.5 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

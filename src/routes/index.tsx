import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Search,
  Rocket,
  UserX,
  Gift,
  Lock,
  Smartphone,
  Download,
  Palette as PaletteIcon,
  Code2,
  MousePointerClick,
  ClipboardPaste,
  CheckCircle2,
  BookOpen,
  FileJson,
  Binary,
  KeyRound,
  Fingerprint,
  FileCode,
  Paintbrush,
  Regex,
  ScanLine,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToolCard } from "@/components/common/ToolCard";
import { CATEGORIES, TOOLS, toolCount, getTool, isImplemented, type Tool } from "@/lib/tools-registry";
import { useRecents } from "@/hooks/use-recents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "100+ Free Online Developer Tools — Format, Convert, Generate & More" },
      { name: "description", content: "Free online developer tools to format, convert, generate, encode, decode and optimize code. JSON, Base64, JWT, UUID, SHA256, QR code, regex and more — fast, private, no signup." },
      { property: "og:title", content: "Developer Toolkit — 100+ Free Online Developer Tools" },
      { property: "og:description", content: "Format JSON, decode JWT, generate UUIDs, hash SHA256, minify CSS, create QR codes and more. Free, fast and browser-based." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
  }),
  component: Index,
});

function Index() {
  const featuredSlugs = [
    "json-formatter",
    "password-generator",
    "regex-tester",
    "qr-generator",
    "base64-encode",
    "jwt-decoder",
  ];
  const featured = featuredSlugs.map(getTool).filter((t): t is Tool => Boolean(t));
  const { recents } = useRecents();
  const recentTools = recents.map(getTool).filter((t): t is NonNullable<typeof t> => Boolean(t)).slice(0, 4);
  const [query, setQuery] = useState("");
  const suggestions = useMemo(() => {
    const implemented = TOOLS.filter(isImplemented);
    const q = query.trim().toLowerCase();
    if (!q) return implemented.slice(0, 6);
    return implemented
      .filter((t) => (t.name + " " + t.description).toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:pt-24">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {TOOLS.length}+ tools · 100% client-side · No signup
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="mx-auto mt-6 max-w-3xl bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-6xl"
          >
            The developer toolkit that feels made for you
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Format, convert, generate and inspect — a fast, private workspace of everyday utilities, right in your browser.
          </motion.p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="Search tools…"
                aria-label="Search developer tools"
                className="h-12 rounded-xl border-border/70 bg-card/60 pl-11 pr-4 text-sm backdrop-blur focus-visible:ring-primary/40"
              />
            </div>
            {searchFocused && suggestions.length > 0 && (
              <div className="glass-card absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden p-1 text-left animate-fade-in">
                <p className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {query ? "Results" : "Suggested for you"}
                </p>
                {suggestions.map((t) => (
                  <Link
                    key={t.slug}
                    to="/t/$toolSlug"
                    params={{ toolSlug: t.slug }}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-secondary/60"
                  >
                    <span className="flex items-center gap-2">
                      <t.icon className="h-4 w-4 text-primary" />
                      {t.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.category}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="glow-primary">
              <Link to="/tools">Browse all tools <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/favorites">Open favorites</Link>
            </Button>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
            <Stat label="Tools" value={`${TOOLS.length}+`} />
            <Stat label="Processing" value="Instant" />
            <Stat label="Signup" value="None" />
            <Stat label="Pricing" value="Free Forever" />
          </div>
        </div>
      </section>

      {recentTools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-4">
          <SectionHeader title="Recently used" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentTools.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>
      )}

      {/* Explore by Category */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10">
        <SectionHeader title="Categories" subtitle="Everything organised by what you're building." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="glass-card group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
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

      {/* Featured Tools */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader
          title="Featured tools"
          subtitle="Hand-picked utilities that save developers hours every week."
          cta={<Link to="/tools" className="text-sm text-primary hover:underline">See all →</Link>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* Trending Categories (not tools — avoids repeats) */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader title="Trending categories" subtitle="What developers are exploring most this week." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING_CATEGORIES.map((slug) => {
            const c = CATEGORIES.find((x) => x.slug === slug);
            if (!c) return null;
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="glass-card group flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105"
                  style={{ background: `color-mix(in oklab, ${c.accent} 18%, transparent)`, color: c.accent }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{toolCount(c.slug)} tools</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Use */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader title="Why choose Developer Toolkit" subtitle="Built for speed, privacy, and daily developer productivity." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_USE.map((w) => (
            <div key={w.title} className="glass-card group p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
                <w.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{w.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader title="How it works" subtitle="From input to result in four simple steps." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="glass-card relative p-5">
              <span className="absolute right-4 top-4 text-4xl font-bold text-primary/15">0{i + 1}</span>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Resources */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader title="Developer resources" subtitle="Practical guides that pair with the tools you already use." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="glass-card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{r.title}</h3>
                <p className="mt-1 flex-1 text-xs text-muted-foreground">{r.desc}</p>
                <Link
                  to="/t/$toolSlug"
                  params={{ toolSlug: r.slug }}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Read more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <SectionHeader title="Frequently asked questions" subtitle="Everything you need to know about Developer Toolkit." />
        <Accordion type="single" collapsible className="glass-card divide-y divide-border/50 px-2">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0">
              <AccordionTrigger className="px-4 text-left text-sm font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}

function SectionHeader({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {cta}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card px-4 py-3 text-center">
      <p className="text-lg font-bold text-foreground sm:text-xl">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

// ============ Data ============

const TRENDING_CATEGORIES: string[] = [
  "text",
  "css",
  "encoding",
  "design",
];

const WHY_USE = [
  { icon: Gift, title: "Free Forever", desc: "Every tool is 100% free with no hidden limits or paywalls." },
  { icon: UserX, title: "No Registration", desc: "Use every utility instantly — no signup, no login, no email." },
  { icon: Rocket, title: "Fast Processing", desc: "Optimized to run instantly right in your browser." },
  { icon: Lock, title: "Privacy First", desc: "Your data never leaves your device — nothing is uploaded." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Fully responsive UI that works on any screen." },
  { icon: Download, title: "Copy & Download", desc: "Instant copy to clipboard and one-click downloads." },
  { icon: PaletteIcon, title: "Modern UI", desc: "Clean, dark, distraction-free interface built for focus." },
  { icon: Code2, title: "Developer Friendly", desc: "Keyboard shortcuts, fast search, and sensible defaults." },
];

const STEPS = [
  { icon: MousePointerClick, title: "Choose a tool", desc: "Pick from 100+ free online developer tools." },
  { icon: ClipboardPaste, title: "Paste your input", desc: "Drop in your code, text, JSON, or URL." },
  { icon: Zap, title: "Get instant result", desc: "Everything runs locally — no server round-trip." },
  { icon: CheckCircle2, title: "Copy or download", desc: "One click to copy or save the output." },
];

const FAQS = [
  { q: "Is Developer Toolkit really free?", a: "Yes — every utility is free forever, with no hidden limits, no paywalls, and no signup. The project is designed as a permanent, ad-light home for the small tools developers reach for every day." },
  { q: "Do you store or upload my data?", a: "No. Every tool runs entirely inside your browser using client-side JavaScript. Your input never touches a server, which makes the toolkit safe for secrets, tokens, internal payloads and private code." },
  { q: "Does it work offline?", a: "Once the page has loaded, most tools continue to work without a network connection because the processing happens locally. You can bookmark a specific tool and reopen it any time." },
  { q: "Which formats and languages are supported?", a: "The toolkit covers JSON, HTML, CSS, JavaScript, text transforms, common encodings (Base64, URL, HTML entities, Unicode), cryptography (SHA family, MD5, HMAC), and design utilities such as QR codes, colors and gradients." },
  { q: "Can I use these tools at work?", a: "Yes. Because nothing is uploaded, the toolkit is safe to use for internal or confidential data. Many teams use it alongside their IDE for quick formatting, validation and encoding tasks." },
  { q: "How is this different from other online tools?", a: "Developer Toolkit is built as a single, coherent product — one design system, one search, one place to find every utility — instead of a collection of disconnected pages full of ads." },
  { q: "Do I need to install anything?", a: "No installation is required. Everything works in a modern browser on desktop, tablet or phone. There is no extension, no desktop app and no account to manage." },
  { q: "Can I request a new tool?", a: "Absolutely. The roadmap is community-driven — send suggestions via the feedback link in the footer and popular requests are prioritised in future releases." },
];

const RESOURCES: { title: string; desc: string; slug: string; icon: typeof BookOpen }[] = [
  { title: "JSON Formatting Guide", desc: "Structure, indent and inspect complex API responses with confidence.", slug: "json-viewer", icon: FileJson },
  { title: "Understanding Base64 Encoding", desc: "When to reach for binary-to-text encoding and how to avoid the common pitfalls.", slug: "base64-decode", icon: Binary },
  { title: "Generate Secure Passwords", desc: "Practical rules for entropy, length and safe storage across your accounts.", slug: "password-generator", icon: KeyRound },
  { title: "Working with UUID", desc: "Pick the right version for primary keys, request IDs and distributed systems.", slug: "uuid-generator", icon: Fingerprint },
  { title: "HTML Optimization Tips", desc: "Slim down markup, ship less over the wire and improve Core Web Vitals.", slug: "html-minifier", icon: FileCode },
  { title: "CSS Optimization Guide", desc: "Cleaner stylesheets, faster parsing and easier debugging in devtools.", slug: "css-beautifier", icon: Paintbrush },
  { title: "Regex Basics", desc: "A friendly primer on patterns, flags and building expressions that stick.", slug: "regex-tester", icon: Regex },
  { title: "QR Code Scanner Guide", desc: "How QR decoding works and best practices for camera-based scanning.", slug: "qr-scanner", icon: ScanLine },
];

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
      { title: "100+ Free Online Developer Tools — JSON, Base64, JWT, Regex & More" },
      {
        name: "description",
        content:
          "Free online developer tools to format JSON, decode JWT, encode Base64, generate UUIDs, hash SHA256, test regex, create QR codes and more. 100% client-side, no signup, no data upload.",
      },
      {
        name: "keywords",
        content:
          "online developer tools, free developer tools no signup, json formatter online, base64 encode decode online, jwt decoder online, regex tester online, qr code generator free, uuid generator online, sha256 hash generator, css gradient generator, html minifier, client-side developer tools, privacy-first coding tools",
      },
      { property: "og:title", content: "100+ Free Online Developer Tools — JSON, Base64, JWT, Regex & More" },
      {
        property: "og:description",
        content:
          "Free online developer tools to format JSON, decode JWT, encode Base64, generate UUIDs, hash SHA256, test regex, create QR codes and more. 100% client-side, no signup, no data upload.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
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
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {TOOLS.length}+ Free Tools · 100% Client-Side Processing · No Signup Required
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="mx-auto mt-6 max-w-3xl bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-6xl"
          >
            100+ Free Online Developer Tools — Format, Convert &amp; Generate Instantly
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            A fast, private workspace of JSON formatters, Base64 encoders, JWT decoders, regex testers, QR generators and more — all running client-side in your browser. No signup, no uploads, no limits.
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
        <SectionHeader title="Categories" subtitle="Browse 100+ free online developer tools organized by category — everything you need to format, convert, generate and inspect code, right in your browser." />
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
          subtitle="Hand-picked free online developer tools — JSON formatting, password generation, regex testing, QR code creation and more, used by thousands of developers every week."
          cta={<Link to="/tools" className="text-sm text-primary hover:underline">See all →</Link>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* Trending Categories (not tools — avoids repeats) */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader title="Trending categories" subtitle="See which free developer tools and online utilities other developers are exploring most this week." />
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
        <SectionHeader title="Developer resources" subtitle="Practical developer guides that pair with the free online tools you already use — JSON formatting, Base64 encoding, regex patterns, UUID versions and more." />
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
  { icon: Gift, title: "Free Forever", desc: "Every developer tool on this site is 100% free online — no hidden limits, no paywalls, ever." },
  { icon: UserX, title: "No Registration", desc: "Use any tool instantly. No signup, no login, no email required — just free online developer tools, ready when you are." },
  { icon: Rocket, title: "Fast Processing", desc: "All tools run client-side in your browser for instant results — no server round-trip, no waiting." },
  { icon: Lock, title: "Privacy First", desc: "Your data never leaves your device. These are genuinely privacy-first developer tools — nothing is uploaded or stored." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "A fully responsive design means these free online tools work smoothly on desktop, tablet and mobile." },
  { icon: Download, title: "Copy & Download", desc: "One-click copy to clipboard or download your output — built for a fast developer workflow." },
  { icon: PaletteIcon, title: "Modern UI", desc: "A clean, dark, distraction-free interface designed for focus — no ads, no clutter." },
  { icon: Code2, title: "Developer Friendly", desc: "Keyboard shortcuts, instant search and sensible defaults across every tool in the toolkit." },
];

const STEPS = [
  { icon: MousePointerClick, title: "Choose a tool", desc: "Pick from 100+ free online developer tools organized by category." },
  { icon: ClipboardPaste, title: "Paste your input", desc: "Drop in your JSON, code, text or URL — no file upload required." },
  { icon: Zap, title: "Get instant result", desc: "Everything processes client-side in your browser — no server round-trip, no delay." },
  { icon: CheckCircle2, title: "Copy or download", desc: "One click to copy your result or download it as a file." },
];

const FAQS = [
  { q: "Is Developer Toolkit really free?", a: "Yes. Every tool — from the JSON formatter to the QR code generator — is completely free online, with no hidden fees, paywalls or premium tiers." },
  { q: "Do you store or upload my data?", a: "No. All tools are 100% client-side, meaning your JSON, text and files are processed locally in your browser and never uploaded to a server." },
  { q: "Does it work offline?", a: "Most tools work without an internet connection once the page has loaded, since processing happens entirely client-side in your browser." },
  { q: "Which formats and languages are supported?", a: "Developer Toolkit supports JSON, HTML, CSS, JavaScript, Base64, JWT, regex, UUID, SHA256 hashing, QR codes and more across 8 tool categories." },
  { q: "Can I use these tools at work?", a: "Yes. Because everything runs client-side with no signup or data upload, these free online developer tools are safe for use with sensitive or proprietary data." },
  { q: "How is this different from other online tools?", a: "No ads, no signup walls, no data upload — just fast, free, privacy-first developer tools in a clean interface." },
  { q: "Do I need to install anything?", a: "No installation needed. Every tool runs directly in your browser as a free online utility." },
  { q: "Can I request a new tool?", a: "Yes — reach out via the contact link in the footer and we'll consider it for a future update." },
];

const RESOURCES: { title: string; desc: string; slug: string; icon: typeof BookOpen }[] = [
  { title: "JSON Formatting Guide", desc: "How to Format and Validate JSON Online: structure, indent and inspect complex API responses with confidence.", slug: "json-viewer", icon: FileJson },
  { title: "Understanding Base64 Encoding", desc: "Base64 Encoding Explained: when to use binary-to-text encoding and how to avoid common decoding pitfalls.", slug: "base64-decode", icon: Binary },
  { title: "Generate Secure Passwords", desc: "How to Generate a Strong Password Online: practical rules for entropy, length and safe storage.", slug: "password-generator", icon: KeyRound },
  { title: "Working with UUID", desc: "UUID Versions Explained: choosing the right UUID for primary keys, request IDs and distributed systems.", slug: "uuid-generator", icon: Fingerprint },
  { title: "HTML Optimization Tips", desc: "How to Minify HTML for Faster Page Load: slim down markup and improve Core Web Vitals.", slug: "html-minifier", icon: FileCode },
  { title: "CSS Optimization Guide", desc: "CSS Beautifier vs Minifier: cleaner stylesheets, faster parsing and easier debugging in devtools.", slug: "css-beautifier", icon: Paintbrush },
  { title: "Regex Basics", desc: "Regex Tester Guide: a friendly primer on patterns, flags and building expressions that stick.", slug: "regex-tester", icon: Regex },
  { title: "QR Code Scanner Guide", desc: "How QR Code Scanning Works: decoding basics and best practices for camera-based scanning.", slug: "qr-scanner", icon: ScanLine },

];

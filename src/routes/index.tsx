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
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToolCard } from "@/components/common/ToolCard";
import { CATEGORIES, TOOLS, toolCount, getTool, isImplemented } from "@/lib/tools-registry";
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
  const popular = TOOLS.filter((t) => t.popular).slice(0, 8);
  const { recents } = useRecents();
  const recentTools = recents.map(getTool).filter(Boolean).slice(0, 4);
  const [query, setQuery] = useState("");
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TOOLS.filter((t) =>
      (t.name + " " + t.description + " " + t.category).toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query]);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:pt-24">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {TOOLS.length}+ tools, 100% client-side
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="mx-auto mt-6 max-w-3xl bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-6xl"
          >
            100+ Free Developer Tools for Developers, Designers &amp; Students
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Format, Convert, Generate, Encode, Decode and Optimize your code instantly with fast, free online developer tools.
          </motion.p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 100+ tools — JSON, Base64, JWT, QR, regex…"
                aria-label="Search developer tools"
                className="h-12 rounded-xl border-border/70 bg-card/60 pl-11 pr-4 text-sm backdrop-blur focus-visible:ring-primary/40"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="glass-card absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden p-1 text-left">
                {searchResults.map((t) => (
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
              <Link to="/t/$toolSlug" params={{ toolSlug: "json-formatter" }}>Try JSON Formatter</Link>
            </Button>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
            <Stat label="Tools" value="100+" />
            <Stat label="Processing" value="Instant" />
            <Stat label="Signup" value="None" />
            <Stat label="Pricing" value="Free Forever" />
          </div>

          <PopularToolPills />
        </div>
      </section>

      {/* Popular Searches */}
      <section aria-labelledby="popular-searches" className="mx-auto max-w-7xl px-4 pb-4 pt-4">
        <SectionHeader title="Popular searches" subtitle="Quick answers and shortcuts to the tools developers use most." />
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((s) => (
            <Link
              key={s.q}
              to="/t/$toolSlug"
              params={{ toolSlug: s.slug }}
              className="glass-card rounded-full border-border/60 px-4 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              {s.q}
            </Link>
          ))}
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

      {/* Explore by Category */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6">
        <SectionHeader title="Explore by category" subtitle="Browse free online tools organized by what you're building." />
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

      {/* Why Use */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader title="Why use Developer Toolkit?" subtitle="Built for speed, privacy, and daily developer productivity." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_USE.map((w) => (
            <div key={w.title} className="glass-card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
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

      {/* Featured Tools */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader
          title="Featured tools"
          subtitle="Hand-picked free online tools that save developers time every day."
          cta={<Link to="/tools" className="text-sm text-primary hover:underline">See all →</Link>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.slice(0, 8).map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* Trending Tools */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader title="Trending tools" subtitle="What developers are using the most this week." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING.map((slug) => {
            const t = getTool(slug);
            if (!t) return null;
            const Icon = t.icon;
            return (
              <Link
                key={slug}
                to="/t/$toolSlug"
                params={{ toolSlug: t.slug }}
                className="glass-card flex items-center gap-3 p-4 transition hover:border-primary/40"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-emerald-400" /> Trending
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <SectionHeader title="Frequently asked questions" subtitle="Answers to the most common developer tool questions." />
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

      {/* Developer Resources */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeader title="Developer resources" subtitle="Short explainers on the fundamentals behind our most-used tools." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map((r) => (
            <div key={r.title} className="glass-card flex flex-col p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{r.title}</h3>
              <p className="mt-1 flex-1 text-xs text-muted-foreground">{r.desc}</p>
              <Link
                to="/t/$toolSlug"
                params={{ toolSlug: r.slug }}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Learn more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Footer Links */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Free online developer tools</h2>
          <p className="mt-1 text-sm text-muted-foreground">Popular formatters, generators, encoders and validators — all free, all browser-based.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SEO_LINKS.map((l) => {
              const t = getTool(l);
              if (!t) return null;
              return (
                <Link
                  key={l}
                  to="/t/$toolSlug"
                  params={{ toolSlug: l }}
                  className="rounded-full border border-border/60 bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {t.name}
                </Link>
              );
            })}
          </div>
        </div>
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

function PopularToolPills() {
  const pills = TOOLS.filter((t) => t.popular && isImplemented(t)).slice(0, 8);
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">Popular:</span>
      {pills.map((t) => (
        <Link
          key={t.slug}
          to="/t/$toolSlug"
          params={{ toolSlug: t.slug }}
          className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur hover:border-primary/40 hover:text-foreground"
        >
          {t.name}
        </Link>
      ))}
    </div>
  );
}

// ============ Data ============

const POPULAR_SEARCHES: { q: string; slug: string }[] = [
  { q: "What is JSON Formatter?", slug: "json-formatter" },
  { q: "How to Format JSON?", slug: "json-formatter" },
  { q: "Why use JSON Validator?", slug: "json-validator" },
  { q: "How to Minify CSS?", slug: "css-minifier" },
  { q: "What is Base64 Encoding?", slug: "base64-encode" },
  { q: "How to Generate UUID?", slug: "uuid-generator" },
  { q: "How to Decode JWT?", slug: "jwt-decoder" },
  { q: "What is SHA256?", slug: "sha256" },
  { q: "How to Generate QR Code?", slug: "qr-generator" },
  { q: "What is Slug Generator?", slug: "slug-generator" },
  { q: "How to Beautify HTML?", slug: "html-beautifier" },
  { q: "How to Minify JavaScript?", slug: "js-minifier" },
  { q: "How to Encode URL?", slug: "url-encode" },
  { q: "How to Decode Base64?", slug: "base64-decode" },
  { q: "How to Count Words Online?", slug: "word-counter" },
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

const TRENDING = [
  "json-formatter",
  "password-generator",
  "qr-scanner",
  "base64-encode",
  "uuid-generator",
  "sha256",
  "regex-tester",
  "color-picker",
];

const FAQS = [
  { q: "What is a JSON Formatter?", a: "A JSON Formatter is a free online tool that takes minified or messy JSON and reformats it with proper indentation, line breaks and spacing. It makes JSON data readable for developers, exposes structural mistakes, and helps you inspect API responses, config files and log payloads quickly without installing anything." },
  { q: "How does JSON Validator work?", a: "A JSON Validator parses your input against the official JSON specification. If the syntax is correct, it confirms the document is valid; if not, it reports the exact line and column where the error occurs, along with the reason (missing comma, unquoted key, trailing character), so you can fix issues fast." },
  { q: "Why should developers use Base64 encoding?", a: "Base64 encoding converts binary data into an ASCII-safe string so it can be transmitted over text-based channels like JSON, XML, URLs, and email. Developers use it to embed images in CSS, send credentials in HTTP Basic auth, and safely include file content in API requests without corruption." },
  { q: "What is SHA256 used for?", a: "SHA256 is a cryptographic hash function that produces a fixed 256-bit fingerprint of any input. It powers password storage, digital signatures, blockchain transactions, file-integrity checks, and API request signing. Because it is one-way and collision-resistant, it is trusted for security-critical verification." },
  { q: "How does a QR Code Generator work?", a: "A QR Code Generator encodes text, a URL, or contact data into a two-dimensional matrix of black and white modules. Any smartphone camera can scan the pattern and decode it back to the original content. Our generator lets you customize size and colors and export PNG or SVG instantly." },
  { q: "What is a UUID?", a: "A UUID (Universally Unique Identifier) is a 128-bit value used to uniquely identify records without a central authority. UUID v4 is generated from random data, making collisions statistically impossible. Developers use UUIDs as primary keys, request IDs, and identifiers for distributed systems." },
  { q: "Why use a Password Generator?", a: "A password generator creates long, random passwords with high entropy that are resistant to brute-force and dictionary attacks. Using unique, generated passwords per account — combined with a password manager — dramatically reduces the risk of credential stuffing and account takeover." },
  { q: "How do I minify HTML?", a: "To minify HTML, paste your markup into the HTML Minifier tool. It removes comments, whitespace, and redundant attributes while preserving semantics. Smaller HTML means faster page loads, less bandwidth, and better Core Web Vitals — especially important for mobile users and SEO." },
  { q: "How do I beautify CSS?", a: "The CSS Beautifier reformats compressed or inconsistent stylesheets with consistent indentation, spacing and line breaks. It makes CSS easier to read, review in pull requests, and debug in browser devtools — without changing selectors or the cascade behavior of your styles." },
  { q: "What is a Slug Generator?", a: "A Slug Generator turns a title or phrase into a clean, URL-friendly string by lowercasing, removing special characters, and replacing spaces with hyphens. Slugs improve SEO, produce readable URLs (like /best-online-tools), and are essential for blogs, CMS content, and product pages." },
  { q: "How does URL Encoding work?", a: "URL encoding replaces reserved and non-ASCII characters with a percent sign followed by two hex digits (for example, a space becomes %20). This ensures query strings, path segments, and form data can be transmitted safely inside a URL without breaking the request or being misinterpreted." },
  { q: "What is Regex?", a: "Regex (regular expressions) is a compact language for describing search patterns in text. Developers use regex to validate emails, extract data, refactor code, and power find-and-replace. Our Regex Tester lets you build a pattern, see live matches, and tune flags without leaving the browser." },
];

const RESOURCES = [
  { title: "What is JSON?", desc: "The lightweight data format that powers modern APIs and configs.", slug: "json-formatter" },
  { title: "How to Minify Code?", desc: "Shrink CSS, HTML and JS to boost page load performance.", slug: "css-minifier" },
  { title: "Best Online Developer Tools", desc: "A quick tour of the utilities every developer should bookmark.", slug: "json-formatter" },
  { title: "Why Developers Use Hash Generators", desc: "Where SHA-256, MD5 and HMAC fit in real-world apps.", slug: "sha256" },
  { title: "HTML vs XHTML", desc: "The differences that still matter for modern markup.", slug: "html-beautifier" },
  { title: "CSS Grid vs Flexbox", desc: "When to reach for Grid and when Flexbox is the better tool.", slug: "css-beautifier" },
  { title: "Understanding JWT", desc: "How JSON Web Tokens work and how to decode them safely.", slug: "jwt-decoder" },
  { title: "Base64 Explained", desc: "Why binary-to-text encoding still matters in web development.", slug: "base64-encode" },
];

const SEO_LINKS = [
  "json-formatter", "json-validator", "json-minifier",
  "html-beautifier", "css-beautifier", "css-minifier", "js-minifier",
  "password-generator", "uuid-generator", "sha256",
  "qr-generator", "qr-scanner", "regex-tester",
  "base64-encode", "url-encode", "slug-generator", "lorem-ipsum",
];

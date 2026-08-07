import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Cake,
  MapPin,
  Github,
  Linkedin,
  ChevronDown,
  ArrowLeft,
  Code2,
  Sparkles,
  Palette,
  Puzzle,
  GraduationCap,
  BriefcaseBusiness,
  Award,
  ExternalLink,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import avatar from "@/assets/avatar-mohini.jpg";

const TITLE = "About the Developer — Mohini Rastogi, Frontend Developer";
const DESC =
  "Portfolio of Mohini Rastogi, frontend developer and creator of Developer Toolkit. Resume, projects, skills and contact details.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const TABS = ["About", "Resume", "Work", "Contact"] as const;
type Tab = (typeof TABS)[number];

const DOING = [
  {
    icon: Code2,
    title: "Frontend Development",
    body: "Building clean, responsive, user-friendly web interfaces with HTML, CSS, and JavaScript.",
  },
  {
    icon: Sparkles,
    title: "AI-Integrated Tools",
    body: "Exploring and building tools that combine web development with practical AI applications.",
  },
  {
    icon: Palette,
    title: "UI Design",
    body: "Crafting simple, functional layouts focused on usability and clarity.",
  },
  {
    icon: Puzzle,
    title: "Problem Solving",
    body: "Breaking down complex technical challenges into clean, workable solutions.",
  },
];

const SKILLS = [
  { name: "HTML", value: 90 },
  { name: "CSS", value: 85 },
  { name: "JavaScript", value: 60 },
  { name: "Python", value: 70 },
  { name: "C", value: 80 },
];

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass-card p-5 sm:p-6", className)}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 text-xl font-semibold sm:text-2xl">{children}</h2>;
}

function AboutPage() {
  const [tab, setTab] = useState<Tab>("About");
  const [contactsOpen, setContactsOpen] = useState(false);
  const [sending, setSending] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 pt-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <Panel>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 lg:grid-cols-1 lg:justify-items-center lg:text-center">
              <img
                src={avatar}
                alt="Illustrated line-art avatar of Mohini Rastogi"
                width={512}
                height={512}
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-2xl border border-border/60 object-cover lg:h-28 lg:w-28"
              />
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold sm:text-xl">Mohini Rastogi</h1>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Frontend Developer
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
                  Open to Work
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-5 w-full"
              onClick={() => setContactsOpen((v) => !v)}
              aria-expanded={contactsOpen}
            >
              Show Contacts
              <ChevronDown className={cn("h-4 w-4 transition-transform", contactsOpen && "rotate-180")} />
            </Button>

            <AnimatePresence initial={false}>
              {contactsOpen && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden text-sm"
                >
                  <li className="flex items-start gap-3 pt-4">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <a
                      href={siteConfig.contactMailto}
                      className="min-w-0 break-all text-muted-foreground hover:text-primary"
                    >
                      {siteConfig.contactEmail}
                    </a>
                  </li>
                  <li className="flex items-start gap-3 pt-3">
                    <Cake className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">July 14, 2006</span>
                  </li>
                  <li className="flex items-start gap-3 pt-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">Bareilly, Uttar Pradesh, India</span>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4 lg:justify-center">
              <Button variant="ghost" size="icon" asChild>
                <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={siteConfig.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              © 2026 Mohini Rastogi. Built with passion and curiosity.
            </p>
          </Panel>
        </motion.aside>

        {/* Main */}
        <div className="min-w-0">
          <nav
            aria-label="Portfolio sections"
            className="glass-card mb-6 flex overflow-x-auto p-1.5"
          >
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                aria-current={tab === t}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-2xl px-4 py-2 text-sm transition-colors",
                  tab === t
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "About" && <AboutTab />}
              {tab === "Resume" && <ResumeTab />}
              {tab === "Work" && <WorkTab />}
              {tab === "Contact" && <ContactTab sending={sending} setSending={setSending} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SiteLayout>
  );
}

function AboutTab() {
  return (
    <div className="grid gap-6">
      <Panel>
        <SectionTitle>About me</SectionTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">
          I'm Mohini Rastogi, a frontend developer actively looking for full-time opportunities where I can
          contribute, learn, and grow. I enjoy building intuitive, efficient web applications and exploring the
          world of AI. Currently pursuing my BCA at MJPRU, I combine strong fundamentals in web development with
          hands-on experience in AI-driven tools. I completed an internship as an AI Intern at Perfoptim Labs,
          where I worked on practical AI applications, and I continue to build and ship projects at the
          intersection of frontend development and artificial intelligence. I'm ready to bring that energy to a
          team.
        </p>
      </Panel>

      <Panel>
        <SectionTitle>What I'm doing</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {DOING.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/40"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <p className="text-xs uppercase tracking-widest text-primary">Featured project</p>
        <h3 className="mt-2 text-lg font-semibold">Developer Toolkit</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A collection of 100+ free, client-side developer tools.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Explore the toolkit</Link>
        </Button>
      </Panel>
    </div>
  );
}

function ResumeTab() {
  return (
    <div className="grid gap-6">
      <Panel>
        <SectionTitle>Career objective</SectionTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Motivated frontend developer seeking a full-time entry-level role where I can apply my skills in HTML,
          CSS, JavaScript, and Python, contribute to real-world projects, and continue growing in web development
          and AI-integrated applications.
        </p>
      </Panel>

      <Panel>
        <div className="mb-5 flex items-center gap-3">
          <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="text-xl font-semibold sm:text-2xl">Education</h2>
        </div>
        <ol className="grid gap-4 border-l border-border/60 pl-5 text-sm">
          <li>
            <h3 className="font-medium">Bachelor of Computer Applications (BCA) — MJPRU</h3>
            <p className="text-muted-foreground">In progress</p>
          </li>
          <li>
            <h3 className="font-medium">12th — R.B.L.G.I.C, UP Board</h3>
            <p className="text-muted-foreground">2024 — 84.4%</p>
          </li>
          <li>
            <h3 className="font-medium">10th — R.B.L.G.I.C, UP Board</h3>
            <p className="text-muted-foreground">2022 — 84%</p>
          </li>
        </ol>
      </Panel>

      <Panel>
        <div className="mb-5 flex items-center gap-3">
          <Award className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="text-xl font-semibold sm:text-2xl">Certifications</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Introduction to AI", "Introduction to Generative AI", "AI and Generative AI for Video Content Creation"].map(
            (c) => (
              <Badge key={c} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                {c}
              </Badge>
            ),
          )}
        </div>
      </Panel>

      <Panel>
        <div className="mb-5 flex items-center gap-3">
          <BriefcaseBusiness className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="text-xl font-semibold sm:text-2xl">Experience</h2>
        </div>
        <div className="border-l border-border/60 pl-5 text-sm">
          <h3 className="font-medium">AI Intern — Perfoptim Labs</h3>
          <p className="text-muted-foreground">June 15, 2026 – August 14, 2026</p>
          <div className="mt-4 grid gap-4">
            {[
              {
                title: "AI Content & Video Production",
                items: [
                  "Wrote and pitched creative concepts/storyboards for short-form video content",
                  "Edited and produced videos end-to-end, from raw footage to final export",
                  "Generated AI videos using Google Flow and Gemini's video generation tools",
                  "Created animated video content for product/marketing use cases",
                  "Generated and curated AI images to support content and design needs",
                ],
              },
              {
                title: "AI-Assisted Development",
                items: [
                  "Practiced \u201cvibe coding\u201d — using AI tools like ChatGPT, Claude, Perplexity, and Lovable to rapidly prototype and ship features",
                  "Worked on practical AI applications, integrating AI tools into everyday development and content workflows",
                ],
              },
              {
                title: "Core Internship Experience",
                items: [
                  "Collaborated with the team on applied AI projects, translating ideas into working outputs",
                  "Explored the intersection of AI tools and creative/technical production",
                ],
              },
            ].map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/40"
              >
                <h4 className="text-sm font-semibold">{group.title}</h4>
                <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </Panel>

      <Panel>
        <SectionTitle>My skills</SectionTitle>
        <div className="grid gap-4">
          {SKILLS.map((s) => (
            <div key={s.name}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.value}%</span>
              </div>
              <Progress value={s.value} className="h-2" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function WorkTab() {
  return (
    <div className="grid gap-6">
      <Panel>
        <SectionTitle>Work</SectionTitle>
        <div className="grid gap-4">
          <article className="rounded-2xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-primary/40">
            <h3 className="text-base font-semibold">Developer Toolkit</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A collection of 100+ free, 100% client-side online developer tools — including a JSON formatter,
              Base64 encoder/decoder, JWT decoder, regex tester, UUID generator, SHA256 hash generator, and QR code
              generator. No signup, no data upload, everything processes instantly in the browser.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["HTML", "CSS", "JavaScript"].map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full text-xs">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/">Live demo</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href="https://github.com/MohiniRastogi/dev-essentials-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Button>
            </div>
          </article>

          <article className="rounded-2xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-primary/40">
            <h3 className="text-base font-semibold">Code MateAI</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              An AI-powered code review and debugging tool that helps developers spot bugs, understand errors, and
              improve code quality faster.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["JavaScript", "Python", "AI Integration"].map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full text-xs">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <a href="https://codemateai.devorbitx.site/" target="_blank" rel="noopener noreferrer">
                  Live demo
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href="https://github.com/MohiniRastogi/sunshine-mashup-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Button>
            </div>
          </article>

          <article className="rounded-2xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-primary/40">
            <h3 className="text-base font-semibold">Calculator</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A handmade calculator built using HTML, CSS, and JavaScript.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["HTML", "CSS", "JavaScript"].map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full text-xs">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <a
                  href="https://mohinirastogi.github.io/calculator_by_mohini/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live demo
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href="https://github.com/MohiniRastogi/calculator_by_mohini"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Button>
            </div>
          </article>
        </div>
      </Panel>
    </div>
  );
}

function ContactTab({
  sending,
  setSending,
}: {
  sending: boolean;
  setSending: (v: boolean) => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return toast.error("Please enter a valid email address.");
    if (form.message.trim().length < 10)
      return toast.error("Message should be at least 10 characters.");

    setSending(true);
    const subject = encodeURIComponent(`Portfolio contact from ${form.name.trim()}`);
    const body = encodeURIComponent(`${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`);
    window.location.href = `${siteConfig.contactMailto}?subject=${subject}&body=${body}`;
    toast.success("Opening your email client…");
    setTimeout(() => setSending(false), 1200);
  }

  return (
    <div className="grid gap-6">
      <Panel>
        <SectionTitle>Let's Connect</SectionTitle>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Your name"
              aria-label="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Your email"
              aria-label="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <Textarea
            rows={6}
            placeholder="Your message"
            aria-label="Your message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <div>
            <Button type="submit" disabled={sending}>
              <Send className="h-4 w-4" />
              {sending ? "Sending…" : "Send Message"}
            </Button>
          </div>
        </form>
      </Panel>

      <Panel>
        <SectionTitle>Direct contact</SectionTitle>
        <ul className="grid gap-3 text-sm">
          <li className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-primary" />
            <a href={siteConfig.contactMailto} className="break-all text-muted-foreground hover:text-primary">
              {siteConfig.contactEmail}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Linkedin className="h-4 w-4 shrink-0 text-primary" />
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              LinkedIn <ExternalLink className="inline h-3 w-3" />
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Github className="h-4 w-4 shrink-0 text-primary" />
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              GitHub <ExternalLink className="inline h-3 w-3" />
            </a>
          </li>
        </ul>
      </Panel>
    </div>
  );
}

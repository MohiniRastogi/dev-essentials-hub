import { Link } from "@tanstack/react-router";
import { CATEGORIES, TOOLS, isImplemented } from "@/lib/tools-registry";
import { Github, Linkedin, Mail, MessageSquare, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const popular = TOOLS.filter((t) => t.popular && isImplemented(t)).slice(0, 6);
  const resources = [
    { label: "JSON Formatting Guide", slug: "json-formatter" },
    { label: "Base64 Encoding", slug: "base64-encode" },
    { label: "Secure Passwords", slug: "password-generator" },
    { label: "Working with UUID", slug: "uuid-generator" },
  ];
  return (
    <footer className="site-footer mt-24 border-t border-[var(--footer-border)] bg-[var(--footer-bg)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <img src={logo} alt="Developer Toolkit" className="h-10 w-auto" />
          <p className="mt-2 max-w-sm text-sm text-[var(--footer-muted)]">
            A premium collection of 100+ free online developer tools. Everything runs client-side in your browser — nothing is ever uploaded.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-5 flex max-w-sm items-center gap-2"
          >
            <Input
              type="email"
              placeholder="Get product updates"
              aria-label="Email address"
              className="h-9 rounded-lg bg-[var(--footer-card)]/60 text-[var(--footer-fg)] placeholder:text-[var(--footer-muted)]"
            />
            <Button type="submit" size="sm" className="h-9">Subscribe</Button>
          </form>
          <div className="mt-5 flex items-center gap-3 text-[var(--footer-fg)]">
            <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[var(--footer-pink)]">
              <Github className="h-4 w-4" />
            </a>
            <a href={siteConfig.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[var(--footer-pink)]">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={siteConfig.contactMailto} aria-label="Contact" className="hover:text-[var(--footer-pink)]">
              <Mail className="h-4 w-4" />
            </a>
            <a href={siteConfig.contactMailto} aria-label="Feedback" className="hover:text-[var(--footer-pink)]">
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--footer-fg)]">Popular Tools</p>
          <ul className="grid gap-1.5 text-sm">
            {popular.map((t) => (
              <li key={t.slug}>
                <Link to="/t/$toolSlug" params={{ toolSlug: t.slug }} className="text-[var(--footer-muted)] hover:text-[var(--footer-pink)]">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--footer-fg)]">Categories</p>
          <ul className="grid gap-1.5 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="text-[var(--footer-muted)] hover:text-[var(--footer-pink)]">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--footer-fg)]">Resources</p>
          <ul className="grid gap-1.5 text-sm">
            {resources.map((r) => (
              <li key={r.slug}>
                <Link to="/t/$toolSlug" params={{ toolSlug: r.slug }} className="text-[var(--footer-muted)] hover:text-[var(--footer-pink)]">
                  {r.label}
                </Link>
              </li>
            ))}
            <li><Link to="/tools" className="text-[var(--footer-muted)] hover:text-[var(--footer-pink)]">All tools</Link></li>
            <li><Link to="/favorites" className="text-[var(--footer-muted)] hover:text-[var(--footer-pink)]">Favorites</Link></li>
            <li>
              <Link to="/about" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--footer-border)] bg-[var(--footer-card)]/40 px-3 py-1 text-[var(--footer-muted)] transition hover:border-[var(--footer-pink)]/50 hover:text-[var(--footer-pink)]">
                <User className="h-3.5 w-3.5" /> My Profile
              </Link>
            </li>

          </ul>
          <p className="mt-4 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--footer-fg)]">Company</p>
          <ul className="grid gap-1.5 text-sm">
            <li><Link to="/privacy" className="text-[var(--footer-muted)] hover:text-[var(--footer-pink)]">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-[var(--footer-muted)] hover:text-[var(--footer-pink)]">Terms</Link></li>

            <li><a href={siteConfig.contactMailto} className="text-[var(--footer-muted)] hover:text-[var(--footer-pink)]">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--footer-border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-[var(--footer-muted)] sm:flex-row">
          <span>© {new Date().getFullYear()} Developer Toolkit. All rights reserved.</span>
          <span className="tracking-wide">developed by{" "}
            <Link to="/about" className="text-[var(--footer-fg)]/80 underline-offset-4 hover:text-[var(--footer-pink)] hover:underline">
              Mohini Rastogi
            </Link>
          </span>

        </div>
      </div>
    </footer>
  );
}

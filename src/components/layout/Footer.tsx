import { Link } from "@tanstack/react-router";
import { CATEGORIES, TOOLS, isImplemented } from "@/lib/tools-registry";
import { Github, Mail, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/developer-toolkit-logo.png.asset.json";

export function Footer() {
  const popular = TOOLS.filter((t) => t.popular && isImplemented(t)).slice(0, 6);
  const resources = [
    { label: "JSON Formatting Guide", slug: "json-formatter" },
    { label: "Base64 Encoding", slug: "base64-encode" },
    { label: "Secure Passwords", slug: "password-generator" },
    { label: "Working with UUID", slug: "uuid-generator" },
  ];
  return (
    <footer className="mt-24 border-t border-border/50 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <img src={logoAsset.url} alt="Developer Toolkit" className="h-10 w-auto" />
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
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
              className="h-9 rounded-lg bg-card/60"
            />
            <Button type="submit" size="sm" className="h-9">Subscribe</Button>
          </form>
          <div className="mt-5 flex items-center gap-3 text-muted-foreground">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
            <a href="mailto:hello@example.com" aria-label="Contact" className="hover:text-foreground">
              <Mail className="h-4 w-4" />
            </a>
            <a href="mailto:feedback@example.com" aria-label="Feedback" className="hover:text-foreground">
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Popular Tools</p>
          <ul className="grid gap-1.5 text-sm">
            {popular.map((t) => (
              <li key={t.slug}>
                <Link to="/t/$toolSlug" params={{ toolSlug: t.slug }} className="text-muted-foreground hover:text-primary">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Categories</p>
          <ul className="grid gap-1.5 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="text-muted-foreground hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Resources</p>
          <ul className="grid gap-1.5 text-sm">
            {resources.map((r) => (
              <li key={r.slug}>
                <Link to="/t/$toolSlug" params={{ toolSlug: r.slug }} className="text-muted-foreground hover:text-primary">
                  {r.label}
                </Link>
              </li>
            ))}
            <li><Link to="/tools" className="text-muted-foreground hover:text-primary">All tools</Link></li>
            <li><Link to="/favorites" className="text-muted-foreground hover:text-primary">Favorites</Link></li>
          </ul>
          <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Company</p>
          <ul className="grid gap-1.5 text-sm">
            <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary">Terms</a></li>
            <li><a href="mailto:hello@example.com" className="text-muted-foreground hover:text-primary">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Developer Toolkit. All rights reserved.</span>
          <span className="tracking-wide">developed by <span className="text-foreground/80">Mohini Rastogi</span></span>
        </div>
      </div>
    </footer>
  );
}
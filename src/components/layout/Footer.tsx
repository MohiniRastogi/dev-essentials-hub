import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/tools-registry";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="text-sm font-semibold">Developer Toolkit</p>
          <p className="mt-2 text-sm text-muted-foreground">
            A blazing-fast collection of developer utilities. Everything runs in your browser — nothing is uploaded.
          </p>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {CATEGORIES.slice(0, 8).map((c) => (
            <div key={c.slug}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.name}</p>
              <Link to="/category/$slug" params={{ slug: c.slug }} className="text-sm hover:text-primary">
                Browse
              </Link>
            </div>
          ))}
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Links</p>
          <ul className="grid gap-1.5 text-sm">
            <li><Link to="/tools" className="hover:text-primary">All tools</Link></li>
            <li><Link to="/favorites" className="hover:text-primary">Favorites</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Developer Toolkit. Built for developers.
      </div>
    </footer>
  );
}
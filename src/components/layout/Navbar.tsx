import { Link } from "@tanstack/react-router";
import { Command, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
            <Command className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Developer Toolkit</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">All-in-one utilities</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/" className="hover:text-foreground [&.active]:text-foreground" activeOptions={{ exact: true }}>Home</Link>
          <Link to="/tools" className="hover:text-foreground [&.active]:text-foreground">All tools</Link>
          <Link to="/favorites" className="hover:text-foreground [&.active]:text-foreground">Favorites</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
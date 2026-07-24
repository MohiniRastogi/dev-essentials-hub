import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/developer-toolkit-logo.png.asset.json";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center" aria-label="Developer Toolkit">
          <img
            src={logoAsset.url}
            alt="Developer Toolkit"
            className="h-[34px] md:h-[40px] w-auto"
          />
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
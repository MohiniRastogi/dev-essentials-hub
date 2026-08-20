import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Github, Linkedin, Menu, Moon, Settings, Sun, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATEGORIES, TOOLS, isImplemented, type CategorySlug } from "@/lib/tools-registry";
import { useTheme } from "@/components/theme/ThemeProvider";
import logo from "@/assets/logo.png";
import { siteConfig } from "@/lib/site-config";

const SHORT_NAMES: Record<CategorySlug, string> = {
  json: "JSON",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  security: "Security",
  text: "Text",
  encoding: "Encoding",
  design: "Design",
};

function toolsFor(slug: CategorySlug) {
  return TOOLS.filter((t) => t.category === slug);
}

function SoonBadge() {
  return (
    <span className="ml-auto rounded-full border border-border/70 bg-secondary/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
      Soon
    </span>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-primary hover:text-primary"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </Button>
  );
}


function ProfileButton({ className }: { className?: string }) {
  return (
    <Button asChild size="sm" className={"rounded-full " + (className ?? "")}>
      <Link to="/about">
        <User className="h-4 w-4" />
        My Profile
      </Link>
    </Button>
  );
}

function CategoryMenu({ slug }: { slug: CategorySlug }) {
  const [open, setOpen] = useState(false);
  const items = toolsFor(slug);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none transition hover:text-foreground data-[state=open]:text-foreground">
          {SHORT_NAMES[slug]}
          <ChevronDown className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={8} className="w-60">
          {items.map((t) => (
            <DropdownMenuItem key={t.slug} asChild>
              <Link to="/t/$toolSlug" params={{ toolSlug: t.slug }} className="flex w-full items-center gap-2">
                <t.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{t.name}</span>
                {!isImplemented(t) && <SoonBadge />}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild className="mt-1 border-t border-border/60">
            <Link to="/category/$slug" params={{ slug }} className="flex w-full items-center gap-1 text-primary">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto">
        <div className="mt-6 grid gap-2 text-sm">
          <Link to="/" onClick={() => setOpen(false)} className="py-2">Home</Link>
          <Link to="/tools" onClick={() => setOpen(false)} className="py-2">All tools</Link>
          <Link to="/favorites" onClick={() => setOpen(false)} className="py-2">Favorites</Link>
          <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2">
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <ProfileButton className="my-2 w-fit" />
          <Accordion type="single" collapsible className="mt-2">
            {CATEGORIES.map((c) => (
              <AccordionItem key={c.slug} value={c.slug}>
                <AccordionTrigger className="text-sm">{SHORT_NAMES[c.slug]}</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-1">
                    {toolsFor(c.slug).map((t) => (
                      <li key={t.slug}>
                        <Link
                          to="/t/$toolSlug"
                          params={{ toolSlug: t.slug }}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <span className="truncate">{t.name}</span>
                          {!isImplemented(t) && <SoonBadge />}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-1 py-1.5 text-primary"
                      >
                        See all <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const NAV_LINK =
  "rounded-md px-2.5 py-1.5 transition-colors hover:bg-secondary/60 hover:text-foreground [&.active]:text-primary [&.active]:font-medium";

function Divider() {
  return <span className="mx-2 h-4 w-px bg-border/60" aria-hidden="true" />;
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Developer Toolkit">
          <img src={logo} alt="Developer Toolkit" className="h-[34px] md:h-[40px] w-auto" />
        </Link>

        <nav className="hidden items-center text-sm text-muted-foreground lg:flex">
          <Divider />
          <Link to="/" activeOptions={{ exact: true }} className={NAV_LINK}>
            Home
          </Link>
          <div className="flex items-center gap-1">
            {CATEGORIES.map((c) => (
              <CategoryMenu key={c.slug} slug={c.slug} />
            ))}
          </div>
          <Divider />
          <Link to="/tools" className={NAV_LINK}>All tools</Link>
          <Link to="/favorites" className={NAV_LINK}>Favorites</Link>
          <Link to="/settings" aria-label="Settings" className={NAV_LINK + " inline-flex items-center gap-1.5"}>
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </Link>
          <Divider />
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild className="hidden text-primary hover:text-primary sm:inline-flex">
            <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-[18px] w-[18px]" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="hidden text-primary hover:text-primary sm:inline-flex">
            <a href={siteConfig.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-[18px] w-[18px]" />
            </a>
          </Button>
          <span className="mx-1.5 hidden h-4 w-px bg-border/60 sm:inline-block" aria-hidden="true" />
          <ProfileButton className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}


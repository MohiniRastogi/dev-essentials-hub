import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Moon, RotateCcw, Settings as SettingsIcon, Star, Sun } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme, type ThemePreference } from "@/components/theme/ThemeProvider";
import {
  DENSITY_KEY,
  FAVORITES_KEY,
  LANDING_KEY,
  THEME_KEY,
  useDensity,
  useLandingPage,
  useResetPreferences,
  type Density,
  type LandingPage,
} from "@/hooks/use-app-settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Developer Toolkit" },
      { name: "description", content: "Choose your theme, default landing page and layout density for Developer Toolkit. All settings stay in your browser." },
      { property: "og:title", content: "Settings — Developer Toolkit" },
      { property: "og:description", content: "Choose your theme, default landing page and layout density. Stored locally in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Settings — Developer Toolkit" },
      { name: "twitter:description", content: "Theme, landing page and layout preferences." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const { preference, setPreference } = useTheme();
  const [landing, setLanding] = useLandingPage();
  const [density, setDensity] = useDensity();
  const reset = useResetPreferences();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-10">
        <header className="mb-8 flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Everything here is stored only in your browser — nothing is uploaded.
            </p>
          </div>
        </header>

        <div className="grid gap-5">
          <Section title="Appearance" description="Pick a theme. “System” follows your operating system automatically.">
            <RadioGroup
              value={preference}
              onValueChange={(v) => setPreference(v as ThemePreference)}
              className="grid gap-3 sm:grid-cols-3"
            >
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <Label
                  key={value}
                  htmlFor={`theme-${value}`}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-secondary/30 p-4 transition-colors hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"
                >
                  <RadioGroupItem id={`theme-${value}`} value={value} />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{label}</span>
                </Label>
              ))}
            </RadioGroup>
          </Section>

          <Section title="Default landing page" description="Where the site opens when you visit the root URL.">
            <RadioGroup
              value={landing}
              onValueChange={(v) => {
                setLanding(v as LandingPage);
                toast.success("Default landing page updated");
              }}
              className="grid gap-3 sm:grid-cols-3"
            >
              {(
                [
                  ["home", "Home"],
                  ["tools", "All tools"],
                  ["favorites", "Favorites"],
                ] as const
              ).map(([value, label]) => (
                <Label
                  key={value}
                  htmlFor={`landing-${value}`}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-secondary/30 p-4 transition-colors hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"
                >
                  <RadioGroupItem id={`landing-${value}`} value={value} />
                  <span className="text-sm font-medium">{label}</span>
                </Label>
              ))}
            </RadioGroup>
          </Section>

          <Section title="Layout density" description="Compact fits more tool cards on screen; comfortable keeps the roomier spacing.">
            <RadioGroup
              value={density}
              onValueChange={(v) => setDensity(v as Density)}
              className="grid gap-3 sm:grid-cols-2"
            >
              {(
                [
                  ["comfortable", "Comfortable"],
                  ["compact", "Compact"],
                ] as const
              ).map(([value, label]) => (
                <Label
                  key={value}
                  htmlFor={`density-${value}`}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-secondary/30 p-4 transition-colors hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"
                >
                  <RadioGroupItem id={`density-${value}`} value={value} />
                  <span className="text-sm font-medium">{label}</span>
                </Label>
              ))}
            </RadioGroup>
          </Section>

          <Section title="Reset" description="Clear the data this site keeps in your browser.">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  reset([FAVORITES_KEY]);
                  toast.success("Favorites cleared");
                  window.setTimeout(() => window.location.reload(), 400);
                }}
              >
                <Star className="h-4 w-4" />
                Clear favorites
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  reset([FAVORITES_KEY, LANDING_KEY, DENSITY_KEY, THEME_KEY, "dt-theme", "devtk:recents"]);
                  toast.success("All preferences reset");
                  window.setTimeout(() => window.location.reload(), 400);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset all preferences
              </Button>
            </div>
          </Section>
        </div>
      </div>
    </SiteLayout>
  );
}

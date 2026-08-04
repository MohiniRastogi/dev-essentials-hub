import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Developer Toolkit" },
      { name: "description", content: "Developer Toolkit is 100% client-side: your data is processed in your browser and never uploaded, stored or shared." },
      { property: "og:title", content: "Privacy Policy — Developer Toolkit" },
      { property: "og:description", content: "How Developer Toolkit handles your data: it doesn't. Every tool runs locally in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

        <div className="glass-card mt-8 space-y-8 p-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Everything runs in your browser</h2>
            <p>
              Developer Toolkit is a collection of client-side developer tools. Whatever you paste, type or
              generate — JSON, code, text, passwords, hashes, images — is processed locally by JavaScript in
              your own browser. It is never uploaded to a server, because there is no server-side processing
              involved in any tool on this site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">What we don't collect</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>No accounts, no signup, no login — so no names, emails or passwords.</li>
              <li>No tool input or output is transmitted, logged or stored anywhere.</li>
              <li>No selling or sharing of personal data, because none is collected.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Local storage on your device</h2>
            <p>
              A few conveniences — your favorites, recently used tools and light/dark theme preference — are
              saved in your browser's local storage. This data stays on your device, is readable only by this
              site, and disappears when you clear your browser data.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Third parties</h2>
            <p>
              The site is served as static files and loads fonts and icons needed to render the interface.
              Some tools may access browser APIs you explicitly allow (for example your camera for the QR
              scanner) — that access happens locally and nothing captured is sent anywhere.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Changes and contact</h2>
            <p>
              If this policy changes, the updated version will be published on this page. Questions about
              privacy? Email{" "}
              <a href={siteConfig.contactMailto} className="text-foreground underline-offset-4 hover:text-primary hover:underline">
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Developer Toolkit" },
      { name: "description", content: "Simple terms of use for Developer Toolkit — free, client-side developer tools provided as-is with no signup." },
      { property: "og:title", content: "Terms of Use — Developer Toolkit" },
      { property: "og:description", content: "The straightforward terms for using Developer Toolkit's free online developer tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Terms of Use</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

        <div className="glass-card mt-8 space-y-8 p-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">1. Using the site</h2>
            <p>
              Developer Toolkit is free to use for personal and commercial work, with no signup or licence fee.
              By using the site you agree to these terms. Please don't attempt to disrupt the site, abuse it in
              an automated way, or use it for anything unlawful.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">2. Your data stays yours</h2>
            <p>
              All tools run entirely in your browser. We never receive, store or claim any rights over the
              content you paste, generate or download. You remain responsible for the data you process.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">3. Provided "as is"</h2>
            <p>
              The tools are provided as-is, without warranties of any kind. Output may contain errors, and
              results should be verified before you rely on them in production. Always keep your own backup of
              important input.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">4. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Developer Toolkit and its author are not liable for any
              loss or damage arising from use of the site, including data loss or business interruption.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">5. Availability and changes</h2>
            <p>
              Tools may be added, changed or removed at any time, and the site may be unavailable occasionally.
              These terms may be updated; the current version always lives on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">6. Contact</h2>
            <p>
              Questions about these terms? Email{" "}
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

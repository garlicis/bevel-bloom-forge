import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Bevel & Bloom" },
      {
        name: "description",
        content:
          "What data Bevel & Bloom collects, how it's stored, analytics cookies, and how to make access or deletion requests.",
      },
      { property: "og:title", content: "Privacy Policy — Bevel & Bloom" },
      {
        property: "og:description",
        content: "What data we collect, how it's stored, and how to reach us about it.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">Legal</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        What we collect, where it lives, and how to reach us about it.
      </p>

      <div className="mt-12 divide-y divide-border/70 border-y border-border/70">
        <div className="py-8">
          <h2 className="text-base font-medium sm:text-lg">Data we collect</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            When you place an order we collect your name, email address, shipping and billing
            address, and order history. This information is stored in our secure backend database.
          </p>
        </div>

        {/* TODO: once a payment processor is chosen, name it here and state that
            full card numbers are never stored on our servers. Do not invent a name. */}
        <div className="py-8">
          <h2 className="text-base font-medium sm:text-lg">Payment processing</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            [FILL IN once a payment processor is chosen — this section will name the processor and
            state that we never store full card numbers ourselves.]
          </p>
        </div>

        <div className="py-8">
          <h2 className="text-base font-medium sm:text-lg">Analytics</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We use Google Analytics (GA4) to understand how the site is used. GA4 sets cookies for
            site analytics.
          </p>
        </div>

        <div className="py-8">
          <h2 className="text-base font-medium sm:text-lg">Contact</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            For privacy questions, email privacy@bevelandbloom.com.
          </p>
        </div>

        {/* TODO: we ship to the EU/UK and California, so confirm which specific
            GDPR/CCPA disclosures and rights language are required before launch. */}
        <div className="py-8">
          <h2 className="text-base font-medium sm:text-lg">Your rights</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You can request access to, or deletion of, the personal data we hold about you at any
            time by emailing privacy@bevelandbloom.com. We will respond to rights requests within a
            reasonable timeframe.
          </p>
        </div>
      </div>
    </div>
  );
}

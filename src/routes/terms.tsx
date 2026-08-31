import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Bevel & Bloom" },
      {
        name: "description",
        content:
          "Bevel & Bloom's terms of service: acceptance, pricing and listing errors, intellectual property, safe-use disclaimer, and governing law.",
      },
      { property: "og:title", content: "Terms of Service — Bevel & Bloom" },
      {
        property: "og:description",
        content:
          "Terms of service, safe-use disclaimer for precision instruments, and governing law.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Acceptance of terms",
    body: "By accessing or purchasing from Bevel & Bloom, you agree to these Terms of Service. If you do not agree, please do not use the site.",
  },
  {
    title: "Pricing and listing errors",
    body: "We reserve the right to correct pricing, typographical, or listing errors at any time, including after an order has been placed. If a correction affects your order, we will contact you before processing it and you may cancel for a full refund.",
  },
  {
    title: "Intellectual property",
    body: "All content on this site — including text, images, logos, and product photography — is the property of Bevel & Bloom and may not be reproduced without written permission.",
  },
  {
    title: "Safe use of precision instruments",
    body: "Our products are sharp precision instruments, including shears, nippers, and tweezers. They must be used only as intended and with appropriate care. Keep out of reach of children. Bevel & Bloom is not liable for injury or damage resulting from misuse, modification, or failure to follow care instructions.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of the State of New York, USA, without regard to conflict-of-law principles. Any disputes will be resolved in the courts of New York County, New York.",
  },
  {
    title: "Contact",
    body: "Questions about these terms can be sent to support@bevelandbloom.com.",
  },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">Legal</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Terms of Service</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        The terms that govern your use of this site and purchases from it.
      </p>

      <div className="mt-12 divide-y divide-border/70 border-y border-border/70">
        {SECTIONS.map((section) => (
          <div key={section.title} className="py-8">
            <h2 className="text-base font-medium sm:text-lg">{section.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

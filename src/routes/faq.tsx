import { createFileRoute } from "@tanstack/react-router";

import { FAQJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Bevel & Bloom" },
      {
        name: "description",
        content:
          "Answers on steel, cleaning and sterilisation, shipping, and the Bevel & Bloom warranty and returns policy.",
      },
      { property: "og:title", content: "FAQ — Bevel & Bloom" },
      {
        property: "og:description",
        content: "Steel, care, shipping, and warranty questions for precision-forged beauty tools.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          FAQJsonLd([
            { q: "What steel are these tools made from?", a: "[FILL IN — exact steel type/grade. Don't leave this generic; customers in this niche actually check.]" },
            { q: "How do I clean and care for my tools?", a: "[FILL IN — real care/sterilization instructions. These tools contact skin, so this needs to be accurate, not guessed.]" },
            { q: "Where do you ship from, and how long does it take?", a: "[FILL IN — current fulfillment origin and realistic timeframe.]" },
            { q: "What's your warranty or return policy?", a: "[FILL IN — will also need to match the MerchantReturnPolicy schema added in Step 8, so keep the wording consistent when that step happens.]" },
          ]),
        ),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const faqs = [
    {
      q: "What steel are these tools made from?",
      a: "[FILL IN — exact steel type/grade. Don't leave this generic; customers in this niche actually check.]",
    },
    {
      q: "How do I clean and care for my tools?",
      a: "[FILL IN — real care/sterilization instructions. These tools contact skin, so this needs to be accurate, not guessed.]",
    },
    {
      q: "Where do you ship from, and how long does it take?",
      a: "[FILL IN — current fulfillment origin and realistic timeframe.]",
    },
    {
      q: "What's your warranty or return policy?",
      a: "[FILL IN — will also need to match the MerchantReturnPolicy schema added in Step 8, so keep the wording consistent when that step happens.]",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">Good to know</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Frequently Asked Questions</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Steel, care, shipping, and warranty — the questions professionals ask before they buy.
      </p>

      <div className="mt-12 divide-y divide-border/70 border-y border-border/70">
        {faqs.map((item) => (
          <div key={item.q} className="py-8">
            <h2 className="text-base font-medium sm:text-lg">{item.q}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
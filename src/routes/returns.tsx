import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Refunds — Bevel & Bloom" },
      {
        name: "description",
        content:
          "Bevel & Bloom's 14-day return policy: eligibility, hygiene requirements, return shipping, refunds, and how to start a return.",
      },
      { property: "og:title", content: "Returns & Refunds — Bevel & Bloom" },
      {
        property: "og:description",
        content:
          "14-day returns on unused, unopened tools. How refunds and return shipping work.",
      },
      { property: "og:url", content: "/returns" },
    ],
    links: [{ rel: "canonical", href: "/returns" }],
  }),
  component: ReturnsPage,
});

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Return window",
    body: "You have 14 days from the delivery date to start a return.",
  },
  {
    title: "Eligibility — unused and unopened only",
    body: "Items must be unused, unopened, and in their original packaging. Because these are personal-care tools that contact skin, opened or used items cannot be accepted for hygiene and safety reasons — no exceptions. Please check your order carefully before opening sealed packaging.",
  },
  {
    title: "Return shipping",
    body: "For change-of-mind returns, the customer covers return shipping. For defective or incorrect items, we cover return shipping and will issue a refund.",
  },
  {
    title: "Refund method",
    body: "Refunds are issued to your original payment method.",
  },
  {
    title: "How to start a return",
    body: "Email support@bevelandbloom.com with your order number to start a return. Once we receive the item, your refund is issued within 5 business days.",
  },
];

function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">Good to know</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Returns &amp; Refunds</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Our 14-day return policy, in plain terms.
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

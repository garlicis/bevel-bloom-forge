import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Bevel & Bloom" },
      {
        name: "description",
        content:
          "Where Bevel & Bloom ships from, processing times, delivery estimates, international shipping, and shipping costs.",
      },
      { property: "og:title", content: "Shipping — Bevel & Bloom" },
      {
        property: "og:description",
        content:
          "Shipping origins, processing times, delivery estimates, and costs for Bevel & Bloom orders.",
      },
      { property: "og:url", content: "/shipping" },
    ],
    links: [{ rel: "canonical", href: "/shipping" }],
  }),
  component: ShippingPage,
});

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Where we ship from",
    body: "All orders ship from our warehouse in Brooklyn, New York, USA.",
  },
  {
    title: "Processing time",
    body: "Orders are processed within 1–2 business days of being placed. You'll receive a confirmation email with tracking as soon as your order ships.",
  },
  {
    title: "Delivery estimate",
    body: "Domestic (US) orders typically arrive within 3–7 business days after dispatch.",
  },
  {
    title: "International shipping",
    body: "Yes — we ship to Canada, the United Kingdom, and the European Union. International delivery typically takes 7–14 business days after dispatch. Any customs duties or import taxes are the responsibility of the recipient.",
  },
  {
    title: "Shipping cost",
    body: "Free US shipping on orders over $75. A flat rate of $6.95 applies to US orders under $75. International rates are calculated at checkout.",
  },
];

function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">Delivery</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Shipping</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Where your order ships from, how long it takes, and what it costs.
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

import { Link, createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/hero.jpg";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { CATEGORIES, SLUG_BY_CATEGORY, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bevel & Bloom — Precision Forged Beauty Tools" },
      {
        name: "description",
        content:
          "Professional-grade stainless steel tweezers, nippers, shears and kits for salons, studios and self-care.",
      },
      { property: "og:title", content: "Bevel & Bloom — Precision Forged Beauty Tools" },
      {
        property: "og:description",
        content: "Professional-grade stainless steel tools for salons, studios, and self-care.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const { products, loading } = useStore();

  return (
    <div>
      <section className="border-b border-border/70">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow text-muted-foreground">Forged in Sialkot</p>
            <h1 className="display mt-5 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Precision Forged.
              <br />
              Beautifully Honed.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Professional-grade stainless steel tools for salons, studios, and self-care.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">Shop the Collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/shop/$category" params={{ category: "kits" }}>
                  Complete Kits
                </Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/70 pt-8">
              {[
                ["420", "Surgical steel"],
                ["2x", "Hand inspected"],
                ["∞", "Lifetime honing"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="display text-2xl">{value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative overflow-hidden rounded-sm bg-bloom-soft">
            <img
              src={heroImage}
              alt="Stainless steel beauty tools arranged on blush linen"
              width={1536}
              height={1152}
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              to="/shop/$category"
              params={{ category: SLUG_BY_CATEGORY[category] }}
              className="group rounded-sm border border-border bg-card p-6 transition-colors hover:border-foreground"
            >
              <p className="eyebrow text-muted-foreground">Collection</p>
              <p className="mt-3 text-base">{category}</p>
              <p className="mt-6 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                Explore →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <div className="flex items-end justify-between border-b border-border/70 pb-6">
          <div>
            <p className="eyebrow text-muted-foreground">Best Sellers</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">The Bench Essentials</h2>
          </div>
          <Link to="/shop" className="hidden text-xs text-muted-foreground hover:text-foreground sm:block">
            View all →
          </Link>
        </div>
        <div className="mt-12">
          <ProductGrid products={products.slice(0, 4)} loading={loading} />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 rounded-sm bg-bloom-soft px-8 py-14 sm:grid-cols-3 sm:px-14">
          {[
            ["Forged, not stamped", "Solid billet steel, ground and tempered by hand."],
            ["Clinically clean", "Autoclave safe and finished for salon sterilisation."],
            ["Honed for life", "Free re-sharpening on every tool, for as long as you own it."],
          ].map(([title, copy]) => (
            <div key={title}>
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

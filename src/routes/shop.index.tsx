import { Link, createFileRoute } from "@tanstack/react-router";

import { ProductGrid } from "@/components/product-grid";
import { CATEGORIES, SLUG_BY_CATEGORY, useStore } from "@/lib/store";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop All Tools — Bevel & Bloom" },
      {
        name: "description",
        content:
          "Browse every Bevel & Bloom tool: lash tweezers, cuticle nippers, barber shears and complete grooming kits.",
      },
      { property: "og:title", content: "Shop All Tools — Bevel & Bloom" },
      {
        property: "og:description",
        content: "Precision-forged stainless steel beauty tools for salons, studios and self-care.",
      },
    ],
  }),
  component: ShopIndex,
});

function ShopIndex() {
  const { products, loading } = useStore();

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">The Collection</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Shop All</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Every tool is forged, ground and hand-honed in Sialkot, then inspected twice before it
        reaches your bench.
      </p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-border/70 pb-8">
        <span className="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">
          All
        </span>
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            to="/shop/$category"
            params={{ category: SLUG_BY_CATEGORY[category] }}
            className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {category}
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}

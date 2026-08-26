import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { ProductGrid } from "@/components/product-grid";
import { CATEGORIES, CATEGORY_SLUGS, SLUG_BY_CATEGORY, useStore } from "@/lib/store";

export const Route = createFileRoute("/shop/$category")({
  loader: ({ params }) => {
    const category = CATEGORY_SLUGS[params.category];
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Collection not found — Bevel & Bloom" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.category} — Bevel & Bloom`;
    const description = `Professional-grade ${loaderData.category.toLowerCase()} tools, precision forged in stainless steel.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { products } = useStore();
  const filtered = products.filter((p) => p.category === category);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">The Collection</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">{category}</h1>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-border/70 pb-8">
        <Link
          to="/shop"
          className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          All
        </Link>
        {CATEGORIES.map((item) => (
          <Link
            key={item}
            to="/shop/$category"
            params={{ category: SLUG_BY_CATEGORY[item] }}
            className={
              item === category
                ? "rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground"
                : "rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            }
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

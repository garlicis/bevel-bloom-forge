import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { ProductGrid } from "@/components/product-grid";
import { fetchPublicProducts } from "@/lib/products";
import { breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { CATEGORIES, CATEGORY_SLUGS, SLUG_BY_CATEGORY, useStore } from "@/lib/store";

export const Route = createFileRoute("/shop/$category")({
  loader: async ({ params }) => {
    const category = CATEGORY_SLUGS[params.category];
    if (!category) throw notFound();
    let products: Awaited<ReturnType<typeof fetchPublicProducts>> = [];
    try {
      products = (await fetchPublicProducts()).filter((p) => p.category === category);
    } catch {
      products = [];
    }
    return { category, products };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Collection not found — Bevel & Bloom" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.category} — Bevel & Bloom`;
    const description = `Professional-grade ${loaderData.category.toLowerCase()} tools, precision forged in stainless steel.`;
    // Canonical always uses the current slug so legacy slugs don't duplicate pages.
    const path = `/shop/${SLUG_BY_CATEGORY[loaderData.category]}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: path },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            productListJsonLd(loaderData.category, path, loaderData.products),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: loaderData.category, path },
            ]),
          ),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { products, loading } = useStore();
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
        <ProductGrid products={filtered} loading={loading} />
      </div>
    </div>
  );
}

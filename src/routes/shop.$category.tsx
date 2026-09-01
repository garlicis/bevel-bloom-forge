import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";

import { ProductGrid } from "@/components/product-grid";
import { fetchGuidesByCategory } from "@/lib/guides";
import { fetchPublicProducts } from "@/lib/products";
import { breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { CATEGORIES, CATEGORY_SLUGS, SLUG_BY_CATEGORY, useStore, type Category } from "@/lib/store";

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

const CATEGORY_INTROS: Record<Category, string> = {
  "Lash & Brow":
    "Fiber-tip and stainless steel tweezers built for the control isolation work demands — whether you're doing volume sets or precision brow shaping.",
  "Nail & Cuticle":
    "Manicure, pedicure, and podiatry-grade tools forged for clean, controlled cuts — built for daily salon use, not once-a-year home kits.",
  "Barber & Hair":
    "Convex-edge shears honed for barbers who can feel the difference between a stamped pair and a forged one.",
  Kits: "Complete travel and studio kits — the full tool set in one case, for professionals who need everything on hand.",
};

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { products, loading } = useStore();
  const filtered = products.filter((p) => p.category === category);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">The Collection</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">{category}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {CATEGORY_INTROS[category]}
      </p>

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

      <GuidesModule category={category} />
    </div>
  );
}

function GuidesModule({ category }: { category: Category }) {
  const { data: guides = [] } = useQuery({
    queryKey: ["guides", category],
    queryFn: () => fetchGuidesByCategory(category),
  });

  if (guides.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="display text-2xl">Guides</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            to="/guides/$slug"
            params={{ slug: guide.slug }}
            className="group rounded-sm border border-border bg-card p-6 shadow-soft transition-colors hover:border-foreground/30"
          >
            <h3 className="display text-lg leading-snug group-hover:underline">
              {guide.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {guide.excerpt}
            </p>
            <span className="mt-3 inline-block text-xs font-medium uppercase tracking-wider text-primary">
              Read guide
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchPublicProduct } from "@/lib/products";
import { getRequestOrigin } from "@/lib/origin.functions";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { SLUG_BY_CATEGORY, formatPrice, useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const product = await fetchPublicProduct(params.id).catch(() => null);
    if (!product) throw notFound();
    let origin = "";
    try {
      origin = await getRequestOrigin();
    } catch {
      origin = "";
    }
    return { product, origin };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — Bevel & Bloom" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product, origin } = loaderData;
    const path = `/product/${params.id}`;
    const title = `${product.name} — Bevel & Bloom`;
    const description =
      product.description ||
      `${product.name}: professional-grade ${product.category.toLowerCase()} tool, precision forged in stainless steel.`;
    const image = product.image.startsWith("http")
      ? product.image
      : `${origin}${product.image}`;
    const categoryPath = `/shop/${SLUG_BY_CATEGORY[product.category]}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: path },
        ...(image.startsWith("http")
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(productJsonLd(product, path, image)),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: product.category, path: categoryPath },
              { name: product.name, path },
            ]),
          ),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, setCartOpen } = useStore();
  const categorySlug = SLUG_BY_CATEGORY[product.category];

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to="/shop/$category"
              params={{ category: categorySlug }}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <article className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-sm bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">{product.category}</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-lg tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          <Button
            size="lg"
            className="mt-9"
            onClick={() => {
              addToCart(product.id);
              toast.success("Added to cart", {
                description: product.name,
                action: { label: "View cart", onClick: () => setCartOpen(true) },
              });
            }}
          >
            Add to Cart
          </Button>
        </div>
      </article>
    </div>
  );
}

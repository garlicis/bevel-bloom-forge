import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatPrice, useStore, type Product } from "@/lib/store";

function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, setCartOpen } = useStore();

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
        <Link to="/product/$id" params={{ id: product.id }} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            className="w-full"
            size="sm"
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
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">{product.category}</p>
          <h3 className="mt-1.5 text-sm font-medium leading-snug">
            <Link to="/product/$id" params={{ id: product.id }} className="hover:underline">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="shrink-0 text-sm tabular-nums">{formatPrice(product.price)}</p>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {product.description}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 sm:hidden"
        onClick={() => {
          addToCart(product.id);
          toast.success("Added to cart", { description: product.name });
        }}
      >
        Add to Cart
      </Button>
    </article>
  );
}

export function ProductGrid({
  products,
  loading = false,
}: {
  products: Product[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-square animate-pulse rounded-sm bg-muted" />
            <div className="mt-4 h-3 w-1/3 animate-pulse rounded-sm bg-muted" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-sm bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        No products in this collection yet.
      </p>
    );
  }


  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 2} />
      ))}
    </div>
  );
}

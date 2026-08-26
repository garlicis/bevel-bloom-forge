import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatPrice, useStore, type Product } from "@/lib/store";

function ProductCard({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useStore();

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
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
          <h3 className="mt-1.5 text-sm font-medium leading-snug">{product.name}</h3>
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

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        No products in this collection yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

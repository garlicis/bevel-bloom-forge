import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice, useStore } from "@/lib/store";

export function CartSheet() {
  const {
    cartOpen,
    setCartOpen,
    detailedCart,
    setQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useStore();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/70">
          <SheetTitle className="display text-xl">Your Cart</SheetTitle>
          <SheetDescription>Complimentary shipping on orders over $75.</SheetDescription>
        </SheetHeader>

        {detailedCart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button variant="ghost" onClick={() => setCartOpen(false)}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {detailedCart.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4">
                  <div className="size-20 shrink-0 overflow-hidden rounded-sm bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium leading-snug">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-sm border border-border">
                        <button
                          className="px-2 py-1 text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-7 text-center text-sm tabular-nums">{quantity}</span>
                        <button
                          className="px-2 py-1 text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm tabular-nums">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/70 px-6 py-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
              <Separator className="my-4" />
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  toast.success("Order placed", {
                    description: `${formatPrice(cartTotal)} — a confirmation is on its way.`,
                  });
                  clearCart();
                  setCartOpen(false);
                }}
              >
                Checkout
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Taxes calculated at checkout.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

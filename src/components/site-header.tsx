import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";

const NAV = [
  { label: "Shop All", to: "/shop" as const, params: undefined },
  { label: "Manicure / Pedicure", to: "/shop/$category" as const, params: { category: "nail-cuticle" } },
  { label: "Lash & Brow", to: "/shop/$category" as const, params: { category: "lash-brow" } },
  { label: "Pro Shears", to: "/shop/$category" as const, params: { category: "barber-hair" } },
];

export function SiteHeader() {
  const { cartCount, setCartOpen, hydrated } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <nav className="mt-8 flex flex-col gap-5">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    params={item.params as never}
                    className="text-sm tracking-wide text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link to="/admin" className="text-sm text-muted-foreground">
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="display text-xl leading-none tracking-tight sm:text-2xl">
            Bevel <span className="text-bloom-foreground">&</span> Bloom
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              params={item.params as never}
              activeProps={{ className: "text-foreground" }}
              className="text-[0.8rem] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open cart"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag className="size-5" />
          {hydrated && cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-medium text-primary-foreground">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}

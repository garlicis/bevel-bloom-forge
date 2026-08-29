import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="display text-xl">Bevel &amp; Bloom</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Precision-forged stainless steel tools, hand-finished in Sialkot for salons, studios
            and considered self-care.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow text-muted-foreground">Shop</p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-foreground">
                Shop All
              </Link>
            </li>
            <li>
              <Link to="/shop/$category" params={{ category: "lash-brow" }} className="hover:text-foreground">
                Lash &amp; Brow
              </Link>
            </li>
            <li>
              <Link to="/shop/$category" params={{ category: "nail-cuticle" }} className="hover:text-foreground">
                Nail &amp; Cuticle
              </Link>
            </li>
            <li>
              <Link to="/shop/$category" params={{ category: "kits" }} className="hover:text-foreground">
                Complete Kits
              </Link>
            </li>
          </ul>
        </div>
<div className="text-sm">
          <p className="eyebrow text-muted-foreground">Care</p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>Lifetime sharpening</li>
            <li>Autoclave safe</li>
            <li>Free US shipping over $75</li>
            <li>
              <Link to="/faq" className="hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-foreground">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 px-5 py-6 text-center text-xs text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} Bevel &amp; Bloom. All rights reserved.
      </div>
    </footer>
  );
}

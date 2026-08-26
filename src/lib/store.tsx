import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { usePublicProducts } from "@/lib/products";

export const CATEGORIES = [
  "Lash & Brow",
  "Nail & Cuticle",
  "Barber & Hair",
  "Kits",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<string, Category> = {
  "lash-brow": "Lash & Brow",
  "nail-cuticle": "Nail & Cuticle",
  "barber-hair": "Barber & Hair",
  kits: "Kits",
};

export const SLUG_BY_CATEGORY: Record<Category, string> = {
  "Lash & Brow": "lash-brow",
  "Nail & Cuticle": "nail-cuticle",
  "Barber & Hair": "barber-hair",
  Kits: "kits",
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  cost?: number;
  image: string;
};

export type CartLine = { productId: string; quantity: number };

const CART_KEY = "bb.cart.v1";

type StoreValue = {
  products: Product[];
  loading: boolean;
  cart: CartLine[];
  hydrated: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  detailedCart: { product: Product; quantity: number }[];
};

const StoreContext = createContext<StoreValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { data: products = [], isLoading } = usePublicProducts();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setCart(read<CartLine[]>(CART_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  // Live-refresh the storefront when the admin adds/edits/deletes a product.
  useEffect(() => {
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const found = prev.find((l) => l.productId === productId);
      if (found) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const detailedCart = useMemo(
    () =>
      cart
        .map((line) => {
          const product = products.find((p) => p.id === line.productId);
          return product ? { product, quantity: line.quantity } : null;
        })
        .filter((v): v is { product: Product; quantity: number } => v !== null),
    [cart, products],
  );

  const value: StoreValue = {
    products,
    loading: isLoading,
    cart,
    hydrated,
    cartOpen,
    setCartOpen,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    cartCount: detailedCart.reduce((n, l) => n + l.quantity, 0),
    cartTotal: detailedCart.reduce((n, l) => n + l.quantity * l.product.price, 0),
    detailedCart,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import lashTweezers from "@/assets/lash-tweezers.jpg";
import podiatryNipper from "@/assets/podiatry-nipper.jpg";
import groomingKit from "@/assets/grooming-kit.jpg";
import barberShear from "@/assets/barber-shear.jpg";

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

export const SEED_PRODUCTS: Product[] = [
  {
    id: "seed-lash-tweezers",
    name: "Pro-Grip Fiber Tip Lash Tweezers",
    description:
      "Hand-honed fiber tips for isolation and volume fanning. Anti-glare matte finish, perfectly balanced in the hand.",
    category: "Lash & Brow",
    price: 24,
    cost: 7.5,
    image: lashTweezers,
  },
  {
    id: "seed-podiatry-nipper",
    name: "Heavy-Duty Podiatry Nipper",
    description:
      "Forged 420 stainless with a double-spring action and precision-ground jaws for thick, resistant nails.",
    category: "Nail & Cuticle",
    price: 28,
    cost: 9,
    image: podiatryNipper,
  },
  {
    id: "seed-grooming-kit",
    name: "12-Piece Leather Travel Grooming Kit",
    description:
      "A complete manicure and pedicure set in a soft blush leather roll. Everything honed, cased, and travel ready.",
    category: "Kits",
    price: 45,
    cost: 16,
    image: groomingKit,
  },
  {
    id: "seed-barber-shear",
    name: "6-inch Convex Edge Barber Shear",
    description:
      "Mirror-polished convex blades with an adjustable tension knob for silent, effortless slice cutting.",
    category: "Barber & Hair",
    price: 65,
    cost: 22,
    image: barberShear,
  },
];

export type CartLine = { productId: string; quantity: number };

const PRODUCTS_KEY = "bb.products.v1";
const CART_KEY = "bb.cart.v1";

type StoreValue = {
  products: Product[];
  cart: CartLine[];
  hydrated: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addProduct: (input: Omit<Product, "id">) => void;
  updateProduct: (id: string, input: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
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
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setProducts(read<Product[]>(PRODUCTS_KEY, SEED_PRODUCTS));
    setCart(read<CartLine[]>(CART_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addProduct = useCallback((input: Omit<Product, "id">) => {
    setProducts((prev) => [{ ...input, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, input: Omit<Product, "id">) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...input, id } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((l) => l.productId !== id));
  }, []);

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
    cart,
    hydrated,
    cartOpen,
    setCartOpen,
    addProduct,
    updateProduct,
    deleteProduct,
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

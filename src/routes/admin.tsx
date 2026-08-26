import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CATEGORIES,
  formatPrice,
  useStore,
  type Category,
  type Product,
} from "@/lib/store";

const PASSCODE = "bloom2024";
const AUTH_KEY = "bb.admin.session";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Bevel & Bloom" },
      { name: "description", content: "Internal product management for Bevel & Bloom." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin — Bevel & Bloom" },
      { property: "og:description", content: "Internal product management." },
    ],
  }),
  component: AdminPage,
});

const EMPTY = {
  name: "",
  description: "",
  category: "Lash & Brow" as Category,
  price: "",
  cost: "",
  image: "",
};

function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(AUTH_KEY) === "ok");
  }, []);

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
        <div className="rounded-sm border border-border bg-card p-8 shadow-soft">
          <Lock className="size-5 text-muted-foreground" />
          <h1 className="display mt-4 text-2xl">Studio Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the internal passcode to manage inventory.
          </p>
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (code === PASSCODE) {
                sessionStorage.setItem(AUTH_KEY, "ok");
                setUnlocked(true);
              } else {
                toast.error("Incorrect passcode");
              }
            }}
          >
            <Input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Passcode"
              autoFocus
            />
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">Demo passcode: bloom2024</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      cost: product.cost != null ? String(product.cost) : "",
      image: product.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || Number.isNaN(price) || price <= 0) {
      toast.error("Add a product name and a valid price.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price,
      ...(form.cost ? { cost: Number(form.cost) } : {}),
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    };

    if (editingId) {
      updateProduct(editingId, payload);
      toast.success("Product updated", { description: payload.name });
    } else {
      addProduct(payload);
      toast.success("Product saved", { description: `${payload.name} is now live in the shop.` });
    }
    setForm(EMPTY);
    setEditingId(null);
  };

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">Internal</p>
      <h1 className="display mt-3 text-4xl">Product Studio</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {products.length} products · catalogue value {formatPrice(totalValue)}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[380px_1fr]">
        <form
          onSubmit={submit}
          className="h-fit space-y-4 rounded-sm border border-border bg-card p-6 shadow-soft"
        >
          <h2 className="text-sm font-medium">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Curved Cuticle Nipper"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Hand-honed jaws, double spring action…"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v as Category })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="28.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost (internal)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                placeholder="9.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://…"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              Save Product
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="rounded-sm border border-border bg-card shadow-soft">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-medium">Product List</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="size-10 rounded-sm object-cover"
                        />
                        <span className="text-sm">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                      {product.cost != null ? formatPrice(product.price - product.cost) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => startEdit(product)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => {
                            deleteProduct(product.id);
                            toast.success("Product deleted");
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

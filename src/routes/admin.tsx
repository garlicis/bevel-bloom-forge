import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Lock, LogOut, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";

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
import { supabase } from "@/integrations/supabase/client";
import {
  useAdminProducts,
  useProductMutations,
  uploadProductImage,
} from "@/lib/products";
import {
  CATEGORIES,
  formatPrice,
  useStore,
  type Category,
  type Product,
} from "@/lib/store";

export const Route = createFileRoute("/admin")({
  ssr: false,
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
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (checking) {
    return <div className="min-h-[70vh]" />;
  }

  if (!session) {
    return <LoginScreen />;
  }

  return <AdminDashboard email={session.user.email ?? ""} />;
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <div className="rounded-sm border border-border bg-card p-8 shadow-soft">
        <Lock className="size-5 text-muted-foreground" />
        <h1 className="display mt-4 text-2xl">Studio Access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with your admin account to manage inventory.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            setBusy(false);
            if (error) toast.error(error.message);
          }}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            autoFocus
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ email }: { email: string }) {
  const { data: products = [], isLoading, error } = useAdminProducts();
  const { createProduct, updateProduct, deleteProduct } = useProductMutations();
  const { clearCart } = useStore();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || Number.isNaN(price) || price <= 0) {
      toast.error("Add a product name and a valid price.");
      return;
    }
    const input = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price,
      cost: form.cost ? Number(form.cost) : null,
      image: form.image.trim(),
    };

    try {
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, input });
        toast.success("Product updated", { description: input.name });
      } else {
        await createProduct.mutateAsync(input);
        toast.success("Product saved", {
          description: `${input.name} is now live in the shop.`,
        });
      }
      setForm(EMPTY);
      setEditingId(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save product");
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">Internal</p>
          <h1 className="display mt-3 text-4xl">Product Studio</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {products.length} products · catalogue value {formatPrice(totalValue)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{email}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              clearCart();
              await supabase.auth.signOut();
              toast.success("Signed out");
            }}
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-sm border border-border bg-card p-4 text-sm text-muted-foreground">
          This account doesn't have admin access yet.
        </p>
      )}

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
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              ref={fileInput}
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const url = await uploadProductImage(file);
                  setForm((prev) => ({ ...prev, image: url }));
                  toast.success("Image uploaded");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Upload failed");
                } finally {
                  setUploading(false);
                }
              }}
            />
            {uploading && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Upload className="size-3" /> Uploading…
              </p>
            )}
            {form.image && !uploading && (
              <img
                src={form.image}
                alt="Product preview"
                className="size-16 rounded-sm object-cover"
              />
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" disabled={uploading}>
              Save Product
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY);
                  if (fileInput.current) fileInput.current.value = "";
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
            {isLoading ? (
              <p className="px-6 py-10 text-sm text-muted-foreground">Loading products…</p>
            ) : products.length === 0 ? (
              <p className="px-6 py-10 text-sm text-muted-foreground">
                No products yet. Add your first one on the left.
              </p>
            ) : (
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
                            onClick={async () => {
                              try {
                                await deleteProduct.mutateAsync(product.id);
                                toast.success("Product deleted");
                              } catch (err) {
                                toast.error(
                                  err instanceof Error ? err.message : "Could not delete",
                                );
                              }
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

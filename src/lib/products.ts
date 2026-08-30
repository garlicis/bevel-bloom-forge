import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/lib/store";

const PUBLIC_COLUMNS = "id, name, description, category, price, image_url, created_at";

export type ProductInput = {
  name: string;
  description: string;
  category: Category;
  price: number;
  cost?: number | null;
  image: string;
};

type Row = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | string;
  cost?: number | string | null;
  image_url: string | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80";

export function toProduct(row: Row): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    category: row.category as Category,
    price: Number(row.price),
    ...(row.cost != null ? { cost: Number(row.cost) } : {}),
    image: row.image_url || FALLBACK_IMAGE,
  };
}

/** Storefront read — never selects the internal `cost` column. */
export function usePublicProducts() {
  return useQuery({
    queryKey: ["products", "public"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(PUBLIC_COLUMNS)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Row[]).map(toProduct);
    },
  });
}

/** Admin read — includes the internal cost column (admin-only via RLS). */
export function useAdminProducts() {
  return useQuery({
    queryKey: ["products", "admin"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Row[]).map(toProduct);
    },
  });
}

function payload(input: ProductInput) {
  return {
    name: input.name,
    description: input.description,
    category: input.category,
    price: input.price,
    cost: input.cost ?? null,
    image_url: input.image,
  };
}

export function useProductMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["products"] });

  const createProduct = useMutation({
    mutationFn: async (input: ProductInput) => {
      const { error } = await supabase.from("products").insert(payload(input));
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: ProductInput }) => {
      const { error } = await supabase.from("products").update(payload(input)).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { createProduct, updateProduct, deleteProduct };
}

function supportsWebp(): boolean {
  try {
    return document
      .createElement("canvas")
      .toDataURL("image/webp")
      .startsWith("data:image/webp");
  } catch {
    return false;
  }
}

/** Compresses in the browser before upload. Library is loaded on demand so it
 *  never lands in the storefront bundle. */
async function compressImage(file: File): Promise<File> {
  try {
    const { default: imageCompression } = await import("browser-image-compression");
    const webp = supportsWebp();
    return await imageCompression(file, {
      maxWidthOrHeight: 1600,
      maxSizeMB: 0.2,
      useWebWorker: true,
      initialQuality: 0.82,
      ...(webp ? { fileType: "image/webp" } : {}),
    });
  } catch {
    return file;
  }
}

export async function uploadProductImage(rawFile: File): Promise<string> {
  const file = await compressImage(rawFile);
  const ext = (file.type.split("/")[1] ?? rawFile.name.split(".").pop() ?? "jpg").replace(
    "jpeg",
    "jpg",
  );
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signError || !data) throw signError ?? new Error("Could not create image URL");
  return data.signedUrl;
}

/** Non-hook storefront read, usable from route loaders (SSR-safe). */
export async function fetchPublicProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(toProduct);
}

/** Non-hook single-product read, usable from route loaders (SSR-safe). */
export async function fetchPublicProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toProduct(data as Row) : null;
}

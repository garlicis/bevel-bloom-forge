import { supabase } from "@/integrations/supabase/client";

export type GuideFaq = { q: string; a: string };

export type Guide = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  faq: GuideFaq[] | null;
  is_howto: boolean;
  published: boolean;
  created_at: string;
};

const COLUMNS =
  "id, slug, title, excerpt, category, body, faq, is_howto, published, created_at";

/** All published guides, newest first. Public (RLS: published only). */
export async function fetchPublishedGuides(): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("guides")
    .select(COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Guide[];
}

/** Published guides for one storefront category (e.g. "Lash & Brow"). */
export async function fetchGuidesByCategory(category: string): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("guides")
    .select(COLUMNS)
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Guide[];
}

/** Single published guide by slug; null when missing/unpublished. */
export async function fetchGuideBySlug(slug: string): Promise<Guide | null> {
  const { data, error } = await supabase
    .from("guides")
    .select(COLUMNS)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Guide) ?? null;
}

/** Split a guide body into paragraphs on blank lines. */
export function guideParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

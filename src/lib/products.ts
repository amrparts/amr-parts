import "server-only";
import { createClient } from "@supabase/supabase-js";
import { sampleProducts, type Product } from "./catalog";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Row = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  brand: string | null;
  models: string[] | null;
  price: number;
  stock: number;
  badge: Product["badge"];
  featured: boolean;
  created_at: string;
  description: string | null;
  specs: Record<string, string> | null;
  images: string[] | null;
};

const fromRow = (r: Row): Product => ({
  slug: r.slug,
  sku: r.sku,
  name: r.name,
  category: r.category,
  brand: r.brand,
  models: r.models ?? [],
  price: Number(r.price),
  stock: r.stock,
  badge: r.badge,
  featured: r.featured,
  createdAt: r.created_at,
  description: r.description ?? "",
  specs: r.specs ?? {},
  images: r.images ?? [],
});

/** All visible products. Uses the sample catalog until Supabase env vars are set. */
export async function getProducts(): Promise<Product[]> {
  if (!url || !key) return sampleProducts;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("products")
    .select("slug, sku, name, category, brand, models, price, stock, badge, featured, created_at, description, specs, images")
    .eq("visible", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[products] Supabase read failed, using sample catalog:", error.message);
    return sampleProducts;
  }
  return (data as Row[]).map(fromRow);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

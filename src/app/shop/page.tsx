import type { Metadata } from "next";
import { ShopView, type ShopParams } from "./ShopView";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Shop Parts" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]) ?? "";
  const params: ShopParams = {
    q: one("q"),
    brands: one("brand").split(",").filter(Boolean),
    model: one("model"),
    category: one("category"),
    group: one("group"),
    sort: one("sort") || "newest",
    focus: one("focus") === "1",
  };
  const products = await getProducts();
  // Re-mount when the URL changes from outside (header search, nav links) so state follows it.
  return <ShopView key={JSON.stringify(params)} products={products} initial={params} />;
}

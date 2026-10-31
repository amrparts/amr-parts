import type { Metadata } from "next";
import { BrandGrid, CategoryGrid, SectionHead } from "@/components/Sections";
import { getProducts } from "@/lib/products";

// Refresh product data from Supabase at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const counts = (await getProducts()).reduce<Record<string, number>>((m, p) => {
    if (p.brand) m[p.brand] = (m[p.brand] ?? 0) + 1;
    return m;
  }, {});
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6">
      <section>
        <SectionHead title="All Categories" sub="Browse our wide range of motorcycle parts and accessories." />
        <CategoryGrid />
      </section>
      <section>
        <SectionHead title="Shop by Brand" />
        <BrandGrid counts={counts} />
      </section>
    </div>
  );
}

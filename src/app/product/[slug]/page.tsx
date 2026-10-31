import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHead, ProductRow } from "@/components/Sections";
import { brandBySlug, categoryBySlug, fitsLabel } from "@/lib/catalog";
import { getProduct, getProducts } from "@/lib/products";
import { ProductView } from "./ProductView";

// Refresh product data from Supabase at most once a minute.
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: `${p.name} — ${fitsLabel(p)}`, description: p.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const category = categoryBySlug(product.category);
  const related = (await getProducts())
    .filter((p) => p.slug !== product.slug && (p.category === product.category || (product.brand && p.brand === product.brand)))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-5 flex flex-wrap gap-1 text-xs text-muted">
        <Link href="/" className="hover:text-brand">Home</Link> /
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand">{category?.name}</Link> /
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductView product={product} brandName={brandBySlug(product.brand)?.name ?? null} categoryName={category?.name ?? ""} />

      {related.length > 0 && (
        <section className="pt-14">
          <SectionHead title="You May Also Need" href={`/shop?category=${product.category}`} />
          <ProductRow products={related} />
        </section>
      )}
    </div>
  );
}

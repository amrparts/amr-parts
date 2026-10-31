import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brands, categories, type Product } from "@/lib/catalog";
import { CategoryIcon } from "./CategoryIcon";
import { ProductCard } from "./ProductCard";

export function SectionHead({ title, sub, href, cta = "View All" }: { title: string; sub?: string; href?: string; cta?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-navy sm:text-2xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline">
          {cta} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

export function BrandGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
      {brands.map((b) => (
        <Link
          key={b.slug}
          href={`/shop?brand=${b.slug}`}
          className="group flex flex-col rounded-xl border border-line bg-white p-3 transition hover:border-brand/40 hover:shadow-lg sm:p-4"
        >
          <span className="grid h-16 place-items-center rounded-lg bg-soft sm:h-20">
            <span className="font-display text-lg font-extrabold uppercase italic tracking-tight sm:text-2xl" style={{ color: b.colour }}>
              {b.name}
            </span>
          </span>
          <span className="mt-3 flex items-center justify-between text-sm font-semibold">
            {b.name}
            <ArrowRight className="size-4 text-brand transition group-hover:translate-x-0.5" />
          </span>
          <span className="text-xs text-muted">{counts[b.slug] ?? 0} parts</span>
        </Link>
      ))}
    </div>
  );
}

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/shop?category=${c.slug}`}
          className="group flex flex-col rounded-xl border border-line bg-white p-3 transition hover:border-brand/40 hover:shadow-lg sm:p-4"
        >
          <span className="grid aspect-[4/3] place-items-center rounded-lg bg-gradient-to-br from-soft to-[#e6ecf6]">
            <CategoryIcon category={c.slug} className="size-12 text-navy-2/80 transition group-hover:scale-110 group-hover:text-brand" />
          </span>
          <span className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold">
            {c.name}
            <ArrowRight className="size-4 shrink-0 text-brand transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {products.map((p) => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}

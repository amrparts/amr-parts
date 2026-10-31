"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { categoryBySlug, fitsLabel, formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";

const badgeLabel = { popular: "Popular", new: "New", limited: "Limited" } as const;

export function StockBadge({ stock }: { stock: number }) {
  return stock > 0 ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stock">
      <span className="size-2 rounded-full bg-stock" /> In Stock
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
      <span className="size-2 rounded-full bg-muted/50" /> Out of Stock
    </span>
  );
}

export function ProductCard({ product: p, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:border-brand/40 hover:shadow-lg">
      <Link href={`/product/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <ProductImage src={p.images[0]} alt={p.name} category={p.category} sizes="(min-width: 1024px) 25vw, 50vw" />
        {p.badge && (
          <span className="absolute left-2.5 top-2.5 rounded bg-popular px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {badgeLabel[p.badge]}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {!compact && <p className="text-[11px] text-muted">{categoryBySlug(p.category)?.name}</p>}
        <Link href={`/product/${p.slug}`} className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug hover:text-brand">
          {p.name}
        </Link>
        <p className="mt-0.5 truncate text-xs text-muted">{fitsLabel(p)}</p>
        <p className="mt-2 font-display text-base font-bold text-brand sm:text-lg">{formatPrice(p.price)}</p>
        <div className="mt-1"><StockBadge stock={p.stock} /></div>
        <button
          onClick={() => add(p)}
          disabled={p.stock < 1}
          className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-brand/30 bg-brand-soft py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:bg-soft disabled:text-muted sm:text-sm"
        >
          <ShoppingCart className="size-4" /> {p.stock > 0 ? "Add to Inquiry" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}

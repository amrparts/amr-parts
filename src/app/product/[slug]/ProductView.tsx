"use client";

import { useState } from "react";
import { MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { StockBadge } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { fitsLabel, formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/whatsapp";

const tabs = ["Description", "Specifications", "Compatible Bikes"] as const;

export function ProductView({ product: p, brandName, categoryName }: { product: Product; brandName: string | null; categoryName: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [photo, setPhoto] = useState(0);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");
  const photos = p.images.length ? p.images : [undefined];
  const soldOut = p.stock < 1;

  const specs: Record<string, string> = {
    "Brand Compatibility": brandName ?? "Universal",
    "Model Compatibility": p.models.length ? p.models.join(", ") : "Universal fit",
    ...p.specs,
    SKU: p.sku,
  };

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-line">
            <ProductImage src={photos[photo]} alt={p.name} category={p.category} sizes="(min-width: 1024px) 50vw, 100vw" priority iconClass="size-1/3" />
          </div>
          {photos.length > 1 && (
            <div className="mt-3 flex gap-3">
              {photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setPhoto(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`relative size-20 overflow-hidden rounded-lg border-2 ${i === photo ? "border-brand" : "border-line"}`}
                >
                  <ProductImage src={src} alt="" category={p.category} sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-muted">{categoryName}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-navy sm:text-3xl">{p.name}</h1>
          <p className="mt-1 text-sm text-muted">SKU: {p.sku}</p>

          <div className="mt-4 flex items-center gap-4">
            <p className="font-display text-3xl font-bold text-brand">{formatPrice(p.price)}</p>
            <StockBadge stock={p.stock} />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Compatible With</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {brandName ? (
                <>
                  <span className="rounded-lg border border-brand/30 bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">{brandName}</span>
                  {p.models.map((m) => (
                    <span key={m} className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium">{m}</span>
                  ))}
                </>
              ) : (
                <span className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium">Universal Fit</span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Quantity</p>
            <div className="mt-2 inline-flex items-center rounded-lg border border-line">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease" className="p-3 disabled:opacity-30">
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} disabled={qty >= p.stock} aria-label="Increase" className="p-3 disabled:opacity-30">
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => add(p, qty)}
              disabled={soldOut}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand py-3.5 font-semibold text-white hover:bg-brand-dark disabled:bg-line disabled:text-muted"
            >
              <ShoppingCart className="size-5" /> {soldOut ? "Out of Stock" : "Add to Inquiry"}
            </button>
            <a
              href={whatsappLink(`Hi AMR Parts! I'm asking about: ${p.name} (${p.sku}) — ${fitsLabel(p)}. Qty ${qty}.`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp py-3.5 font-semibold text-white hover:bg-whatsapp-dark"
            >
              <MessageCircle className="size-5" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex gap-6 overflow-x-auto border-b border-line no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px shrink-0 border-b-2 py-3 text-sm font-semibold ${tab === t ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-6 text-sm leading-relaxed">
          {tab === "Description" && <p className="max-w-3xl text-muted">{p.description}</p>}
          {tab === "Specifications" && (
            <dl className="max-w-xl divide-y divide-line rounded-xl border border-line">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-4 px-4 py-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === "Compatible Bikes" && (
            <p className="text-muted">
              Fits: <span className="font-medium text-ink">{fitsLabel(p)}</span>. Not sure it fits your bike? Send us your model and year on WhatsApp and we&apos;ll check for you.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

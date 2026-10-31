"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { brands, brandBySlug, categories, categoryBySlug, fitsLabel, formatPrice, type Product } from "@/lib/catalog";

export type ShopParams = {
  q: string;
  brands: string[];
  model: string;
  category: string;
  group: string;
  sort: string;
  focus: boolean;
};

const groupNames: Record<string, string> = { spare: "Spare Parts", modification: "Modification Parts", accessories: "Accessories" };

const selectCls =
  "h-10 w-full rounded-lg border border-line bg-white pl-3 pr-9 text-sm outline-none focus:border-brand";

function SelectBox(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...props} className={selectCls} />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </span>
  );
}

export function ShopView({ products, initial }: { products: Product[]; initial: ShopParams }) {
  const priceCeiling = Math.max(1000, Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 1000);

  const [q, setQ] = useState(initial.q);
  const [picked, setPicked] = useState<string[]>(initial.brands);
  const [model, setModel] = useState(initial.model);
  const [category, setCategory] = useState(initial.category);
  const [group, setGroup] = useState(initial.group);
  const [sort, setSort] = useState(initial.sort);
  const [maxPrice, setMaxPrice] = useState(priceCeiling);
  const [inStock, setInStock] = useState(true);
  const [outStock, setOutStock] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Keep the address bar shareable without a server round-trip.
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (picked.length) p.set("brand", picked.join(","));
    if (model) p.set("model", model);
    if (category) p.set("category", category);
    else if (group) p.set("group", group);
    if (sort !== "newest") p.set("sort", sort);
    window.history.replaceState(null, "", `/shop${p.size ? `?${p}` : ""}`);
  }, [q, picked, model, category, group, sort]);

  const modelOptions = picked.length === 1 ? (brandBySlug(picked[0])?.models ?? []) : [];

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = products.filter((p) => {
      if (picked.length && !(p.brand && picked.includes(p.brand))) return false;
      if (model && !(p.models.includes(model) || p.brand === null)) return false;
      if (category && p.category !== category) return false;
      if (!category && group && categoryBySlug(p.category)?.group !== group) return false;
      if (p.price > maxPrice) return false;
      if (!inStock && p.stock > 0) return false;
      if (!outStock && p.stock < 1) return false;
      if (words.length) {
        const hay = [p.name, p.sku, fitsLabel(p), categoryBySlug(p.category)?.name ?? ""].join(" ").toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const sorters: Record<string, (a: Product, b: Product) => number> = {
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return list.sort(sorters[sort] ?? sorters.newest);
  }, [products, q, picked, model, category, group, maxPrice, inStock, outStock, sort]);

  const clearAll = () => {
    setQ("");
    setPicked([]);
    setModel("");
    setCategory("");
    setGroup("");
    setMaxPrice(priceCeiling);
    setInStock(true);
    setOutStock(true);
  };

  const title = category ? categoryBySlug(category)?.name : group ? groupNames[group] : "Products";

  const filters = (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Filters</p>
        <button onClick={clearAll} className="text-xs font-medium text-brand hover:underline">Clear All</button>
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold">Brand</legend>
        <div className="space-y-2">
          {brands.map((b) => (
            <label key={b.slug} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={picked.includes(b.slug)}
                onChange={(e) => {
                  setPicked((cur) => (e.target.checked ? [...cur, b.slug] : cur.filter((s) => s !== b.slug)));
                  setModel("");
                }}
                className="size-4 accent-brand"
              />
              {b.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-2 font-semibold">Model</p>
        <SelectBox value={model} onChange={(e) => setModel(e.target.value)} disabled={!modelOptions.length}>
          <option value="">{modelOptions.length ? "All models" : "Pick one brand first"}</option>
          {modelOptions.map((m) => <option key={m}>{m}</option>)}
        </SelectBox>
      </div>

      <div>
        <p className="mb-2 font-semibold">Category</p>
        <SelectBox value={category} onChange={(e) => { setCategory(e.target.value); setGroup(""); }}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </SelectBox>
      </div>

      <div>
        <p className="mb-2 font-semibold">Price Range</p>
        <p className="mb-2 text-xs text-muted">Rs. 0 – {formatPrice(maxPrice)}</p>
        <input
          type="range"
          min={500}
          max={priceCeiling}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand"
          aria-label="Maximum price"
        />
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold">Availability</legend>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="size-4 accent-brand" /> In Stock
        </label>
        <label className="mt-2 flex cursor-pointer items-center gap-2.5">
          <input type="checkbox" checked={outStock} onChange={(e) => setOutStock(e.target.checked)} className="size-4 accent-brand" /> Out of Stock
        </label>
      </fieldset>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-4 text-xs text-muted">
        <Link href="/" className="hover:text-brand">Home</Link> <span className="mx-1">/</span> Products
      </nav>

      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-40 rounded-xl border border-line p-5">{filters}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-xl font-semibold text-navy sm:text-2xl">
              {title} <span className="text-muted">({results.length})</span>
            </h1>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium lg:hidden"
              >
                <SlidersHorizontal className="size-4" /> Filters
              </button>
              <div className="w-40">
                <SelectBox value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name A–Z</option>
                </SelectBox>
              </div>
            </div>
          </div>

          <div className="mb-5 flex h-11 items-center rounded-lg border border-line px-3 focus-within:border-brand">
            <Search className="size-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus={initial.focus}
              placeholder="Search by part name, bike model or code..."
              className="min-w-0 flex-1 px-3 text-sm outline-none"
              aria-label="Search products"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear search" className="text-muted hover:text-ink">
                <X className="size-4" />
              </button>
            )}
          </div>

          {results.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {results.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line py-16 text-center">
              <p className="font-semibold">No parts match these filters</p>
              <p className="mt-1 text-sm text-muted">Try fewer filters — or ask us on WhatsApp, we may have it in the shop.</p>
              <button onClick={clearAll} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">Clear filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Phone filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
            {filters}
            <button onClick={() => setShowFilters(false)} className="mt-6 w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white">
              Show {results.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

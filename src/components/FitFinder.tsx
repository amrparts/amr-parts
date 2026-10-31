"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { brands, brandBySlug, categories } from "@/lib/catalog";

function Select({ label, value, onChange, children, disabled }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="block flex-1">
      <span className="mb-1.5 block text-xs text-muted">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-12 w-full rounded-lg border border-line bg-white pl-4 pr-10 text-sm font-medium outline-none focus:border-brand disabled:bg-soft disabled:text-muted"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
      </span>
    </label>
  );
}

export function FitFinder() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const models = brandBySlug(brand)?.models ?? [];

  const go = () => {
    const q = new URLSearchParams();
    if (brand) q.set("brand", brand);
    if (model) q.set("model", model);
    if (category) q.set("category", category);
    router.push(`/shop${q.size ? `?${q}` : ""}`);
  };
  const reset = () => {
    setBrand("");
    setModel("");
    setCategory("");
  };

  return (
    <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 relative z-10">
      <div className="rounded-2xl border border-line bg-gradient-to-br from-white to-brand-soft/60 p-5 shadow-[0_12px_40px_-12px_rgba(15,35,80,0.18)] sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy sm:text-2xl">Find Parts That Fit Your Bike</h2>
        <p className="mt-1 text-sm text-muted">Select your motorcycle to see compatible parts.</p>
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end">
          <Select label="Select Brand" value={brand} onChange={(v) => { setBrand(v); setModel(""); }}>
            <option value="">Any brand</option>
            {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
          </Select>
          <Select label="Select Model" value={model} onChange={setModel} disabled={!brand}>
            <option value="">{brand ? "Any model" : "Choose a brand first"}</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select label="Select Category (Optional)" value={category} onChange={setCategory}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </Select>
          <button onClick={go} className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-dark">
            Find Compatible Parts <ArrowRight className="size-4" />
          </button>
        </div>
        <div className="mt-3 text-right">
          <button onClick={reset} className="text-xs font-medium text-brand hover:underline">Reset Filters</button>
        </div>
      </div>
    </section>
  );
}

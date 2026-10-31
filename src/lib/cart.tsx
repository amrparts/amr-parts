"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "./catalog";

export type CartItem = Pick<Product, "slug" | "sku" | "name" | "price" | "brand" | "models" | "category" | "images" | "stock"> & {
  qty: number;
};

type Cart = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "amr-inquiry-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring browser-only state after hydration
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const cap = (qty: number, stock: number) => Math.max(1, Math.min(qty, Math.max(stock, 1)));

  const add = useCallback((p: Product, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.slug === p.slug);
      if (found) return cur.map((i) => (i.slug === p.slug ? { ...i, qty: cap(i.qty + qty, p.stock) } : i));
      const { slug, sku, name, price, brand, models, category, images, stock } = p;
      return [...cur, { slug, sku, name, price, brand, models, category, images, stock, qty: cap(qty, stock) }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback(
    (slug: string, qty: number) => setItems((cur) => cur.map((i) => (i.slug === slug ? { ...i, qty: cap(qty, i.stock) } : i))),
    [],
  );
  const remove = useCallback((slug: string) => setItems((cur) => cur.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { items, count, subtotal, open, setOpen, add, setQty, remove, clear };
  }, [items, open, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

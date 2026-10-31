"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { fitsLabel, formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { ProductImage } from "./ProductImage";

export function CartDrawer() {
  const { items, count, subtotal, open, setOpen, setQty, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const message = orderMessage(items.map((i) => ({ name: i.name, sku: i.sku, fits: fitsLabel(i), price: i.price, qty: i.qty })));

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-navy/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Inquiry cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Inquiry Cart ({count})</h2>
          <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-soft">
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <ShoppingCart className="size-12 text-line" />
            <p className="font-medium">Your inquiry cart is empty</p>
            <p className="text-sm text-muted">Add the parts you need and send the list to us on WhatsApp.</p>
            <Link href="/shop" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">
              Browse Parts
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-3 py-4">
                  <Link href={`/product/${i.slug}`} onClick={() => setOpen(false)} className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-line">
                    <ProductImage src={i.images[0]} alt={i.name} category={i.category} sizes="64px" iconClass="size-7" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{i.name}</p>
                    <p className="truncate text-xs text-muted">{fitsLabel(i)}</p>
                    <p className="mt-1 text-sm font-semibold text-brand">{formatPrice(i.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => remove(i.slug)} aria-label={`Remove ${i.name}`} className="p-1 text-popular hover:opacity-70">
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex items-center rounded-lg border border-line">
                      <button onClick={() => setQty(i.slug, i.qty - 1)} aria-label="Decrease" className="p-1.5 disabled:opacity-30" disabled={i.qty <= 1}>
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm">{i.qty}</span>
                      <button onClick={() => setQty(i.slug, i.qty + 1)} aria-label="Increase" className="p-1.5 disabled:opacity-30" disabled={i.qty >= i.stock}>
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-4">
              <div className="flex justify-between text-sm font-semibold">
                <span>Estimated Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-whatsapp py-3 font-semibold text-white hover:bg-whatsapp-dark"
              >
                <MessageCircle className="size-5" /> Send Order via WhatsApp
              </a>
              <p className="mt-2 text-center text-xs text-muted">Final price and availability will be confirmed through WhatsApp.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

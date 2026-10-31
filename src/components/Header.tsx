"use client";

import Form from "next/form";
import Link from "next/link";
import { ChevronDown, Home, LayoutGrid, MessageCircle, Search, ShoppingCart } from "lucide-react";
import { categories, type Category } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

const group = (g: Category["group"]) => categories.filter((c) => c.group === g);

const nav: { label: string; href: string; items?: Category[] }[] = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop", items: categories },
  { label: "Spare Parts", href: "/shop?group=spare", items: group("spare") },
  { label: "Modification Parts", href: "/shop?group=modification", items: group("modification") },
  { label: "Accessories", href: "/shop?group=accessories", items: group("accessories") },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Contact", href: "/contact" },
];

function SearchBar({ className = "" }: { className?: string }) {
  return (
    <Form action="/shop" className={`flex h-11 overflow-hidden rounded-lg border border-line bg-white focus-within:border-brand ${className}`}>
      <input
        name="q"
        type="search"
        placeholder="Search parts, brands, models..."
        aria-label="Search parts"
        className="min-w-0 flex-1 px-4 text-sm outline-none placeholder:text-muted"
      />
      <button type="submit" aria-label="Search" className="grid w-12 place-items-center bg-brand text-white hover:bg-brand-dark">
        <Search className="size-[18px]" />
      </button>
    </Form>
  );
}

function CartButton({ className = "" }: { className?: string }) {
  const { count, setOpen } = useCart();
  return (
    <button onClick={() => setOpen(true)} aria-label={`Inquiry cart, ${count} items`} className={`relative p-2 text-ink hover:text-brand ${className}`}>
      <ShoppingCart className="size-6" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_var(--color-line)]">
      {/* Top strip */}
      <div className="hidden bg-brand text-white sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
          <p>Quality Motorcycle Parts &amp; Accessories&nbsp; | &nbsp;Islandwide Delivery Available</p>
          <nav className="flex gap-5">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:underline">Help</a>
          </nav>
        </div>
      </div>

      {/* Main row */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:gap-8">
        <Logo />
        <SearchBar className="hidden flex-1 md:flex lg:mx-8" />
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href={whatsappLink("Hi AMR Parts! I have a question about a part.")}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white hover:bg-whatsapp-dark sm:flex"
          >
            <MessageCircle className="size-[18px]" /> WhatsApp Us
          </a>
          <Link href="/shop?focus=1" aria-label="Search" className="p-2 md:hidden">
            <Search className="size-6" />
          </Link>
          <CartButton />
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <SearchBar />
      </div>

      {/* Category nav (desktop) */}
      <nav className="hidden border-t border-line lg:block">
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-6 text-sm font-medium">
          {nav.map((n) => (
            <li key={n.label} className="group relative">
              <Link href={n.href} className="flex items-center gap-1 px-4 py-3 hover:text-brand">
                {n.label}
                {n.items && n.label !== "Shop All" && <ChevronDown className="size-3.5 transition group-hover:rotate-180" />}
              </Link>
              {n.items && n.label !== "Shop All" && (
                <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 rounded-xl border border-line bg-white p-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {n.items.map((c) => (
                    <Link key={c.slug} href={`/shop?category=${c.slug}`} className="block rounded-lg px-3 py-2 hover:bg-soft hover:text-brand">
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** Phone-only bottom tab bar, as in the mobile mockup. */
export function MobileTabs() {
  const { count, setOpen } = useCart();
  const tab = "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted hover:text-brand";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <Link href="/" className={tab}><Home className="size-5" />Home</Link>
      <Link href="/categories" className={tab}><LayoutGrid className="size-5" />Categories</Link>
      <Link href="/shop?focus=1" className={tab}><Search className="size-5" />Search</Link>
      <button onClick={() => setOpen(true)} className={`${tab} relative`}>
        <ShoppingCart className="size-5" />
        {count > 0 && (
          <span className="absolute right-[calc(50%-18px)] top-1 grid size-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">
            {count}
          </span>
        )}
        Inquiry
      </button>
    </nav>
  );
}

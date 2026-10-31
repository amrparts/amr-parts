import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { brands, categories } from "@/lib/catalog";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-navy pb-20 text-sm text-white/70 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-extrabold italic text-white">AMR <span className="text-sm not-italic tracking-[0.4em]">PARTS</span></p>
          <p className="mt-3">Quality motorcycle spare parts, modification parts and accessories. Islandwide delivery across Sri Lanka.</p>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2 font-semibold text-white">
            <MessageCircle className="size-4" /> WhatsApp Us
          </a>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Categories</p>
          <ul className="space-y-2">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}><Link href={`/shop?category=${c.slug}`} className="hover:text-white">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Brands</p>
          <ul className="space-y-2">
            {brands.map((b) => (
              <li key={b.slug}><Link href={`/shop?brand=${b.slug}`} className="hover:text-white">{b.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">AMR Parts</p>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/shop?sort=newest" className="hover:text-white">New Arrivals</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">© {new Date().getFullYear()} AMR Parts. All rights reserved.</div>
    </footer>
  );
}

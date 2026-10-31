import Link from "next/link";
import { ArrowRight, Gauge, Headset, Layers, MessageCircle, Palette, Search, Sparkles, Tags, Users } from "lucide-react";
import { FitFinder } from "@/components/FitFinder";
import { BrandGrid, CategoryGrid, ProductRow, SectionHead } from "@/components/Sections";
import { getProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/whatsapp";

// Refresh product data from Supabase at most once a minute.
export const revalidate = 60;

const heroPerks = [
  { icon: Layers, label: "Wide Range of Parts" },
  { icon: Tags, label: "Multiple Brands" },
  { icon: MessageCircle, label: "WhatsApp Ordering" },
  { icon: Headset, label: "Friendly Support" },
];

const why = [
  { icon: Search, title: "Easy Product Search", text: "Find the right parts for your bike quickly." },
  { icon: Tags, title: "Multiple Motorcycle Brands", text: "Honda, Yamaha, Bajaj, TVS, Suzuki, Hero and more." },
  { icon: MessageCircle, title: "WhatsApp Ordering", text: "Simple and convenient ordering process." },
  { icon: Headset, title: "Friendly Customer Support", text: "Get help whenever you need." },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* Background glow + speed lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(29,91,216,0.55),transparent_60%)]" />
      <div className="absolute -right-24 top-1/2 hidden size-[520px] -translate-y-1/2 rounded-full border border-white/10 md:block" />
      <div className="absolute -right-6 top-1/2 hidden size-[340px] -translate-y-1/2 rounded-full border border-brand/40 md:block" />
      <svg className="absolute inset-y-0 right-0 hidden h-full w-1/2 opacity-30 md:block" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={600} y1={60 + i * 34} x2={120 + (i % 3) * 70} y2={60 + i * 34} stroke="url(#fade)" strokeWidth={i % 2 ? 1 : 2} />
        ))}
        <defs>
          <linearGradient id="fade" x1="1" x2="0">
            <stop offset="0" stopColor="#5b8cff" />
            <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <p className="pointer-events-none absolute -bottom-10 right-4 hidden select-none font-display text-[220px] font-extrabold italic leading-none text-white/[0.04] lg:block">
        AMR
      </p>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:pb-24 lg:pt-20">
        <h1 className="max-w-xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Find the Right <br />
          <span className="text-[#4d86ff]">Parts for Your Ride.</span>
        </h1>
        <p className="mt-4 max-w-md text-white/80">
          Explore motorcycle spare parts, modification accessories, and essential components for your favorite brands.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold hover:bg-brand-dark">Shop Parts</Link>
          <Link href="#brands" className="rounded-lg border border-white/60 px-6 py-3 text-sm font-semibold hover:bg-white/10">Browse by Brand</Link>
        </div>
        <ul className="mt-10 hidden flex-wrap gap-x-8 gap-y-3 text-xs text-white/85 sm:flex">
          {heroPerks.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-[#7aa5ff]" /> {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const products = await getProducts();
  const counts = products.reduce<Record<string, number>>((m, p) => {
    if (p.brand) m[p.brand] = (m[p.brand] ?? 0) + 1;
    return m;
  }, {});
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  return (
    <>
      <Hero />
      <FitFinder />

      <section id="brands" className="mx-auto max-w-7xl scroll-mt-40 px-4 pt-14 sm:px-6">
        <SectionHead title="Shop by Motorcycle Brand" sub="Find genuine-fit and compatible parts for your motorcycle." href="/shop" cta="View All Brands" />
        <BrandGrid counts={counts} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <SectionHead title="Explore Categories" sub="Browse our wide range of motorcycle parts and accessories." href="/categories" cta="View All Categories" />
        <CategoryGrid />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <SectionHead title="Featured Products" sub="Popular parts and accessories from AMR Parts." href="/shop" />
        <ProductRow products={featured} />
      </section>

      {/* Upgrade banner */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-navy p-7 text-white sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(29,91,216,0.5),transparent_65%)]" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Upgrade Your Ride</h2>
              <p className="mt-2 text-white/80">Explore motorcycle modification parts and accessories.</p>
              <Link href="/shop?group=modification" className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold hover:bg-brand-dark">
                Explore Collection
              </Link>
            </div>
            <ul className="grid gap-3 text-sm text-white/90 sm:grid-cols-2 md:grid-cols-1">
              {[
                { icon: Gauge, label: "Performance Parts", href: "/shop?category=modification" },
                { icon: Palette, label: "Lighting & Styling", href: "/shop?category=lighting" },
                { icon: Sparkles, label: "Handlebars & Controls", href: "/shop?category=cables" },
                { icon: Layers, label: "Aesthetic Modifications", href: "/shop?category=body" },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link href={href} className="flex items-center gap-3 hover:text-white">
                    <Icon className="size-5 text-[#7aa5ff]" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <SectionHead title="Just Arrived" sub="Latest products added to our catalog." href="/shop?sort=newest" />
        <ProductRow products={newest} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <h2 className="mb-5 font-display text-xl font-semibold text-navy sm:text-2xl">Why Shop with AMR Parts?</h2>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {why.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-line p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-navy-2 to-brand p-7 text-white sm:p-10">
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Join Our Motorcycle Parts Community</h2>
              <p className="mt-2 text-white/80">Stay connected with AMR Parts for new arrivals, product updates and motorcycle accessories.</p>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <Users className="size-5 text-[#7aa5ff]" /> Riders across Sri Lanka
              </p>
            </div>
            <a
              href={whatsappLink("Hi AMR Parts! Please add me to your WhatsApp community.")}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-whatsapp px-6 py-3 font-semibold hover:bg-whatsapp-dark"
            >
              <MessageCircle className="size-5" /> Join Our WhatsApp Group <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

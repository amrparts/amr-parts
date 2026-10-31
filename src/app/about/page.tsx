import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About Us" };

// TODO: replace with the owner's own story.
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-navy">About AMR Parts</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        <p>
          AMR Parts supplies motorcycle spare parts, modification parts and accessories for Honda, Yamaha, Bajaj, TVS, Suzuki and Hero
          bikes, with islandwide delivery across Sri Lanka.
        </p>
        <p>
          Find your part online, add it to your inquiry cart and send the list to us on WhatsApp. We confirm the price, stock and fit
          with you before anything is sent.
        </p>
      </div>
      <Link href="/shop" className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">Shop Parts</Link>
    </div>
  );
}

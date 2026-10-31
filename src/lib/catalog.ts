// Static shop structure (brands, models, categories) and the sample catalog used
// until Supabase is connected. Product rows from Supabase use the same Product shape.

export type Badge = "popular" | "new" | "limited";

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: string; // Category.slug
  brand: string | null; // Brand.slug, null = universal fit
  models: string[]; // model names it fits; empty = universal
  price: number;
  stock: number;
  badge: Badge | null;
  featured: boolean;
  createdAt: string; // ISO date, drives "Just Arrived"
  description: string;
  specs: Record<string, string>;
  images: string[]; // empty = category icon placeholder
};

export type Brand = { slug: string; name: string; colour: string; models: string[] };

export const brands: Brand[] = [
  { slug: "honda", name: "Honda", colour: "#d6202a", models: ["CB Shine", "CB Hornet 160R", "Dio", "CD 70", "XR 150L"] },
  { slug: "yamaha", name: "Yamaha", colour: "#1b3fa0", models: ["FZ V2", "FZ V3", "FZ-S", "MT-15", "R15 V3", "Ray ZR"] },
  { slug: "bajaj", name: "Bajaj", colour: "#1d5bd8", models: ["Pulsar 150", "Pulsar 180", "Pulsar NS200", "Discover 125", "CT 100", "Platina"] },
  { slug: "tvs", name: "TVS", colour: "#0d3b8c", models: ["Apache RTR 160", "Apache RTR 200", "Metro", "Ntorq 125", "Wego"] },
  { slug: "suzuki", name: "Suzuki", colour: "#e01f2d", models: ["Gixxer", "GN 125", "Access 125"] },
  { slug: "hero", name: "Hero", colour: "#e5302a", models: ["Splendor Plus", "Glamour", "Hunk", "Xtreme 160R"] },
];

export type Category = { slug: string; name: string; group: "spare" | "modification" | "accessories"; icon: string };

// icon = key into CategoryIcon (components/CategoryIcon.tsx)
export const categories: Category[] = [
  { slug: "engine", name: "Engine Parts", group: "spare", icon: "engine" },
  { slug: "brakes", name: "Brake Systems", group: "spare", icon: "brakes" },
  { slug: "electrical", name: "Electrical Parts", group: "spare", icon: "electrical" },
  { slug: "lighting", name: "Lighting & Indicators", group: "modification", icon: "lighting" },
  { slug: "body", name: "Body Parts", group: "spare", icon: "body" },
  { slug: "suspension", name: "Suspension", group: "spare", icon: "suspension" },
  { slug: "modification", name: "Modification Parts", group: "modification", icon: "modification" },
  { slug: "accessories", name: "Motorcycle Accessories", group: "accessories", icon: "accessories" },
  { slug: "filters", name: "Filters & Maintenance", group: "spare", icon: "filters" },
  { slug: "cables", name: "Cables & Controls", group: "spare", icon: "cables" },
];

export const brandBySlug = (slug: string | null | undefined) => brands.find((b) => b.slug === slug);
export const categoryBySlug = (slug: string | null | undefined) => categories.find((c) => c.slug === slug);

export function fitsLabel(p: Pick<Product, "brand" | "models">) {
  const brand = brandBySlug(p.brand);
  if (!brand) return "Universal Fit";
  return p.models.length ? `${brand.name} ${p.models.join(" / ")}` : `All ${brand.name}`;
}

export const formatPrice = (n: number) => `Rs. ${n.toLocaleString("en-LK")}`;

type Seed = Omit<Product, "slug" | "sku" | "images" | "featured" | "badge" | "specs" | "createdAt" | "description"> &
  Partial<Pick<Product, "featured" | "badge" | "specs" | "description">> & { days: number };

const seeds: Seed[] = [
  { name: "LED Headlight Assembly", category: "lighting", brand: "yamaha", models: ["FZ V2"], price: 4500, stock: 6, badge: "popular", featured: true, days: 40,
    description: "High quality LED headlight assembly for Yamaha FZ V2. Brighter illumination, better visibility and a modern look. Direct fit, easy installation.",
    specs: { Voltage: "12V", "Light type": "LED (high / low beam)", Condition: "New" } },
  { name: "Brake Lever (Right)", category: "brakes", brand: "bajaj", models: ["Pulsar 150"], price: 1250, stock: 14, badge: "new", featured: true, days: 6 },
  { name: "Engine Oil Filter", category: "filters", brand: "honda", models: ["CB Shine"], price: 650, stock: 40, featured: true, days: 30 },
  { name: "Modified Exhaust (Racing)", category: "modification", brand: null, models: [], price: 8500, stock: 3, badge: "limited", featured: true, days: 12,
    description: "Stainless steel racing exhaust with a deep sport sound. Universal 51 mm inlet — fits most 150–200cc bikes with the right link pipe.",
    specs: { Material: "Stainless steel", Inlet: "51 mm", Condition: "New" } },
  { name: "Brake Disc (Front)", category: "brakes", brand: "bajaj", models: ["Pulsar 150"], price: 3800, stock: 8, days: 50 },
  { name: "Clutch Cable", category: "cables", brand: "bajaj", models: ["Pulsar 150"], price: 950, stock: 25, days: 60 },
  { name: "Air Filter", category: "filters", brand: "bajaj", models: ["Pulsar 150", "Pulsar 180"], price: 850, stock: 18, days: 45 },
  { name: "Chain Sprocket Kit", category: "engine", brand: "tvs", models: ["Apache RTR 160"], price: 4800, stock: 7, featured: true, days: 2 },
  { name: "Radiator Guard", category: "body", brand: "yamaha", models: ["MT-15"], price: 2800, stock: 5, badge: "new", days: 1 },
  { name: "LED Indicators (Set)", category: "lighting", brand: null, models: [], price: 1900, stock: 20, days: 3 },
  { name: "Handlebar Mirror (Set)", category: "accessories", brand: "bajaj", models: ["Pulsar 150", "Pulsar NS200"], price: 2500, stock: 11, days: 4 },
  { name: "Spark Plug (Iridium)", category: "engine", brand: null, models: [], price: 1800, stock: 30, days: 20 },
  { name: "Brake Pads (Front)", category: "brakes", brand: "honda", models: ["CB Hornet 160R"], price: 1350, stock: 22, featured: true, days: 25 },
  { name: "Front Shock Absorber (Pair)", category: "suspension", brand: "bajaj", models: ["Discover 125"], price: 9500, stock: 4, days: 35 },
  { name: "Rear Mono Shock", category: "suspension", brand: "yamaha", models: ["FZ V3", "FZ-S"], price: 12500, stock: 2, badge: "limited", days: 15 },
  { name: "Battery 12V 5Ah", category: "electrical", brand: null, models: [], price: 6200, stock: 9, featured: true, days: 18 },
  { name: "Starter Relay", category: "electrical", brand: "tvs", models: ["Apache RTR 160", "Apache RTR 200"], price: 1100, stock: 12, days: 28 },
  { name: "Tail Light Assembly", category: "lighting", brand: "suzuki", models: ["Gixxer"], price: 3200, stock: 0, days: 55 },
  { name: "Side Panel Set", category: "body", brand: "hero", models: ["Splendor Plus"], price: 4200, stock: 3, days: 70 },
  { name: "Accelerator Cable", category: "cables", brand: "hero", models: ["Splendor Plus", "Glamour"], price: 700, stock: 16, days: 65 },
  { name: "Piston Kit (Std)", category: "engine", brand: "honda", models: ["CD 70"], price: 5400, stock: 5, days: 80 },
  { name: "CNC Brake Lever Set", category: "modification", brand: "yamaha", models: ["R15 V3", "MT-15"], price: 5900, stock: 6, badge: "popular", days: 9 },
  { name: "Phone Holder (Aluminium)", category: "accessories", brand: null, models: [], price: 2200, stock: 15, days: 5 },
  { name: "Engine Oil 10W-30 (1L)", category: "filters", brand: null, models: [], price: 2400, stock: 50, badge: "popular", featured: true, days: 22 },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const NOW = Date.UTC(2026, 9, 31);

export const sampleProducts: Product[] = seeds.map(({ days, ...s }, i) => {
  const slug = slugify([s.name, s.brand ?? "", s.models[0] ?? ""].join(" "));
  const category = categoryBySlug(s.category)!;
  return {
    ...s,
    slug,
    sku: `AMR-${String(i + 1).padStart(3, "0")}`,
    badge: s.badge ?? null,
    featured: s.featured ?? false,
    createdAt: new Date(NOW - days * 86_400_000).toISOString(),
    description:
      s.description ??
      `Genuine-fit ${s.name.toLowerCase()} for ${fitsLabel(s)}. Quality checked before dispatch — ask us on WhatsApp if you're not sure it fits your bike.`,
    specs: s.specs ?? { Category: category.name, Condition: "New" },
    images: [],
  };
});

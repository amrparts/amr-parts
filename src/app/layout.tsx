import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header, MobileTabs } from "@/components/Header";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700", "800"], style: ["normal", "italic"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: { default: "AMR Parts — Motorcycle Spare Parts & Accessories", template: "%s | AMR Parts" },
  description:
    "Find the right parts for your ride. Motorcycle spare parts, modification parts and accessories for Honda, Yamaha, Bajaj, TVS, Suzuki and Hero. Islandwide delivery in Sri Lanka.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <MobileTabs />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

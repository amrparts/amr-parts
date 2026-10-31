import { formatPrice } from "./catalog";

// Placeholder until the shop's real number is set in NEXT_PUBLIC_WHATSAPP_NUMBER.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94700000000";

export const whatsappLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export type InquiryLine = { name: string; sku: string; fits: string; price: number; qty: number };

export function orderMessage(lines: InquiryLine[]) {
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return [
    "Hi AMR Parts! I'd like to order:",
    "",
    ...lines.map((l, i) => `${i + 1}. ${l.name} (${l.sku}) — ${l.fits}\n   Qty ${l.qty} × ${formatPrice(l.price)}`),
    "",
    `Estimated total: ${formatPrice(total)}`,
    "",
    "Please confirm price and availability. Thank you!",
  ].join("\n");
}

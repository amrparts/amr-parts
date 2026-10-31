import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_NUMBER, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Contact" };

// TODO: replace the address and hours with the shop's real details.
export default function ContactPage() {
  const phone = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2)}`;
  const rows = [
    { icon: Phone, label: "Phone / WhatsApp", value: phone },
    { icon: MapPin, label: "Shop", value: "Address coming soon" },
    { icon: Clock, label: "Hours", value: "Mon – Sat, 9:00 am – 6:00 pm" },
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-navy">Contact Us</h1>
      <p className="mt-2 text-muted">Not sure which part fits your bike? Send us your bike model and we&apos;ll help you find it.</p>
      <div className="mt-8 divide-y divide-line rounded-xl border border-line">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 p-5">
            <span className="grid size-11 place-items-center rounded-full bg-brand-soft text-brand"><Icon className="size-5" /></span>
            <div>
              <p className="text-xs text-muted">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <a href={whatsappLink("Hi AMR Parts!")} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-6 py-3 font-semibold text-white hover:bg-whatsapp-dark">
        <MessageCircle className="size-5" /> Chat on WhatsApp
      </a>
    </div>
  );
}

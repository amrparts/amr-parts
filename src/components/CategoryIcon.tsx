import {
  Cable,
  CarBattery,
  Cog,
  Disc3,
  Filter,
  Lightbulb,
  type LucideIcon,
  Shapes,
  Sparkles,
  Waves,
  Wrench,
} from "lucide-react";
import { categoryBySlug } from "@/lib/catalog";

const icons: Record<string, LucideIcon> = {
  engine: Cog,
  brakes: Disc3,
  electrical: CarBattery,
  lighting: Lightbulb,
  body: Shapes,
  suspension: Waves,
  modification: Sparkles,
  accessories: Wrench,
  filters: Filter,
  cables: Cable,
};

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = icons[categoryBySlug(category)?.icon ?? ""] ?? Wrench;
  return <Icon className={className} strokeWidth={1.5} />;
}

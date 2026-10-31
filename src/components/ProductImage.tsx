import Image from "next/image";
import { CategoryIcon } from "./CategoryIcon";

/** Product photo, or a clean category-icon tile until real photos are uploaded. */
export function ProductImage({
  src,
  alt,
  category,
  sizes,
  priority,
  iconClass = "size-1/3",
}: {
  src?: string;
  alt: string;
  category: string;
  sizes: string;
  priority?: boolean;
  iconClass?: string;
}) {
  if (src) return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain p-3" />;
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-soft to-[#e6ecf6]" aria-label={alt} role="img">
      <CategoryIcon category={category} className={`${iconClass} text-navy-2/70`} />
    </div>
  );
}

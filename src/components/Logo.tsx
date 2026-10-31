import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="AMR Parts home" className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-display text-[28px] font-extrabold italic tracking-tight text-brand sm:text-[32px]">AMR</span>
      <span className="-mt-0.5 text-[9px] font-semibold tracking-[0.55em] text-navy sm:text-[10px]">PARTS</span>
    </Link>
  );
}

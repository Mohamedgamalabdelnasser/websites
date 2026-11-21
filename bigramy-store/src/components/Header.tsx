"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

const NAV = [
  { label: "Shop All", href: "/collections/all" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "Proteins", href: "/collections/essential-proteins" },
  { label: "Creatine", href: "/collections/creatine" },
  { label: "Amino Acids", href: "/collections/amino-acids-eaas" },
  { label: "Pre-Workout", href: "/collections/pre-workout" },
  { label: "Bundles", href: "/collections/bundles" },
];

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="bg-ink text-white text-center text-xs sm:text-sm py-2 tracking-wide">
        BIG RAMY LABS — GO BIG OR GO HOME!
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4 h-16">
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <Image
            src="/brand/logo.webp"
            alt="RED REX / BIG RAMY LABS"
            width={140}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-ink">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-black/60 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-black/50 hover:text-ink"
          >
            Admin
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-full bg-rex px-4 py-2 text-sm font-bold text-ink"
          >
            Cart
            {count > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
      <div className="lg:hidden overflow-x-auto border-t border-black/5">
        <div className="flex gap-4 px-4 py-2 text-xs font-semibold whitespace-nowrap">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink/80">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

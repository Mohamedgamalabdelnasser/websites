"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatEGP } from "@/lib/money";

export default function CartPage() {
  const {
    lines,
    subtotal,
    discount,
    total,
    appliedOffer,
    setQty,
    removeLine,
  } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <Link
          href="/collections/all"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-extrabold">Cart</h1>
      <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-8">
        <ul className="space-y-4">
          {lines.map((line) => (
            <li
              key={line.variantId}
              className="flex gap-4 rounded-xl border border-black/10 bg-white p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-soft">
                {line.image && (
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${line.handle}`}
                  className="font-semibold hover:underline"
                >
                  {line.title}
                </Link>
                <p className="text-xs text-black/50 mt-0.5">{line.variantTitle}</p>
                <p className="mt-2 text-sm font-bold">{formatEGP(line.price)}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-black/15 text-sm">
                    <button
                      type="button"
                      className="px-3 py-1"
                      onClick={() => setQty(line.variantId, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="px-2 font-semibold">{line.quantity}</span>
                    <button
                      type="button"
                      className="px-3 py-1"
                      onClick={() => setQty(line.variantId, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-sale font-semibold"
                    onClick={() => removeLine(line.variantId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-bold text-sm">
                {formatEGP(line.price * line.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="rounded-xl border border-black/10 bg-white p-5 h-fit sticky top-28">
          <h2 className="font-bold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatEGP(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success text-green-700">
                <span>Discount</span>
                <span>−{formatEGP(discount)}</span>
              </div>
            )}
            {appliedOffer && (
              <p className="text-xs text-black/55 rounded-lg bg-rex/15 p-2">
                {appliedOffer.message}
              </p>
            )}
            <div className="flex justify-between border-t border-black/10 pt-3 text-base font-bold">
              <span>Total</span>
              <span>{formatEGP(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-5 block rounded-full bg-rex py-3 text-center text-sm font-bold text-ink"
          >
            Checkout
          </Link>
          <p className="mt-3 text-[11px] text-black/45 leading-relaxed">
            Specific-mix bundles only apply when every required product is in the
            cart — not 2× of the same item.
          </p>
        </aside>
      </div>
    </div>
  );
}

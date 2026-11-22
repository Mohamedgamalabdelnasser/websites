"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatEGP } from "@/lib/money";

export default function CheckoutPage() {
  const { lines, subtotal, discount, total, appliedOffer, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Nothing to checkout</h1>
        <Link href="/collections/all" className="mt-4 inline-block underline">
          Shop products
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer_name: fd.get("name"),
          customer_phone: fd.get("phone"),
          customer_address: fd.get("address"),
          notes: fd.get("notes"),
          lines,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      clear();
      router.push(`/checkout/thanks?order=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 grid lg:grid-cols-2 gap-10">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-display text-3xl font-extrabold">Checkout</h1>
        <p className="text-sm text-black/55">
          Demo checkout — orders are saved in your admin portal (cash on delivery
          style).
        </p>
        <label className="block text-sm">
          <span className="font-semibold">Full name</span>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Phone</span>
          <input
            name="phone"
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Address</span>
          <textarea
            name="address"
            required
            rows={3}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Notes</span>
          <textarea
            name="notes"
            rows={2}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5"
          />
        </label>
        {error && <p className="text-sm text-sale">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? "Placing order…" : `Place order · ${formatEGP(total)}`}
        </button>
      </form>

      <aside className="rounded-xl border border-black/10 bg-white p-5 h-fit">
        <h2 className="font-bold mb-4">Summary</h2>
        <ul className="space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.variantId} className="flex justify-between gap-3">
              <span>
                {l.quantity}× {l.title}
              </span>
              <span>{formatEGP(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-black/10 pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatEGP(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount</span>
              <span>−{formatEGP(discount)}</span>
            </div>
          )}
          {appliedOffer && (
            <p className="text-xs text-black/55">{appliedOffer.message}</p>
          )}
          <div className="flex justify-between font-bold text-base pt-2">
            <span>Total</span>
            <span>{formatEGP(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

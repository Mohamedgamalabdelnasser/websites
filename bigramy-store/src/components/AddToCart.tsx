"use client";

import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { formatEGP } from "@/lib/money";
import type { Product, Variant } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addLine } = useCart();

  const variant: Variant | undefined = useMemo(
    () => variants.find((v) => v.id === variantId) ?? variants[0],
    [variants, variantId],
  );

  if (!variant) {
    return <p className="text-sm text-black/50">No variants available.</p>;
  }

  return (
    <div className="space-y-4">
      {variants.length > 1 && (
        <label className="block text-sm">
          <span className="font-semibold">Option</span>
          <select
            className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5"
            value={variant.id}
            onChange={(e) => setVariantId(Number(e.target.value))}
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title} — {formatEGP(v.price)}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="flex items-baseline gap-3">
        <p className="text-2xl font-bold">{formatEGP(variant.price)}</p>
        {variant.compare_at_price != null &&
          variant.compare_at_price > variant.price && (
            <p className="text-black/40 line-through">
              {formatEGP(variant.compare_at_price)}
            </p>
          )}
      </div>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-black/15">
          <button
            type="button"
            className="px-3 py-2"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="px-3 font-semibold">{qty}</span>
          <button
            type="button"
            className="px-3 py-2"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="flex-1 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:opacity-90"
          onClick={() => {
            addLine({
              productId: product.id,
              variantId: variant.id,
              handle: product.handle,
              title: product.title,
              variantTitle: variant.title,
              price: Number(variant.price),
              image: product.images[0] ?? null,
              quantity: qty,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 1600);
          }}
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

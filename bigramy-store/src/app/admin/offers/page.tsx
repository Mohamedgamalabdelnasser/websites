"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Offer, OfferItem, Product } from "@/lib/types";

type OfferRow = Offer & { items: OfferItem[] };

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [productA, setProductA] = useState("");
  const [productB, setProductB] = useState("");
  const [offerType, setOfferType] = useState("specific_mix");

  const sorted = useMemo(
    () => [...products].sort((a, b) => a.title.localeCompare(b.title)),
    [products],
  );

  async function load() {
    const [oRes, pRes] = await Promise.all([
      fetch("/api/offers"),
      fetch("/api/products?all=1"),
    ]);
    const oData = await oRes.json();
    const pData = await pRes.json();
    if (!pRes.ok) {
      setError(pData.error || "Admin auth required for product list");
    }
    setOffers(oData.offers ?? []);
    setProducts(pData.products ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const items =
      offerType === "specific_mix" || offerType === "any_quantity"
        ? [
            { product_id: Number(productA), quantity: 1 },
            { product_id: Number(productB), quantity: 1 },
          ].filter((i) => i.product_id)
        : productA
          ? [{ product_id: Number(productA), quantity: 1 }]
          : [];

    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        description: fd.get("description"),
        offer_type: offerType,
        status: "active",
        fixed_total: fd.get("fixed_total")
          ? Number(fd.get("fixed_total"))
          : null,
        discount_amount: fd.get("discount_amount")
          ? Number(fd.get("discount_amount"))
          : null,
        discount_percent: fd.get("discount_percent")
          ? Number(fd.get("discount_percent"))
          : null,
        min_quantity: fd.get("min_quantity")
          ? Number(fd.get("min_quantity"))
          : offerType === "any_quantity"
            ? 2
            : null,
        items,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Failed to create offer");
      return;
    }
    e.currentTarget.reset();
    setProductA("");
    setProductB("");
    await load();
  }

  async function setStatus(id: number, status: string) {
    await fetch("/api/offers", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/offers?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Offers &amp; Bundles</h2>
        <p className="text-sm text-white/55 mt-1">
          Use <span className="text-rex font-semibold">specific_mix</span> for
          All-In + Creatine = 2000. That type never applies to 2× the same product.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="rounded-2xl border border-rex/30 bg-rex/5 p-5 space-y-3"
      >
        <h3 className="font-bold text-rex">Create offer</h3>
        <input
          name="name"
          required
          placeholder="Offer name (e.g. All-In + Creatine Bundle)"
          className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
          defaultValue="All-In + Creatine Bundle"
        />
        <textarea
          name="description"
          rows={2}
          placeholder="Description"
          className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
          defaultValue="Buy All-In with Creatine for a fixed total of EGP 2000. Only this mix qualifies."
        />
        <label className="block text-sm">
          <span className="text-white/60">Offer type</span>
          <select
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
            className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
          >
            <option value="specific_mix">
              Specific mix (required products — recommended)
            </option>
            <option value="any_quantity">
              Any quantity / mix &amp; match (like Qikify Multibuy)
            </option>
            <option value="percent_off">Percent off</option>
            <option value="fixed_amount_off">Fixed amount off</option>
          </select>
        </label>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-white/60">Product A</span>
            <select
              required={offerType === "specific_mix"}
              value={productA}
              onChange={(e) => setProductA(e.target.value)}
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
            >
              <option value="">Select…</option>
              {sorted.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-white/60">Product B</span>
            <select
              required={offerType === "specific_mix"}
              value={productB}
              onChange={(e) => setProductB(e.target.value)}
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
            >
              <option value="">Select…</option>
              {sorted.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <input
            name="fixed_total"
            type="number"
            step="0.01"
            placeholder="Fixed total (e.g. 2000)"
            defaultValue={2000}
            className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
          />
          <input
            name="discount_amount"
            type="number"
            step="0.01"
            placeholder="Or fixed amount off"
            className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
          />
          <input
            name="discount_percent"
            type="number"
            step="0.01"
            placeholder="Or % off"
            className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
          />
        </div>
        {offerType === "any_quantity" && (
          <input
            name="min_quantity"
            type="number"
            placeholder="Min quantity (e.g. 2)"
            defaultValue={2}
            className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
          />
        )}
        {error && <p className="text-sm text-sale">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-rex px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-50"
        >
          {busy ? "Saving…" : "Create offer"}
        </button>
      </form>

      <div className="space-y-3">
        {offers.map((o) => (
          <article
            key={o.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">{o.name}</h3>
                <p className="text-xs text-white/45 mt-1">
                  {o.offer_type} · {o.status}
                  {o.fixed_total != null ? ` · fixed total ${o.fixed_total}` : ""}
                  {o.discount_amount != null
                    ? ` · −${o.discount_amount}`
                    : ""}
                  {o.discount_percent != null
                    ? ` · ${o.discount_percent}%`
                    : ""}
                </p>
                <p className="text-sm text-white/65 mt-2">{o.description}</p>
                <ul className="mt-2 text-sm text-rex/90 space-y-1">
                  {o.items.map((i) => (
                    <li key={i.id}>
                      {i.quantity}× {i.product_title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs underline"
                  onClick={() =>
                    void setStatus(
                      o.id,
                      o.status === "active" ? "paused" : "active",
                    )
                  }
                >
                  {o.status === "active" ? "Pause" : "Activate"}
                </button>
                <button
                  type="button"
                  className="text-xs underline text-sale"
                  onClick={() => void remove(o.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {offers.length === 0 && (
          <p className="text-white/50 text-sm">No offers yet.</p>
        )}
      </div>
    </div>
  );
}

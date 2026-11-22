"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatEGP } from "@/lib/money";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/products?all=1");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load (sign in / private app required)");
      return;
    }
    setProducts(data.products ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "");
    const handle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        handle,
        price: Number(fd.get("price") ?? 0),
        compare_at_price: fd.get("compare")
          ? Number(fd.get("compare"))
          : null,
        images: fd.get("image") ? [String(fd.get("image"))] : [],
        body_text: String(fd.get("body") ?? ""),
        vendor: "RED REX",
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Create failed");
      return;
    }
    e.currentTarget.reset();
    await load();
  }

  async function toggleStatus(p: Product) {
    const next = p.status === "active" ? "draft" : "active";
    await fetch("/api/products", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: p.id, status: next }),
    });
    await load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Products</h2>
        <p className="text-sm text-white/55 mt-1">
          Catalog imported from eg.bigramylabs.com — edit or add products here.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 grid sm:grid-cols-2 gap-3"
      >
        <h3 className="sm:col-span-2 font-bold">Add product</h3>
        <input
          name="title"
          required
          placeholder="Title"
          className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
        />
        <input
          name="price"
          required
          type="number"
          step="0.01"
          placeholder="Price EGP"
          className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
        />
        <input
          name="compare"
          type="number"
          step="0.01"
          placeholder="Compare-at (optional)"
          className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
        />
        <input
          name="image"
          placeholder="Image URL"
          className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
        />
        <textarea
          name="body"
          placeholder="Description"
          rows={2}
          className="sm:col-span-2 rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm"
        />
        {error && (
          <p className="sm:col-span-2 text-sm text-sale">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="sm:col-span-2 rounded-full bg-rex px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-50"
        >
          {busy ? "Saving…" : "Create product"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/50">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="p-3">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-white/40">{p.handle}</p>
                </td>
                <td className="p-3">
                  {p.min_price != null ? formatEGP(p.min_price) : "—"}
                </td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => void toggleStatus(p)}
                    className="text-xs underline text-white/70"
                  >
                    {p.status === "active" ? "Unpublish" : "Publish"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

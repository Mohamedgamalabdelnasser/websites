"use client";

import { useEffect, useState } from "react";
import { formatEGP } from "@/lib/money";

type Order = {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string;
  subtotal: number;
  discount: number;
  total: number;
  offer_name: string | null;
  status: string;
  created_at: string;
  items: unknown;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load orders");
        return;
      }
      setOrders(data.orders ?? []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Orders</h2>
        <p className="text-sm text-white/55 mt-1">
          Demo checkout orders from the storefront.
        </p>
      </div>
      {error && <p className="text-sale text-sm">{error}</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <article
            key={o.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm"
          >
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-bold">
                #{o.id} · {o.customer_name}
              </p>
              <p className="font-bold text-rex">{formatEGP(o.total)}</p>
            </div>
            <p className="text-white/50 mt-1">
              {o.customer_phone} · {o.created_at}
            </p>
            <p className="mt-2 text-white/70">{o.customer_address}</p>
            {o.discount > 0 && (
              <p className="mt-2 text-xs text-white/55">
                Discount {formatEGP(o.discount)}
                {o.offer_name ? ` via ${o.offer_name}` : ""}
              </p>
            )}
            {o.notes && (
              <p className="mt-2 text-xs text-white/45">Notes: {o.notes}</p>
            )}
          </article>
        ))}
        {!error && orders.length === 0 && (
          <p className="text-white/50">No orders yet.</p>
        )}
      </div>
    </div>
  );
}

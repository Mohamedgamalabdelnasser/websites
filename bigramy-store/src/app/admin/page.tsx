import Link from "next/link";
import { listOffers, listProducts } from "@/lib/catalog";
import { sql } from "@/lib/db";
import { SeedButton } from "./SeedButton";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const products = await listProducts({ status: "active" });
  const offers = await listOffers(true);
  const orders = await sql<{ c: string }>("select count(*)::text as c from orders");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="mt-1 text-sm text-white/55">
          Manage the BIG RAMY LABS catalog and create specific-mix bundles without
          Qikify restrictions.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Products" value={String(products.length)} href="/admin/products" />
        <Stat label="Offers" value={String(offers.length)} href="/admin/offers" />
        <Stat label="Orders" value={orders[0]?.c ?? "0"} href="/admin/orders" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
        <h3 className="font-bold">Why this portal exists</h3>
        <p className="text-sm text-white/70 leading-relaxed">
          Shopify Multibuy / volume discounts treat &quot;buy 2 for 2000&quot; as any
          2 items from a list — so 2× All-In or 2× Creatine also got the deal. Here
          you create a <strong className="text-rex">specific_mix</strong> offer that
          requires All-In <em>and</em> Creatine together for EGP 2000.
        </p>
        <SeedButton />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/offers"
          className="rounded-full bg-rex px-5 py-2.5 text-sm font-bold text-ink"
        >
          Create / edit bundles
        </Link>
        <Link
          href="/admin/products"
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold"
        >
          Edit products
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10"
    >
      <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </Link>
  );
}

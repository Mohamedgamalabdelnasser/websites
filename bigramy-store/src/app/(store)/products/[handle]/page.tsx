import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { getProductByHandle, listOffers } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product || product.status !== "active") notFound();

  const offers = await listOffers();
  const relatedOffers = offers.filter((o) =>
    o.items.some((i) => i.product_id === product.id),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <p className="text-xs text-black/45 mb-4">
        <Link href="/">Home</Link> /{" "}
        <Link href="/collections/all">Products</Link> / {product.title}
      </p>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="grid gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-soft">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-contain p-6"
                priority
                unoptimized
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 8).map((src) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-lg bg-soft"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black/45">
            {product.vendor}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            {product.title}
          </h1>
          {product.product_type && (
            <p className="mt-2 text-sm text-black/50">{product.product_type}</p>
          )}
          <div className="mt-6">
            <AddToCart product={product} />
          </div>
          {relatedOffers.length > 0 && (
            <div className="mt-6 rounded-xl border border-rex/40 bg-rex/10 p-4">
              <p className="text-sm font-bold">Active offers for this product</p>
              <ul className="mt-2 space-y-2 text-sm">
                {relatedOffers.map((o) => (
                  <li key={o.id}>
                    <span className="font-semibold">{o.name}</span>
                    {o.offer_type === "specific_mix" && (
                      <span className="block text-black/60">
                        Specific mix only
                        {o.fixed_total != null
                          ? ` · fixed total EGP ${o.fixed_total}`
                          : ""}
                        {" — "}
                        {o.items
                          .map((i) => `${i.quantity}× ${i.product_title}`)
                          .join(" + ")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.body_text && (
            <div className="mt-8 prose prose-sm max-w-none text-black/70 leading-relaxed whitespace-pre-wrap">
              {product.body_text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

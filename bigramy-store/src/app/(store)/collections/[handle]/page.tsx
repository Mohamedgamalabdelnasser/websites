import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getCollection, listProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const isAll = handle === "all";
  const collection = isAll ? null : await getCollection(handle);
  const products = await listProducts(
    isAll ? undefined : { collection: handle },
  );
  const title = isAll ? "All products" : collection?.title ?? handle;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <p className="text-xs text-black/45 mb-3">
        <Link href="/">Home</Link> / Collections / {title}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-black/55">{products.length} products</p>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-10 text-black/50">No products in this collection.</p>
      )}
    </div>
  );
}

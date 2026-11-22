import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getSetting, listProducts, listReviews } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await getSetting<
    { handle: string; title: string; count: number; image: string | null }[]
  >("categories", []);
  const frontpage = await getSetting<string[]>("frontpage_handles", []);
  const all = await listProducts();
  const byHandle = new Map(all.map((p) => [p.handle, p]));
  const featured =
    frontpage.map((h) => byHandle.get(h)).filter(Boolean).slice(0, 12) as typeof all;
  const products = featured.length ? featured : all.slice(0, 12);
  const reviews = await listReviews();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-rise text-white">
            <p className="text-rex font-extrabold tracking-[0.2em] text-sm uppercase mb-4">
              BIG RAMY LABS
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[0.95] tracking-tight">
              GO BIG
              <br />
              OR GO HOME!
            </h1>
            <p className="mt-5 max-w-md text-white/80 text-base sm:text-lg">
              RED REX proteins, creatine, aminos &amp; pre-workout — built for
              serious training.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/collections/best-sellers"
                className="rounded-full bg-rex px-6 py-3 text-sm font-bold text-ink"
              >
                Shop best sellers
              </Link>
              <Link
                href="/collections/all"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white"
              >
                View all products
              </Link>
            </div>
          </div>
          <div className="relative animate-rise aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <Image
              src="/brand/hero-best.webp"
              alt="Best sellers"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Shop by category
            </h2>
            <p className="text-sm text-black/55 mt-1">
              Essential proteins, creatine, aminos &amp; more
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.handle}
              href={`/collections/${cat.handle}`}
              className="group relative overflow-hidden rounded-xl bg-soft border border-black/5 animate-rise"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-square">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                )}
              </div>
              <div className="p-4 pt-0">
                <h3 className="font-bold text-sm sm:text-base">{cat.title}</h3>
                <p className="text-xs text-black/50 mt-1">{cat.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 pb-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Featured products
            </h2>
            <p className="text-sm text-black/55 mt-1">From the BIG RAMY LABS catalog</p>
          </div>
          <Link href="/collections/all" className="text-sm font-semibold underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-ink text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
            Let customers speak for us
          </h2>
          <p className="text-white/60 text-sm mb-8">Real reviews from the store</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-white/10 bg-white/5 p-5 animate-rise"
              >
                <div className="text-rex text-sm mb-2">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(Math.max(0, 5 - r.rating))}
                </div>
                <p className="text-sm leading-relaxed" dir="auto">
                  {r.text}
                </p>
                <p className="mt-4 text-xs text-white/50">
                  {r.author} · {r.review_date}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

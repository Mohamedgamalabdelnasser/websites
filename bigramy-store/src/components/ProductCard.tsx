import Image from "next/image";
import Link from "next/link";
import { formatEGP } from "@/lib/money";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const price = product.min_price ?? 0;
  const max = product.max_price ?? price;
  const compare = product.compare_at;
  const onSale = compare != null && compare > price;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block animate-rise"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f6f6f6]">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-black/30 text-sm">
            No image
          </div>
        )}
        {onSale && (
          <span className="absolute left-3 top-3 rounded bg-sale px-2 py-1 text-xs font-bold text-white">
            Sale
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold leading-snug text-ink group-hover:underline">
          {product.title}
        </h3>
        <p className="text-sm text-ink/80">
          {price !== max ? (
            <>
              From {formatEGP(price)}
            </>
          ) : (
            formatEGP(price)
          )}
          {onSale && compare != null && (
            <span className="ml-2 text-black/40 line-through">
              {formatEGP(compare)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

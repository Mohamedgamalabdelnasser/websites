import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold tracking-tight">
            BIG RAMY LABS
          </p>
          <p className="mt-2 text-sm text-black/60">GO BIG OR GO HOME!</p>
          <p className="mt-4 text-sm text-black/50">
            RED REX supplements — proteins, creatine, aminos &amp; performance.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider mb-3">Shop</p>
          <ul className="space-y-2 text-sm text-black/70">
            <li>
              <Link href="/collections/essential-proteins">Essential Proteins</Link>
            </li>
            <li>
              <Link href="/collections/creatine">Creatine</Link>
            </li>
            <li>
              <Link href="/collections/amino-acids-eaas">Amino Acids &amp; EAAs</Link>
            </li>
            <li>
              <Link href="/collections/pre-workout">Pre-Workout</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider mb-3">Manage</p>
          <ul className="space-y-2 text-sm text-black/70">
            <li>
              <Link href="/admin">Admin portal</Link>
            </li>
            <li>
              <Link href="/admin/offers">Offers &amp; bundles</Link>
            </li>
            <li>
              <Link href="/cart">Cart</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 py-4 text-center text-xs text-black/40">
        © {new Date().getFullYear()} BIG RAMY LABS · Catalog mirrored from eg.bigramylabs.com
      </div>
    </footer>
  );
}

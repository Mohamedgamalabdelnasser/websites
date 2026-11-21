import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/offers", label: "Offers & Bundles" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/", label: "← Storefront" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-rex text-xs font-bold tracking-[0.2em] uppercase">
              BIG RAMY LABS
            </p>
            <h1 className="text-lg font-bold">Store Admin</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-white/15 px-3 py-1.5 hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
